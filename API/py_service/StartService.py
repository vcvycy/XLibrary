from STULogin import STULogin
from bottle import *
import json
import BooksAPI
import os
from BookRetrieval import BookRetrieval

def returnJSON(code,data):
    return json.dumps({
        "error_code":code,
        "data" : data
        }
    )

@get("/")
def index():
    # print(os.curdir)
    return static_file("index.html","www")

@get("/isbn/<isbn>")
def getBookInfoByISBN(isbn): 
    rst = BooksAPI.getBookInfoByISBN(isbn)
    if rst == None:
        return returnJSON(-1,"找不到ISBN：{0}对应的图书信息。请先检查ISBN是否识别错误".format(isbn))
    else:
        return returnJSON(0,rst)

@get("/login")
def login():
    sid = request.query.sid
    pwd = request.query.pwd
    stu = STULogin(sid,pwd)
    #
    if stu.needCaptcha():
        return returnJSON(-3,"尝试次数太多,请稍后再试。或者前往i.xmu.edu.cn重置密码")
    if stu.login()==None:
        data={
            "student" : stu.getStuInfo()
        }
        return returnJSON(0,data)
    else:
        return returnJSON(-1,stu.loginFailedReason)
@get("/book_retrieval")
def book_retrieval():
    qry = request.query.qry
    books = br.user_search(qry)
    return returnJSON(0,books)

def load_config(path):
    f = open(path,"r")
    data=f.read()
    obj=json.loads(data)
    return obj

if __name__ == "__main__": 
    config_path= os.path.join(os.path.split(__file__)[0],"../config.json")
    config=load_config(config_path)
    br = BookRetrieval(config)
    # exit();
    print("[*] 此服务用于登陆、ISBN信息提取等...")
    port = int(config["pyAddr"].split(":")[-1])
    run(host="localhost", port=port)