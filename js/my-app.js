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
	template7Data:{
      "url:blog-single.html" :{
	   name:'没有重量的生存',
       contantIntro:'本书是作者近几年写的散文随笔作品的合集。作者抓住当代社会生活中所习以为常的事物，如网络，电视，旅游等，以冷静客观的笔触揭示我们日常生活中的荒诞性，在传统与现代的交汇中思考，与审视当代文化，具有浓郁的当代色彩和古典主义的诗意美。',
       publishingHouse:"北京:昆仑出版社,2003",
		author:'南帆',
       site:'法学分馆',
		state:'可借',
		contactInfo:'13899999999'
	  }
    }
});

// Export selectors engine
var $$ = Dom7;

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
myApp.onPageInit('music', function (page) {
		  audiojs.events.ready(function() {
			var as = audiojs.createAll();
		  });
})
myApp.onPageInit('videos', function (page) {
		  $(".videocontainer").fitVids();
})
myApp.onPageInit('contact', function (page) {
		contact_app = new Vue({
			el: '#id_page_contact',
			delimiters:["@{","}"],
			data: {
				fetchType: 1,            // 1:送至分馆；2: 上门取书
				fetchAddr:"学生公寓",            // 上门取书此字段才有意义
				phone : "13988889999",
				book: {
                    name: "计算机导论",
                    publisher: "机械工业出版社",
                    author: "柳煜颖",
                    class: ""
                }
			},
			methods: {
				setFetchType: (type) => {
                    contact_app.fetchType=type;
                }
			}
		});
		$("#ContactForm").validate({
			submitHandler: function(form) {
			ajaxContact(form);
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

