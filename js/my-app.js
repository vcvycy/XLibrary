// Initialize your app
var myData={
	isLogin:false,
	user_info: null,          //登陆信息
	returned_books:null,
	not_returned_books:null
} 
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipePanelOnlyClose: true,
	pushState: true,
	template7Pages: true 
});

/* 判断是否登陆，如果登陆，载入登陆信息、存取书信息 */
function index_init(){   
	home_vue = new Vue({
		el:'.user_login_info',
		delimiters: ['${', '}'],
		data:{ 
			g_data:myData
		},
        methods: { 
			logout: function(){
				$.get("./API/account/logout.php",function(data){ 
					obj = JSON.parse(data);
					if(obj.error_code==0){
						location.href="index.html";
					}else
					    alert(obj.data);
				});
			}
		}
	}); 
	//借阅记录
	rent_recort = new Vue({
		el :"#rent-record",
		delimiters: ['${', '}'],
		data:{
			"title":"我的借阅记录",
			"returned_books":[],
			"not_returned_books":[]
		}
	});
	//捐书记录
	donation_record = new Vue({
		el :".popup-donation-record",
		delimiters: ['${', '}'],
		data:{
			"title":"Donation",
			"accepted":[],
			"waiting":[],
			"rejected":[]
		} 
	});
	menu_vue = new Vue({
		el : ".views",
		delimiters: ['${', '}'],
		data:{
			g_data :myData,
			word :"哈哈"
		}
	});
	/* 以下通过ajax获取信息 */
	// 用户信息
	$.ajax({
		url: "./API/account/getCurUserInfo.php?",
		dataType: "json",
		data: {
			isLogin :false,
			user_info:{}
		},
		async: true,
		success: function (data) { 
			console.log(data);
			if(data.error_code==0){ 
				home_vue.g_data.user_info = data.data;
				home_vue.g_data.isLogin = true; 
			}else {  
				home_vue.g_data.isLogin=false;
				myApp.popup(".popup-login");
			}
		}
	});
	//借阅记录
	$.ajax({
		url: "./API/book/myBooksBorrowList.php",
		dataType: "json",
		data: {},
		async: true,
		success: function (data) {
			console.log(data.data);
			if(data.error_code==0){
				rent_recort.returned_books = myData.returned_books =data.data.returned;
				rent_recort.not_returned_books = myData.not_returned_books= data.data.not_returned;
			}else {
			}
		}
	});
	//捐书记录
	$.ajax({
		url: "./API/book/myBooksDonationList.php",
		dataType: "json",
		data: {},
		async: true,
		success: function (data) {
			aaaa=data;
			console.log(data.data);
			console.log(data.data["审核通过"]);
			if(data.error_code==0){
				donation_record.accepted =data.data["审核通过"];
				donation_record.rejected = data.data["审核失败"];
				donation_record.waiting = data.data["等待审核"];
			}else {
			}
		}
	});
}
// Export selectors engine
var $$ = Dom7;
myApp.onPageBeforeInit('home', function(page){
	console.log("after");
	if (sessionStorage.getItem("sid")){
		$$('#login').addClass("disabled");
	}
})
myApp.onPageInit('home', function(page) {
	index_init();
}).trigger(); //And trigger it right away
function cbBarcode(result){
    //console.log(result);
    if (!result){
        alert("检测不到ISBN码");
    }else{
        // alert(result.codeResult.code);
        isbn = result.codeResult.code;
        $.ajax({
            url: "./API/isbn.php?",
            dataType: "json",
            data: {
                "isbn": isbn,
            },
            async: true,
            success: function (data) {
                if(data.error_code==0){
                    myApp.closeModal('.popup-scan');
                    mainView.router.load({'url':'BorrowSuccessfully.html',
                        'ignoreCache': true});
                    sessionStorage.setItem("bookname", data.data.title);
                    sessionStorage.setItem("publisher", data.data.publisher);
                    sessionStorage.setItem("author", data.data.author);
                    sessionStorage.setItem("isbn", data.data.isbn);
                    // mainView.router.load('BorrowSuccessfully');
                    // mainView.router.loadPage('BorrowSuccessfully.html');
                }else {
                }
            },
            error: function (xhr, textStatus) {
                console.log('错误');
                console.log(xhr);
                console.log(textStatus);
            },
        });
    }
} 

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false,
});
var subnaview = myApp.addView('.view-subnav');


$(document).ready(function() {
		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();
		$(".close-popup").click(function() {					  
			$("label.error").hide();
		});
		$('.close_info_popup').click(function(e){
			$('.info_popup').fadeOut(500);						  
		});
});


$$(document).on('pageInit', function (e) {
		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();
		$(".close-popup").click(function() {					  
			$("label.error").hide();
		});

	
})

