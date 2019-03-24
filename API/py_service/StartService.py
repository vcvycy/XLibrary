from STULogin import STULogin
from bottle import *
import json
import BooksAPI

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
        return returnJSON(-1,"ISBN码不存在")
    else:
        return returnJSON(0,rst)

@get("/login")
def login():
    sid = request.query.sid
    pwd = request.query.pwd
    stu = STULogin(sid,pwd)
    #
    if stu.needCaptcha():
        return returnJSON(-1,"尝试次数太多,请稍后再试。或者前往i.xmu.edu.cn重置密码")
    if stu.login()==None:
        data={
            "student" : stu.getStuInfo()
        }
        return returnJSON(0,data)
    else:
        return returnJSON(-1,stu.loginFailedReason)

if __name__ == "__main__":
    print("[*] 此服务用于登陆、ISBN信息提取等...")
    run(host="localhost", port=81) 