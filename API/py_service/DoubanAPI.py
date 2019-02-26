import requests
import sys
import os
from bs4 import BeautifulSoup
import random
import urllib.parse
import time
import json
### 豆瓣 API ###
# (1) [XML]  http://api.douban.com/book/subject/isbn/9787308083256
# (2) [JSON] https://api.douban.com/v2/book/isbn/:9787111128069
def getBookInfoByISBN(isbn):
    url = "https://api.douban.com/v2/book/isbn/%s" %(isbn)
    resp=requests.get(url)
    parsed = json.loads(resp.text)
    if "msg" in parsed:
        return None
    else:
        return parsed

if __name__ == "__main__":
    a=getBookInfoByISBN("9787308083256")
    if a==None:
        print("No")
    else:
        print(a)