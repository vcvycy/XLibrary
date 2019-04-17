// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipePanelOnlyClose: true,
	pushState: true,
    template7Pages: true,
    // template7Data:{
    //   "url:blog-single.html" :{
	 //   name:'没有重量的生存',
    //    contantIntro:'本书是作者近几年写的散文随笔作品的合集。作者抓住当代社会生活中所习以为常的事物，如网络，电视，旅游等，以冷静客观的笔触揭示我们日常生活中的荒诞性，在传统与现代的交汇中思考，与审视当代文化，具有浓郁的当代色彩和古典主义的诗意美。',
    //    publishingHouse:"北京:昆仑出版社,2003",
		// author:'南帆',
    //    site:'法学分馆',
		// state:'可借',
		// contactInfo:'13899999999'
	 //  }
    // }
});

// Export selectors engine
var $$ = Dom7;
myApp.onPageBeforeInit('home', function(page){
	console.log("after");
	if (sessionStorage.getItem("sid")){
		$$('#login').addClass("disabled");
	}
})
myApp.onPageInit('home', function (page) {
	if (sessionStorage.getItem("sid")){
		$$('#login').addClass("disabled");
		new Vue({
			el:'#userInfo',
			data:{
				username: sessionStorage.getItem("name"),
				studentnumber: sessionStorage.getItem("sid")
			}
		})
	} else{
		$.ajax({
			url: "./API/account/getCurUserInfo.php?",
			dataType: "json",
			data: {
			},
			async: true,
			success: function (data) {
				if(data.error_code==0){
					sessionStorage.setItem("sid", data.data.sess["stu/sid"]);
					sessionStorage.setItem("name", data.data.sess["stu/name"]);
					$$('#login').addClass("disabled");
				}else {
					console.log("tiao");
					myApp.popup(".popup-login");
				}
			},
			error: function (xhr, textStatus) {
				console.log('错误');
				console.log(xhr);
				console.log(textStatus);
			},
		});
	}

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
let tmpl = '<li class="uploader__file" style="background-image:url(#url#)"></li>',
    $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
    $uploaderInput_1 = $("#uploaderInput_1"),
    $uploaderFiles_1 = $("#uploaderFiles_1")
$uploaderInput_1.on("change", function (e) {
    Quagga.stop();
    $$('#interactive').hide();
    let src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
    let file = files[0];
    if (url) {
        src = url.createObjectURL(file);
    } else {
        src = e.target.result;
    }

    $uploaderFiles_1.empty();
    $uploaderFiles_1.append($(tmpl.replace('#url#', src)));

    console.log($uploaderFiles_1);
    var num = $uploaderFiles_1.length;
    if (num >= 1) {
        $('#input_box_1').addClass("reselect-uploader__input-box");
    }
    else {
        $('#input_box_1').removeClass("reselect-uploader__input-box");
    }
    var url1=URL.createObjectURL(this.files[0]);
    console.log(url1);
    RecognizeBarCode(url1,cbBarcode);
});
$uploaderFiles_1.on("click", "li", function () {
    $galleryImg.attr("style", this.getAttribute("style"));
    $gallery.fadeIn(100);
});
$gallery.on("click", function () {
    $gallery.fadeOut(100);
});
$$('.popup-scan').on('closed', function () {
	Quagga.stop();
});
$$('.popup-scan').on('opened', function (e, popup) {
    Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
        },
        decoder : {
            readers : ["code_128_reader",
                "ean_reader"]
        }
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });
    Quagga.onProcessed(function(result) {
        if (result) {
            if (result.codeResult && result.codeResult.code) {
                // alert(result.codeResult.code);
                Quagga.stop();
            }
        }
    });
});

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
			url: "./API/account/login.php?",
			dataType: "json",
			data: formData,
			type: "post",
			async: true,
			success: function (data) {
				alert(data.data);
				if(data.error_code==0){
					myApp.closeModal('.popup-login');
					$("#login").attr("disabled",true);
					console.log("success");
					location.reload();
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
    $("#BorrowForm").validate({
        submitHandler: function(form){
            // ajaxContact(form);
            $.ajax({
                url: "API/book/borrowBook.php?",
                dataType: "json",
                data: {
                    "isbn": sessionStorage.getItem("isbn")
                },
                async: false,
                success: function (data) {
                    alert(data.data);
                    if(data.error_code==0){
                        $(location).attr('href', 'index.html');
                    }
                },
                error: function (xhr, textStatus) {
                    console.log('错误');
                    console.log(xhr);
                    console.log(textStatus);
                },
            });
            return false;
        }
    });
})
// $$(document).on('pageInit', '.page[data-page="tables"]', function (e)
myApp.onPageInit('tables', function (page) {
    // Do something here when page with data-page="about" attribute loaded and initialized
    books_each_page = 5;
    function getbook(page_id){
        $.ajax({
            url: "./API/public_api/getBooksListInLibrary.php?",
            dataType: "json",
            data:{
                page_id: page_id,
                books_each_page: books_each_page,
            },
            success(data){
                console.log(data.data);
                tablesapp.books= data.data.books;
            }
        })
    }
    tablesapp = new Vue({
        delimiters: ['${', '}'],
        el: '#tablesapp',
        data: {
            books:[],
            page_id:1,
            total_pages:0,
        },
        // computed:{},
        methods: {
            detail:function(book){
                // alert(book.title);
                alert("书名:"+book.title+" ,被借："+book.lended+" ,馆藏："+book.stock);
                // mainView.router.load({  //加载单独页面page
                //     url:'blog-single.html',//页面的url
                //     context:{//传入detail页面的数据，可以在页面中渲染
                //         name:
                //     }
                // });
            },
            First: function (event) {
                this.page_id = 1;
                getbook(this.page_id);
            },
            End:function (event) {
                this.page_id = this.total_pages;
                getbook(this.page_id);
            },
            Last:function (event) {
                this.page_id-=1;
                getbook(this.page_id);
            },
            Next:function (event) {
                this.page_id+=1;
                getbook(this.page_id);
            }
        }
    });
    $.ajax({
        url: "./API/public_api/getBooksListInLibrary.php?",
        dataType: "json",
        data:{
            page_id: 1,
            books_each_page: books_each_page,
        },
        success(data){
            console.log(data.data);
            tablesapp.books= data.data.books;
            tablesapp.page_id=1;
            tablesapp.total_pages=data.data.total_pages;
            // line = "";
            // for(var i=0;i<data.data.length;i++){
            //     book = data.data[i];
            //     console.log(book);
            //     bookname = book.title;
            //     publisher = book.publisher;
            //     author = book.author;
            //     line += "<li class=\"table_row\">\n" + "<div class=\"table_section_2\">"+bookname+"</div>\n"+
            //         "<div class=\"table_section\">"+publisher+"</div>\n"+
            //         "<div class=\"table_section_2\">"+author+"</div>\n"+"</li>";
            // }
            // $("#tablesapp").append(line);


        }

    })
    // tablesapp = new Vue({
    //     el: '#tablesapp',
    //     data: {
    //         title:"zhong "
    //         // book:{
    //         //     title:"1",author:"11",publisher:"123"
    //         // },
    //         // books:[
    //         //     {title:"1",author:"11",publisher:"123"},
    //         //     // {title:"1",author:"11",publisher:"123"}
    //         // ]
    //     }
    // });
})
myApp.onPageInit('contact', function (page) {
	var isbn;
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
						contact_app.book={
							name: data.data.title,
							publisher: data.data.publisher,
							author: data.data.author,
							class: ""
						}
					}else {
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
	contact_app = new Vue({
		el: '#id_page_contact',
		delimiters:["@{","}"],
		data: {
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
	        }
		}
	});

//捐书
	$("#ContactForm").validate({
		submitHandler: function(form){
			// ajaxContact(form);

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
					"isbn": isbn,
					"donator_word":contact_app.word,
					// "how_to_fetch": json.stringify(how_to_fetch),
					"how_to_fetch": how_to_fetch,

				},
				async: false,
				success: function (data) {
					alert(data.data);
					if(data.error_code==0){
						$(location).attr('href', 'index.html');
					}
				},
				error: function (xhr, textStatus) {
					console.log('错误');
					console.log(xhr);
					console.log(textStatus);
				},
			});
			return false;
		}
	});
	let tmpl = '<li class="uploader__file" style="background-image:url(#url#)"></li>',
		$gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
		$uploaderInput_1 = $("#uploaderInput_1"),
		$uploaderFiles_1 = $("#uploaderFiles_1")
	$uploaderInput_1.on("change", function (e) {
		let src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
		let file = files[0];
		if (url) {
			src = url.createObjectURL(file);
		} else {
			src = e.target.result;
		}

		$uploaderFiles_1.empty();
		$uploaderFiles_1.append($(tmpl.replace('#url#', src)));

		console.log($uploaderFiles_1);
		var num = $uploaderFiles_1.length;
		if (num >= 1) {
			$('#input_box_1').addClass("reselect-uploader__input-box");
		}
		else {
			$('#input_box_1').removeClass("reselect-uploader__input-box");
		}
		var url1=URL.createObjectURL(this.files[0]);
		console.log(url1);
		RecognizeBarCode(url1,cbBarcode);


	});
	$uploaderFiles_1.on("click", "li", function () {
		$galleryImg.attr("style", this.getAttribute("style"));
		$gallery.fadeIn(100);
	});
	$gallery.on("click", function () {
		$gallery.fadeOut(100);
	});


