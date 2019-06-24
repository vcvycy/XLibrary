sidebar_data={
    "sidebar_list": [
            {
                "href":"index.html",
                "icon" :"icon-home",
                "name" :"主页"
            },
            {
                "href" :"sites.html",
                "icon" :"fa fa-bar-chart",
                "name" :"藏书库"
            },
            {
                "href":"book_review_index_by_sid.html",
                "icon" :"icon-grid",
                "name" :"图书入馆审核"
            },
            {
                "href":"books.html",
                "icon" :"icon-grid",
                "name" :"图书"
            },
            {
                "href":"students.html",
                "icon" :"fa fa-bar-chart",
                "name" :"学生"
            },
            {
                "href":"account.html",
                "icon" :"fa fa-bar-chart",
                "name" :"账户相关"
            }
        ],
    "logo":{
        "title" :"厦大图书自助借取",
        "subtitle":"后台管理系统",
        "icon":"img/favicon.ico"
    }
}; 
// 获取项目的根目录
function getRootURL(){
    idx = window.location.href.indexOf("admin");
    return window.location.href.substr(0,idx);
} 
function logout(){
    url=`${getRootURL()}API/admin/logout.php`;
    $.get(url,function(data){
        obj= JSON.parse(data);
        if (obj.error_code == 0){
            window.location.href=`${getRootURL()}admin/login.html`;
        }
    });
}
function curPageNeedLogin(){
    root=getRootURL();
    url=`${root}API/admin/is_login.php`;
    $.get(url,function(data){
        obj= JSON.parse(data);
        if (obj.error_code !=0){
            alert("请先登陆!");
            window.location.href = "login.html";
        }
    });
}
// 路由
pages_init ={
    "index.html" : function(){
        window.location.href="books.html";
        sidebar();
        curPageNeedLogin();
    },
    "students.html" : function(){
        sidebar();
        curPageNeedLogin();
        // 载入学生列表
        vue_stu= new Vue({
            el: document.getElementById("student_list"),
            data: {
                stu_list:[],
                cur_stu_info :null
            },
            methods: { 
                goback:()=>{
                    vue_stu.cur_stu_info=null;
                },
                showStuDetail:(sid, name)=>{ 
                    if ($("#toggle-btn").attr("class")=="menu-btn active")
                        $("#toggle-btn").click();
                    vue_stu.cur_stu_info={
                        "name":name,
                        "sid":sid,
                        "borrow_list":[],
                        "donate_list":[] 
                    }
                    // 借书/还书信息
                    url=`${getRootURL()}API/admin/getStuBorrowList.php?sid=${sid}`;
                    $.get(url,function(data){
                        obj = JSON.parse(data);
                        if (obj.error_code==0){
                            vue_stu.cur_stu_info.borrow_list = obj.data;
                        }else{
                            alert("unknown error"+url);
                        }
                    });
                    // 捐书信息
                    url=`${getRootURL()}API/admin/getStuDonationList.php?sid=${sid}`;
                    $.get(url,function(data){
                        obj = JSON.parse(data);
                        if (obj.error_code==0){
                            vue_stu.cur_stu_info.donate_list = obj.data;
                        }else{
                            alert("unknown error"+url);
                        }
                    });

                }
            }
          });
        url =`${getRootURL()}/API/admin/getStudentsList.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){
                vue_stu.stu_list = obj.data;
            }else alert("未知失败"+url);
        });
    },
    "sites.html" : function(){
        sidebar();
        curPageNeedLogin();  
        vue_sites=new Vue({
            el: document.getElementById("site_list"),
            data: {
                site_list:[],
                new_site:{
                    name:"",
                    description:""
                }
            },
            methods:{
                // 删除
                "deleteSite": (site_id)=>{
                    var b=confirm("确认删除此藏书点??");
                    if (!b) return;
                    url=`${getRootURL()}API/site/deleteSite.php?id=${site_id}`;
                    $.get(url,function(data){
                        obj = JSON.parse(data);
                        if (obj.error_code==0){
                            location.reload();
                        }else{
                            alert(obj.data);
                        }
                    });
                },
                // 更新
                "updateSite": (item)=>{  
                    $.ajax({
                        url: `${getRootURL()}/API/site/updateSiteByID.php`,
                        dataType: "json",  
                        data:item,
                        success: function (data) { 
                            if (data.error_code==0)
                                location.reload();
                            else 
                                alert(data.data);
                        }
                    });
                },
                "addSite" : (name,description)=>{
                    $.ajax({
                        url: `${getRootURL()}/API/site/addSite.php`,
                        dataType: "json",  
                        data:vue_sites.new_site,
                        success: function (data) { 
                            if (data.error_code==0)
                                location.reload();
                            else 
                                alert(data.data);
                        }
                    }); 
                }
            }
        });
        // 载入所有藏书点
        url=`${getRootURL()}API/site/getAllSites.php`;
        $.get(url,function(data){
            obj = JSON.parse(data);
            if (obj.error_code==0){
                vue_sites.site_list = obj.data;
            }else{
                alert("unknown error"+url);
            }
        });
    },
    "books.html" : function(){
        sidebar();
        curPageNeedLogin();
        // 载入图书列表
        var vue_books= new Vue({
            el: document.getElementById("books"),
            data: {
                books:[], 
                cur_book:null,
                cur_borrow_stus:null,
                cur_donate_stus:null,
                cur_stock_in_sites:null
            },
            methods: {  
                goback:()=>{
                    vue_books.cur_book=null;
                    vue_books.cur_borrow_stus=null;
                    vue_books.cur_donate_stus=null;
                    vue_books.cur_stock_in_sites=null;
                },
                stockInSites:(book_id)=>{
                    url =`${getRootURL()}/API/site/getStockInAllSites.php?book_id=${book_id}`;
                    $.get(url,function(data){
                        obj= JSON.parse(data);
                        if (obj.error_code==0){
                            vue_books.cur_stock_in_sites=obj.data;
                        }
                    })
                },
                // 捐书者列表
                whoDonateTheBook:(isbn,title)=>{
                    url =`${getRootURL()}API/public_api/whoDonateTheBook.php?isbn=${isbn}`;
                    $.get(url,function(data){
                        obj= JSON.parse(data);
                        if (obj.error_code==0){
                            vue_books.cur_book={
                                "title" : title,
                                "isbn"  : isbn
                            };
                            vue_books.cur_donate_stus = obj.data;
                        }
                    })
                },
                // 借书列表
                whoBorrowTheBook:(isbn,title)=>{
                    url =`${getRootURL()}API/public_api/whoBorrowTheBook.php?isbn=${isbn}`;
                    $.get(url,function(data){
                        obj= JSON.parse(data);
                        if (obj.error_code==0){
                            vue_books.cur_book={
                                "title" : title,
                                "isbn"  : isbn
                            };
                            vue_books.cur_borrow_stus = obj.data;
                        }
                    })
                } 
            }
          });
        url=`${getRootURL()}API/public_api/getBooksListInLibrary.php?page_id=1&books_each_page=10000`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){
                vue_books.books = obj.data.books;
            }else
            alert("unknown error"+url);
        });
    },
    // "book_review.html":function(){ 
    //     sidebar();
    //     curPageNeedLogin();
    //     vue_review= new Vue({
    //         el: document.getElementById("book_review"),
    //         data: {
    //             sites:[],
    //             book_list : [],
    //             hide_has_reviewed : window.localStorage["hide_has_reviewed"]==undefined?false:window.localStorage["hide_has_reviewed"]=="true"
    //         },
    //         methods: { 
    //             setReviewStatus:(id,status)=>{   
    //                 var site_id="";
    //                 if (status==1){  //如果是通过则需要选择要入的馆
    //                     site_id=$(`#select_${id}`).val();
    //                     if (site_id=="0"){alert("请选择要入哪个库!");return;}
    //                 }
    //                 url=`${getRootURL()}API/admin/reviewDonation.php?book_donate_id=${id}&status=${status}&site_id=${site_id}`;
    //                 $.get(url,function(data){
    //                     obj=JSON.parse(data);
    //                     if (obj.error_code==0){
    //                         window.location.reload();
    //                     }else
    //                     alert(obj.data);
    //                 })
    //             },
    //             accept:(id)=>{ 
    //                 setReviewStatus(id,1);
    //             },
    //             reject:(id)=>{
    //                 setReviewStatus(id,-1);
    //             },
    //             reset:(id)=>{
    //                 var b=confirm("重置状态后，将会变成待审核,且从其入库点删掉一本书，是否继续？");
    //                 if (!b) return; 
    //                 url=`${getRootURL()}API/admin/resetDonationStatus.php?book_donate_id=${id}`;
    //                 $.get(url,function(data){
    //                     obj=JSON.parse(data);
    //                     if (obj.error_code==0){
    //                         window.location.reload();
    //                     }else
    //                     alert(obj.data);
    //                 })
    //             },
    //             update_hide: ()=>{ 
    //                 window.localStorage["hide_has_reviewed"]=!vue_review.hide_has_reviewed;
    //             }
    //         }   
    //     });

    //     // 藏书地点
    //     $.ajax({
    //         url: `${getRootURL()}/API/site/getAllSites.php`,
    //         dataType: "json",  
    //         success: function (data) { 
    //             vue_review.sites=data.data;
    //         }
    //     });

    //     // 捐书列表
    //     url=`${getRootURL()}API/admin/getDonationList.php`;
    //     $.get(url,function(data){
    //         obj= JSON.parse(data);
    //         if (obj.error_code==0){
    //             // 打补丁：how_to_fetch
    //             for (var i=0;i<obj.data.length;i++){
    //                 try{
    //                     p = JSON.parse(obj.data[i].how_to_fetch);
    //                     phone = p.phone
    //                     if (p.how==1) 
    //                        fetch = `送至分馆`;
    //                     else if (p.how==2)
    //                        fetch = `上门取书:${p.where}`;
    //                     else
    //                         fetch = `放到书箱`;
    //                 }catch(err){ 
    //                     fetch = `未知字符串:${obj.data[i].how_to_fetch}`;
    //                     phone =``;
    //                 } 
    //                 obj.data[i].how_to_fetch = fetch;
    //             }
    //             vue_review.book_list = obj.data;
                
    //         }
    //     });
    // },
    "book_review_index_by_sid.html":function(){  
        sidebar();
        curPageNeedLogin();
        vue_review= new Vue({
            el: document.getElementById("book_review"),
            data: {
                message:"",
                sites:[],
                need_process_num:0, //需要处理的个数
                book_list : [],
                stu2books :{},    // sid -> 待审核列表
                stu2finished: {},  // sid -> 已审核列表
                hide_has_reviewed : window.localStorage["hide_has_reviewed"]==undefined?false:window.localStorage["hide_has_reviewed"]=="true"
            },
            methods: { 
                initStu2Books: ()=>{ 
                    // 初始化stu2books
                    book_list = vue_review.book_list;
                    stu2books = {}
                    stu2finished ={}
                    for (idx in book_list){
                        item=book_list[idx];
                        sid=item.sid;
                        if (item.status==0){  // 待审核
                            if (!(sid in stu2books)){
                                stu2books[sid]=[]
                            }
                            stu2books[sid].push(item); 
                        }else{
                            if (!(sid in stu2finished)){ // 已审核
                                stu2finished[sid]=[];
                            }
                            stu2finished[sid].push(item);
                        }
                    }
                    vue_review.stu2finished = stu2finished;
                    vue_review.stu2books = stu2books;
                },
                setReviewStatus:(id,status,site_id)=>{     // 当拒绝的时候,site_id 无意义
                    vue_review.message=`剩余${vue_review.need_process_num}需要处理，请等待...`;
                    url=`${getRootURL()}API/admin/reviewDonation.php?book_donate_id=${id}&status=${status}&site_id=${site_id}`;
                    $.get(url,function(data){
                        obj=JSON.parse(data);
                        if (obj.error_code==0){
                            vue_review.need_process_num--;
                            if (vue_review.need_process_num==0)
                                window.location.reload(); 
                             vue_review.message=`剩余${vue_review.need_process_num}需要处理，请等待...`;
                        }else
                        alert(obj.data);
                    })
                },
                setCheckedStatus: (sid,status) =>{
                    // 对被选中的所有图书进行操作

                    if (status==1){
                        site_id=$(`#select_${sid}`).val();
                        if (site_id=="0"){alert("请选择要入哪个库!");return;}
                    }else
                        site_id=null;
                    vue_review.need_process_num = $(`input[name='checkbox_${sid}']`).length; 
                    $(`input[name='checkbox_${sid}']`).each(function() {
                        if($(this).is(":checked")){
                           donation_id= $(this).val();
                           vue_review.setReviewStatus(donation_id,status,site_id);
                        }
                    });
                },
                accept:(id)=>{ 
                    setReviewStatus(id,1);
                },
                reject:(id)=>{
                    setReviewStatus(id,-1);
                },
                reset:(id)=>{
                    var b=confirm("重置状态后，将会变成待审核,且从其入库点删掉一本书，是否继续？");
                    if (!b) return; 
                    url=`${getRootURL()}API/admin/resetDonationStatus.php?book_donate_id=${id}`;
                    $.get(url,function(data){
                        obj=JSON.parse(data);
                        if (obj.error_code==0){
                            window.location.reload();
                        }else
                        alert(obj.data);
                    })
                },
                update_hide: ()=>{ 
                    window.localStorage["hide_has_reviewed"]=!vue_review.hide_has_reviewed;
                }
            }   
        });

        // 藏书地点
        $.ajax({
            url: `${getRootURL()}/API/site/getAllSites.php`,
            dataType: "json",  
            success: function (data) { 
                vue_review.sites=data.data;
            }
        });

        // 捐书列表
        url=`${getRootURL()}API/admin/getDonationList.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){
                // 打补丁：how_to_fetch
                for (var i=0;i<obj.data.length;i++){
                    try{
                        p = JSON.parse(obj.data[i].how_to_fetch);
                        phone = p.phone
                        if (p.how==1) 
                           fetch = `送至分馆`;
                        else if (p.how==2)
                           fetch = `上门取书:${p.where}`;
                        else
                            fetch = `放到书箱`;
                    }catch(err){ 
                        fetch = `未知字符串:${obj.data[i].how_to_fetch}`;
                        phone =``;
                    } 
                    obj.data[i].how_to_fetch = fetch;
                }
                vue_review.book_list = obj.data;
                vue_review.initStu2Books();  // 转化为sid->(stuInfo, donation_list)的格式
            }
        });
    },
    "login.html": function(){
        // 检查当前是否已经登陆
        root=getRootURL();
        url=`${root}API/admin/is_login.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code ==0)
                window.location.href = "index.html";
        });
        // 登陆按钮
        $("#login").click(function(){
            user = $("#login-username").val();
            pwd  = $("#login-password").val();
            url =  `../API/admin/login.php?user=${user}&pwd=${pwd}`;
            $.get(url,function(data){ 
                obj=JSON.parse(data);
                if (obj.error_code==0){
                    window.location.href="index.html";
                }else{
                    alert(obj.data);
                }

            })
        });
    },
    "account.html": function(){ 
        sidebar();
        curPageNeedLogin();
        vue_account= new Vue({
            el: document.getElementById("account"),
            data: {
                old_pwd:"",
                new_pwd: ""
            },
            methods: { 
                updatePWD:()=>{   
                    url =  `../API/admin/updatePWD.php?old_pwd=${vue_account.old_pwd}&new_pwd=${vue_account.new_pwd}`;
                    $.get(url,function(data){ 
                        obj=JSON.parse(data);
                        if (obj.error_code==0){
                            alert(obj.data);
                            curPageNeedLogin();
                        }else{
                            alert(obj.data);
                        }

                    })
                } 
            }   
          });
    }
}

// ===========
// 获取当前页面的名字
function getCurPageName(){
    url = window.location.href; 
    return getBaseName(url)
}
function getBaseName(url){ 
    a = url.split("/");
    baseName=a[a.length-1]
    baseName = baseName.split("?")[0]
    baseName = baseName.split("#")[0]
    if (baseName=="")
       return "index.html";
    else
       return baseName;
}
// 上面/左边的侧边栏
function sidebar(){
    $(".logout").click(function(){
        logout();
    });
    var ele= $(".side-navbar")[0]; 
    var sidebar_vue = new Vue({
        el: ele,
        data: {
            "sidebar_list" : sidebar_data["sidebar_list"],
            "logo" : sidebar_data["logo"]
        },
        methods: {
            sidebar_active:(href)=>{
                if (getCurPageName()==href)
                  return "active";
                else
                    return "";
            } 
        }
      });
}


//------------------
function main(){
    pageBaseName= getCurPageName();
    // 执行页面对应的js
    if (pageBaseName in pages_init){
        pages_init[pageBaseName]();
    }

}
$(function(){
    main();
})