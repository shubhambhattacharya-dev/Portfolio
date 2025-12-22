import urllib.parse
import sys

with open(sys.argv[1], 'r') as f:
    url = f.read()
encoded_url = urllib.parse.quote(url, safe="~()*!.'")
print(f"{encoded_url}")