//radio事件
	/*
    var $getBooks = $("#getBooks"),
		$deliverBooks =$("#deliverBooks"),
	$AddressHide = $("#AdressHide");
    $getBooks.on("click",function (){
          //  $("#AddressHide").css("display", 'block');
        $AddressHide.css("display", "block");
    });
    $deliverBooks.on("click",function (){
        //  $("#AddressHide").css("display", 'block');
        $AddressHide.css("display", "none");
    });*/


})

// 	contact_app = new Vue({
	// 		el: '#id_page_contact',
	// 		delimiters:["@{","}"],
	// 		data: {
	// 			fetchType: 1,            // 1:送至分馆；2: 上门取书
	// 			fetchAddr:"学生公寓",            // 上门取书此字段才有意义
	// 			phone : "13988889999",
	// 			book: {
    //                 name: "计算机导论",
    //                 publisher: "机械工业出版社",
    //                 author: "柳煜颖",
    //                 class: ""
    //             }
	// 		},
	// 		methods: {
	// 			setFetchType: (type) => {
    //                 contact_app.fetchType=type;
    //             }
	// 		}
	// 	});
	// 	$("#ContactForm").validate({
	// 		submitHandler: function(form) {
	// 		ajaxContact(form);
	// 		return false;
	// 		}
	// 	});
	//
    // let tmpl = '<li class="uploader__file" style="background-image:url(#url#)"></li>',
    //     $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
    //     $uploaderInput_1 = $("#uploaderInput_1"),
    //     $uploaderFiles_1 = $("#uploaderFiles_1")
    // $uploaderInput_1.on("change", function (e) {
    //     let src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
    //     let file = files[0];
    //     if (url) {
    //         src = url.createObjectURL(file);
    //     } else {
    //         src = e.target.result;
    //     }
	//
    //     $uploaderFiles_1.empty();
    //     $uploaderFiles_1.append($(tmpl.replace('#url#', src)));
	//
    //     console.log($uploaderFiles_1);
    //     var num = $uploaderFiles_1.length;
    //     if (num >= 1) {
    //         $('#input_box_1').addClass("reselect-uploader__input-box");
    //     }
    //     else {
    //         $('#input_box_1').removeClass("reselect-uploader__input-box");
    //     }
	//
	//
    // });
    // $uploaderFiles_1.on("click", "li", function () {
    //     $galleryImg.attr("style", this.getAttribute("style"));
    //     $gallery.fadeIn(100);
    // });
    // $gallery.on("click", function () {
    //     $gallery.fadeOut(100);
    // });
//radio事件
	/*
    var $getBooks = $("#getBooks"),
		$deliverBooks =$("#deliverBooks"),
	$AddressHide = $("#AdressHide");
    $getBooks.on("click",function (){
          //  $("#AddressHide").css("display", 'block');
        $AddressHide.css("display", "block");
    });
    $deliverBooks.on("click",function (){
        //  $("#AddressHide").css("display", 'block');
        $AddressHide.css("display", "none");
    });*/
// })

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

