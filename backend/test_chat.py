import requests
import json

queries = [
    "south indian restaurant",
    "electronics store",
    "fashion clothing",
    "KFC menu card",
    "what stores are on floor 2",
]

with open("chat_multi_test.txt", "w", encoding="utf-8") as f:
    for q in queries:
        r = requests.post(
            "http://localhost:8000/api/chat/",
            json={"message": q},
            timeout=30
        )
        data = r.json()
        f.write(f"{'='*60}\n")
        f.write(f"QUERY: {q}\n")
        f.write(f"HAS_RESULTS: {data.get('has_results')}\n")
        f.write(f"RESPONSE:\n{data.get('response', '')}\n\n")

print("Done - check chat_multi_test.txt")
