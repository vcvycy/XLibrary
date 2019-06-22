import pymysql
import json
class BookRetrieval:
    def __init__(self,config):
        config= config["db"]
        self.mysql = pymysql.connect(host=config["host"],
                                     user=config["user"],
                                     passwd=config["pass"],
                                     db=config["dbname"],
                                     use_unicode=False,
                                     charset="latin1")
        self.max_book_id=0
        self.books=[]
        self.id2book = {}
        self.kgram = {}
        self.update_books()
        return

    # 添加关键字  key(电脑) -> book_id (2) ->score(10)
    def add(self,key,book):
        if key not in self.kgram:
            self.kgram[key] ={}
        book_id = book["id"]
        if book_id not in self.kgram[key]:
            self.kgram[key][book_id]=0
        score = 1
        if len(key)==2:
            score = 5
        self.kgram[key][book_id] +=score
        return

    def updateKGram(self,book):
        str = book["title"]+book["author"]+book["publisher"]
        # unigram
        l = len(str)
        for i in range(l):
            # unigram
            uni = str[i:i+1]
            self.add(uni,book)
            # bigram
            bi = str[i:i+2]
            if len(bi)==2 :
                self.add(bi,book)
        return

    def myUtf8Decoder(self,kv):
        for key in kv:
            val=kv[key]
            if type(val)==type(b""):
                val = str(val, encoding="utf8")
            kv[key]=val
        return kv

    # 从服务器读取
    def update_books(self):
        cursor = self.mysql.cursor()
        cursor.execute("select * from book where id> %d" %(self.max_book_id))
        data = cursor.fetchall()
        field_name = [field[0] for field in cursor.description]
        for item in data:
            item = dict(zip(field_name, item))
            book = self.myUtf8Decoder(item)
            self.updateKGram(book)
            self.books.append(book)
            self.max_book_id = max(self.max_book_id, book["id"])
            self.id2book[book["id"]] = book
        return

    # 返回 book_id -> score
    def find(self,result,key):
        if key in self.kgram:
            idsets = self.kgram[key]
            for id in idsets:
                score = idsets[id]
                if id not in result:
                    result[id] = 0
                result[id] +=score
        return

    # 返回{ book_id -> cnt} , {book_id->book}
    def user_search(self,str):
        self.update_books()
        id2score={}
        id2b = {}
        l = len(str)
        for i in range(l):
            # unigram
            uni = str[i:i+1]
            self.find(id2score,uni)
            # bigram
            bi = str[i:i+2]
            if len(bi)==2 :
                self.find(id2score,bi)
        for id in id2score:
            id2b[id] = self.id2book[id]

        books=[]
        # 按照分数从高到低排序
        while len(id2score)!=0:

        return id2score, id2b
    #
    def show(self):
        print("[*] 当前最大的book_id = %s" %(self.max_book_id))
        for item in self.books:
            print("  [*] %s %s" %(item["title"],item["author"]))
        return

####### 测试 #########
import os
def load_config(path):
    f = open(path,"r")
    data = f.read()
    obj = json.loads(data)
    return obj
if __name__ == "__main__":
    config_path= os.path.join(os.path.split(__file__)[0],"../config.json");
    config=load_config(config_path)
    b = BookRetrieval(config)
    id2score,id2book = b.user_search("刑法与民法")
    for id in id2score:
        print("[*] score=%s" %(id))
        print("   [*] %s" %(id2book[id]["title"]))
    # b.show();