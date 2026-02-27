import os, sys
from dotenv import load_dotenv
load_dotenv()

out = open("test_results.txt", "w", encoding="utf-8")

import google.generativeai as genai
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Test MongoDB
uri = os.getenv("MONGODB_URI")
out.write(f"URI: {uri[:40] if uri else 'NONE'}\n")
client = MongoClient(uri, server_api=ServerApi("1"))
db = client["auraMallDB"]
coll = db["embeddings"]
count = coll.count_documents({})
out.write(f"Docs in embeddings: {count}\n")

# Check a sample doc
sample = coll.find_one({})
if sample:
    out.write(f"Fields: {list(sample.keys())}\n")
    has_emb = "embedding" in sample
    out.write(f"Has embedding: {has_emb}\n")
    if has_emb:
        out.write(f"Embedding len: {len(sample['embedding'])}\n")
else:
    out.write("No documents found!\n")

# Test Gemini embedding
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
try:
    emb = genai.embed_content(model="models/gemini-embedding-001", content="pizza")
    out.write(f"Embedding generated, len: {len(emb['embedding'])}\n")
except Exception as e:
    out.write(f"Embedding error: {e}\n")
    out.close()
    sys.exit(1)

# Test vector search
try:
    pipeline = [
        {
            "$vectorSearch": {
                "index": "mall",
                "path": "embedding",
                "queryVector": emb["embedding"],
                "numCandidates": 100,
                "limit": 3,
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
    results = list(coll.aggregate(pipeline))
    out.write(f"Vector search results: {len(results)}\n")
    for r in results:
        score = r.get("score", 0)
        source = r.get("source_collection", "?")
        text = r.get("text", "")[:100]
        out.write(f"  Score: {score:.4f} | Source: {source} | Text: {text}\n")
except Exception as e:
    import traceback
    out.write(f"Vector search error: {e}\n")
    out.write(traceback.format_exc())

out.write("\nDONE\n")
out.close()
print("Results written to test_results.txt")