$("#LoginForm").validate({
	submitHandler: function(form){
		console.log("test");
		var formData = myApp.formToJSON('#LoginForm');
		console.log(JSON.stringify(formData));
		$.ajax({
			url: "./API/account/login.php",
			dataType: "json",
			data: formData,
			type: "post",
			async: true,
			success: function (data) { 
				if(data.error_code==0){
					myApp.closeModal('.popup-login');
					$("#login").attr("disabled",true);
					location.reload();
				}else
				if(data.error_code==-3){
					alert("需要输入验证码！请先前往 i.xmu.edu.cn 尝试登陆，登陆成功后再在此页面登陆。点击确定跳转过去。")
					window.open("http://i.xmu.edu.cn"); 
				}else
				{
					alert("用户名或密码错误");
				}
			},
			error: function (xhr, textStatus) {
				console.log('错误');
				console.log(xhr);
				console.log(textStatus);
			},
		});

	}
});
myApp.onPageInit('music', function (page) {
		  audiojs.events.ready(function() {
			var as = audiojs.createAll();
		  });
})
myApp.onPageInit('videos', function (page) {
		  $(".videocontainer").fitVids();
})
myApp.onPageBeforeInit('BorrowSuccessfully',function (page) {
    if(sessionStorage.getItem("bookname")){
        console.log('value');
        bsapp = new Vue({
            el: '#BorrowForm',
            delimiters:["@{","}"],
            data: {
                book: {
                    name: sessionStorage.getItem("bookname"),
                    publisher: sessionStorage.getItem("publisher"),
                    author: sessionStorage.getItem("author")
                },
            },
        });
    }else{
        console.log('novalue')
        bsapp = new Vue({
            el: '#BorrowForm',
            delimiters:["@{","}"],
            data: {
                book: {
                    name: "计算机导论",
                    publisher: "机械工业出版社",
                    author: "XXX",
                },
            },
        });
    } 
})
// $$(document).on('pageInit', '.page[data-page="tables"]', function (e) 
myApp.onPageInit('books_list', function (page) {
    // Do something here when page with data-page="about" attribute loaded and initialized
    books_each_page = 15;
    books_list_vue = new Vue({
        delimiters: ['${', '}'],
        el: '#books-list-div',
        data: {
            books:[],
            page_id:1,
			total_pages:0,
			total_books:0
        },
        // computed:{},
        methods: {
			getbook: (page_id)=>{
				books_list_vue.page_id = page_id;
				$.ajax({
					url: "./API/public_api/getBooksListInLibrary.php",
					dataType: "json",
					data:{
						page_id: page_id,
						books_each_page: books_each_page,
					},
					success(data){
						if (data.error_code==0){
							console.log(data.data);
							books_list_vue.books= data.data.books; 
							books_list_vue.total_pages=data.data.total_pages; 
							books_list_vue.total_books=data.data.total_books;
						}else{
							alert("读取失败");
						}
					}
				})
			},
            showDetail:(book)=>{ 
				alert(`出版日期：${book.pubdate}；ISBN：${book.isbn}；简介：${book.summary}`);
			},
			goto_page: (pageid)=>{
				pageid-=1;
				total = books_list_vue.total_pages;
				pageid = (pageid%total+total)%total+1;
				books_list_vue.getbook(pageid);
			},
            prev_page: (event)=> {
				books_list_vue.goto_page(books_list_vue.page_id-1); 
            },
            next_page: (event)=> {
				books_list_vue.goto_page(books_list_vue.page_id+1); 
            }
        }
	}); 
	books_list_vue.getbook(1);
});
myApp.onPageInit('index', function (page) { 
	location.href="./";
});
myApp.onPageInit('return-book', function (page) {  
	return_book_vue=new Vue({
		el:"#return—book-div",
		delimiters:["@{","}"],
		data:{
			g_data :myData
		},
		methods:{
			choose_image:(isbn)=>{
				alert("请将图书放到还书架上，然后在书架上拍照上传，即可还书成功！"); 
				dom_file=$("<input type=file accept='image/*'></input>");
				dom_file.change(function(){    
					// 获取图片blob地址src
					let src, url = window.URL || window.webkitURL || window.mozURL, files = dom_file[0].files;
					if (files.length==0) {alert("没有选择图片");return ;} 
					return_book_vue.return_book(isbn,files[0]);
					//开始还书
				});
				dom_file.click();  
			},
			return_book:(isbn, file)=>{
				var returnForm = new FormData();
				returnForm.append("image",file);
				returnForm.append("isbn",isbn);
				$.ajax({
					url: "./API/book/returnBookWithImage.php?",
					dataType: "json",
					data: returnForm,
					type: "post",
					processData: false,
					contentType: false,
					success: function (data) {
						if(data.error_code==0){
							alert("还书成功");
							location.reload();
						}else {
							alert(data.data);
						}
					}
				});
			}
		}
	});
});
myApp.onPageInit('borrow_book', function (page) { 
	borrow_book_vue = new Vue({
		el: '#borrow_div',
		delimiters:["@{","}"],
		data: {
			cur_status: 0,               // 0表示等待识别图片，1表示正在识别，2表示识别成功 
			isbn : null,
			phone : "",
			error_msg: null,
			book: { 
	            name: "",
	            publisher: "",
	            author: "",
				class: ""
			}
		},
		methods: { 
			selectImage: () => {
				dom_file=$("<input type=file accept='image/*'></input>");
				dom_file.change(function(){  
					borrow_book_vue.cur_status=1;
					console.log(dom_file[0].files);
					let src, url = window.URL || window.webkitURL || window.mozURL, files = dom_file[0].files;
					if (files.length==0) return;
					let file = files[0];
					if (url) {
						src = url.createObjectURL(file);
					} else {
						src = e.target.result;
					}  
					RecognizeBarCode(src,borrow_book_vue.cbAfterRecogBarcode);
				});
				dom_file.click();  
			},
			inputISBNbyHand:()=>{
				borrow_book_vue.cur_status=1;
				dom_input=$("#isbn_by_hand");
				borrow_book_vue.fetchBookInfo();
			},
			cbAfterRecogBarcode: (result)=> {
				if (!result ||!result.codeResult){
					borrow_book_vue.error_msg="无法识别图中ISBN条形码，请重新拍摄或手工输入ISBN!"; 
					borrow_book_vue.cur_status=0;
					return ;
				}
				borrow_book_vue.isbn=result.codeResult.code;
				borrow_book_vue.fetchBookInfo();
			},
			borrow_book:()=> { 
				$.ajax({
					url: "API/book/borrowBook.php",
					dataType: "json",
					data: {
						"isbn": borrow_book_vue.isbn
					},
					async: false,
					success: function (data) { 
						if(data.error_code==0){
							alert("借书成功！");
							borrow_book_vue.cur_status=0;
							location.href="./";
						}else{
							alert(data.data);
						}
					}
				});
			}
			,
			fetchBookInfo:()=> {
				$.ajax({
					url: "./API/isbn.php",
					dataType: "json",
					data: {
						"isbn": borrow_book_vue.isbn,
					},
					async: true,
					success: function (data) {
						if(data.error_code==0){
							borrow_book_vue.cur_status=2;
							borrow_book_vue.error_msg = null;
							borrow_book_vue.book={
								name: data.data.title,
								publisher: data.data.publisher,
								author: data.data.author,
								pubdate : data.data.pubdate
							}
						}else {
							borrow_book_vue.cur_status=0;
							borrow_book_vue.error_msg = data.data;
						}
					}
				});
			}
		}
	});
});
myApp.onPageInit('book_donation', function (page) { 
	contact_app = new Vue({
		el: '#donation',
		delimiters:["@{","}"],
		data: {
			cur_status: 0,               // 0表示等待识别图片，1表示正在识别，2表示识别成功 
			isbn : null,
			error_msg:null,
			seen: false,
			fetchType: 1,            // 1:送至分馆；2: 上门取书
			fetchAddr:"如海韵6-XXX",            // 上门取书此字段才有意义
			phone : "",
			book: {
	            name: "",
	            publisher: "",
	            author: "",
				class: ""
			},
	        word: ""
		},
		methods: {
			setFetchType: (type) => {
	            contact_app.fetchType=type;
			},
			selectImage: (e) =>{ 
				contact_app.cur_status=1;
				let src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
				let file = files[0];
				if (url) {
					src = url.createObjectURL(file);
				} else {
					src = e.target.result;
				}  
				RecognizeBarCode(src,contact_app.cbAfterRecogBarcode);
			},
			cbAfterRecogBarcode: (result) => { 
				if (!result ||!result.codeResult){
					contact_app.error_msg="无法识别图中ISBN条形码，请重新拍摄!";
					contact_app.cur_status=0;
				}
				contact_app.isbn=result.codeResult.code;
				$.ajax({
					url: "./API/isbn.php",
					dataType: "json",
					data: {
						"isbn": contact_app.isbn,
					},
					async: true,
					success: function (data) {
						if(data.error_code==0){
							contact_app.cur_status=2;
							contact_app.error_msg = null;
							contact_app.book={
								name: data.data.title,
								publisher: data.data.publisher,
								author: data.data.author,
								class: ""
							}
						}else {
							contact_app.cur_status=0;
							contact_app.error_msg = data.data;
						}
					}
				});
			},
			DonateBook:(e)=>{
				e.preventDefault(); 
				console.log(JSON.stringify(contact_app.fetchType));
				if (contact_app.fetchType==1) {
					//1表示送至分馆
					how_to_fetch = {"how":1,
					"phone":contact_app.phone};
				}else {
					how_to_fetch = {"how":2,
						"where":contact_app.fetchAddr,
					"phone":contact_app.phone};
				} 
				$.ajax({
					url: "API/book/donateBook.php?",
					dataType: "json",
					data: {
						"isbn": contact_app.isbn,
						"donator_word":contact_app.word,
						"how_to_fetch": JSON.stringify(how_to_fetch)  
					},
					async: false,
					success: function (data) { 
						if(data.error_code==0){
							alert(data.data);
							location.reload(); 
						}else{
							alert(data.data);
						}
					},
					error: function (xhr, textStatus) {
						console.log('错误');
						console.log(xhr);
						console.log(textStatus);
					},
				}); 
			}
		}
	});
}) 

