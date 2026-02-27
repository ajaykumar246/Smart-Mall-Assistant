# chatbot_logic/utils.py

import google.generativeai as genai
from .setup import embedding_model, embeddings_collection, gemini_model, PROMPT_TEMPLATE


def get_chatbot_response(user_query):
    """
    Performs a MongoDB $vectorSearch and generates a structured chatbot response.
    """
    try:
        # Get query embedding using Gemini
        query_embedding = genai.embed_content(
            model=embedding_model, content=user_query
        )["embedding"]

        # Use MongoDB Atlas $vectorSearch for efficient, accurate similarity search
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "mall",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": 100,
                    "limit": 5,
                }
            },
            {
                "$project": {
                    "text": 1,
                    "source_collection": 1,
                    "score": {"$meta": "vectorSearchScore"},
                    "_id": 0,
                }
            },
        ]

        results = list(embeddings_collection.aggregate(pipeline))

        # Filter out low-relevance matches (score threshold)
        relevant_results = [r for r in results if r.get("score", 0) >= 0.5]

        if not relevant_results:
            context = "No relevant information was found in the mall database for this query."
        else:
            # Build rich context from top results
            context_parts = []
            for doc in relevant_results:
                score = doc.get("score", 0)
                source = doc.get("source_collection", "unknown")
                text = doc.get("text", "")
                context_parts.append(
                    f"[Source: {source} | Relevance: {score:.2f}]\n{text}"
                )
            context = "\n\n---\n\n".join(context_parts)

        # Create the final prompt with the context and user query
        prompt = PROMPT_TEMPLATE.format(user_query=user_query, context=context)

        # Generate the response
        response = gemini_model.generate_content(prompt)

        return response.text

    except Exception as e:
        print(f"Chatbot error: {e}")
        import traceback
        traceback.print_exc()
        return "Sorry, I am currently experiencing a technical issue. Please try again later."