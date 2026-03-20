import httpx

print("Test 1 - Direct CrossRef API:")
try:
    response = httpx.get(
        "https://api.crossref.org/works",
        headers={
            "User-Agent": "PaperPilot/1.0 (mailto:paperpilot@research.com)"
        },
        params={
            "query": "Attention is All You Need",
            "rows": 3,
            "select": "title,author,published,is-referenced-by-count,DOI"
        },
        timeout=30
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

print("\nTest 2 - Citation Service:")
try:
    response = httpx.post(
        "http://localhost:8004/search",
        json={"query": "Attention is All You Need", "limit": 3},
        timeout=30
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