myApp.onPageInit('form', function (page) {
    $("#CustomForm").validate({
        rules: {         
            selectoptions: {
                required: true
            }
        },
        messages: {
            selectoptions: "Please select one option"
        }
    });
	var calendarDefault = myApp.calendar({
		input: '#calendar-input',
	});   

		
})
myApp.onPageInit('blog', function (page) {
 
		$(".posts li").hide();	
		size_li = $(".posts li").size();
		x=4;
		$('.posts li:lt('+x+')').show();
		$('#loadMore').click(function () {
			x= (x+1 <= size_li) ? x+1 : size_li;
			$('.posts li:lt('+x+')').show();
			if(x == size_li){
				$('#loadMore').hide();
				$('#showLess').show();
			}
		});

})
myApp.onPageInit('blogsingle', function (page) {
    $(".like").click(function (e) {
        $(this).toggleClass('cs');
    });
})

myApp.onPageInit('shop', function (page) {
			
		$('.qntyplusshop').click(function(e){
									  
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal)) {
				$('input[name='+fieldName+']').val(currentVal + 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
			
		});
		$(".qntyminusshop").click(function(e) {
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal) && currentVal > 0) {
				$('input[name='+fieldName+']').val(currentVal - 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
		});	
  
})
myApp.onPageInit('shopitem', function (page) {
		$(".swipebox").swipebox();	
		$('.qntyplusshop').click(function(e){
									  
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal)) {
				$('input[name='+fieldName+']').val(currentVal + 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
			
		});
		$(".qntyminusshop").click(function(e) {
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal) && currentVal > 0) {
				$('input[name='+fieldName+']').val(currentVal - 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
		});	
  
})
myApp.onPageInit('myBookshelf', function (page) {
			
    $('.item_delete').click(function(e){
        // e.preventDefault();
        // var currentVal = $(this).attr('id');
        // $('div#'+currentVal).fadeOut('slow');
        if (confirm("确认要删除？")) {
            var box = e.parentNode;
            var id = box.getAttribute("noticeid");
            console.log(id);
            $.ajax({
                url: "../back/clanotice/del.php?",
                dataType: "json",
                data: {
                    "id": id,
                },
                type: "post",
                async: true,
                success: function (data) {
                    remove(box.parentNode);
                    alert("删除成功");
                },
                error: function (xhr, textStatus) {
                    console.log('错误');
                    console.log(xhr);
                    console.log(textStatus);
                },
            });
        }
    });
})
myApp.onPageInit('photos', function (page) {
	$(".swipebox").swipebox();
	$("a.switcher").bind("click", function(e){
		e.preventDefault();
		
		var theid = $(this).attr("id");
		var theproducts = $("ul#photoslist");
		var classNames = $(this).attr('class').split(' ');
		
		
		if($(this).hasClass("active")) {
			// if currently clicked button has the active class
			// then we do nothing!
			return false;
		} else {
			// otherwise we are clicking on the inactive button
			// and in the process of switching views!

  			if(theid == "view13") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_13_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_12");
				theproducts.addClass("photo_gallery_13");

			}
			
			else if(theid == "view12") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_12_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_12");

			} 
			else if(theid == "view11") {
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_11_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_12");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_11");

			} 
			
		}

	});	
})

myApp.onPageInit('chat', function (page) {
// Conversation flag
var conversationStarted = false;
 
// Init Messages
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
 
// Init Messagebar
var myMessagebar = myApp.messagebar('.messagebar');
 
// Handle message
$$('.messagebar .link').on('click', function () {
  // Message text
  var messageText = myMessagebar.value().trim();
  // Exit if empy message
  if (messageText.length === 0) return;
 
  // Empty messagebar
  myMessagebar.clear()
 
  // Random message type
  var messageType = (['sent', 'received'])[Math.round(Math.random())];
 
  // Avatar and name for received message
  var avatar, name;
  if(messageType === 'received') {
    avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
    name = 'Kate';
  }
  // Add message
  myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  })
 
  // Update conversation flag
  conversationStarted = true;
});  
})           

