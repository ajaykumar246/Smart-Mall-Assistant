# chatbot_logic/utils.py

import google.generativeai as genai
import numpy as np
from .setup import embedding_model, embeddings_collection, gemini_model, PROMPT_TEMPLATE

def cosine_similarity(vec1, vec2):
    """
    Compute cosine similarity between two vectors.
    """
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2) + 1e-10)

def get_chatbot_response(user_query):
    """
    Performs a vector search and generates a chatbot response.
    """
    try:
        # Get query embedding
        query_embedding = genai.embed_content(model=embedding_model, content=user_query)["embedding"]
        print(f"Query embedding length: {len(query_embedding)}")
        
        # Fetch all documents from MongoDB
        all_docs = list(embeddings_collection.find({}))
        
        if not all_docs:
            context = "No documents found in the database."
        else:
            # Compute similarity scores for all documents
            scored_docs = []
            for doc in all_docs:
                if "embedding" in doc and doc["embedding"]:
                    similarity = cosine_similarity(query_embedding, doc["embedding"])
                    scored_docs.append({
                        "text": doc.get("text", ""),
                        "score": similarity,
                        "source_collection": doc.get("source_collection", "")
                    })
            
            # Sort by similarity score and get top 5
            scored_docs.sort(key=lambda x: x["score"], reverse=True)
            top_docs = scored_docs[:5]
            
            # Build context from top results
            context_docs = [doc["text"] for doc in top_docs if doc["text"]]
            context = "\n".join(context_docs) if context_docs else "No relevant documents found."

        # Create the final prompt with the context and user query
        prompt = PROMPT_TEMPLATE.format(user_query=user_query, context=context)
        
        # Generate the response
        response = gemini_model.generate_content(prompt)
        
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        return "Sorry, I am currently experiencing a technical issue. Please try again later."