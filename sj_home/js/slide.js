class Slide{
	constructor(box, data, width, height, index, ms, dir, btnSize=30){
		this.box = box;
		this.data = data;
		this.count = data.length; 
		this.width = width;
		this.height = height;
		this.index = index;
		this.ms = ms;
		this.dir = dir;  // 方向
		this.btnSize = btnSize;
	}
}


Slide.prototype.init = function(){
	this.createHTML();
	this.auto();
}
Slide.prototype.createHTML = function(){
	var that = this;
	this.box.css({
		"width":this.width,
		"height":this.height
	});
	// 放图片
	var ul = $("<ul></ul>");
	this.ul = ul;
	ul.css({
		"width":this.width*(this.count+1),
		"height":this.height
	});
	this.box.append(ul);
	for( var i=0, len=this.count; i<len; i++){
		var obj = this.data[i];
		
		var li = $("<li></li>");
		li.css({
			"width":this.width,
			"height":this.height
		});
		ul.append(li);
		
		var a = $("<a></a>");
		li.append(a);
		a.attr({
			"title":obj.title,
			"href":obj.href,
			"target":"_blank"
		});
		
		var img = $("<img>");
		a.append(img);
		img.css({
			"width":this.width,
			"height":this.height
		}).attr({
			"src":obj.img
		});
	}
	// 无缝轮播---补充的图片
	li = ul.children(":first").clone(true);
	ul.append(li);
	// 放按钮
	var ol = $("<ol></ol>");
	this.ol = ol;
	this.box.append(ol);
	for( var i=0, len=this.count; i<len; i++){
		var li = $("<li></li>");
		ol.append(li);
		li.css({"width":that.btnSize+10,"height":that.btnSize+10});
		var span = $("<span></span>");
		li.append(span);
		span.click(function(){
			that.index = $(this).parent().index();
			that.tab();
		}).css({"width":that.btnSize,"height":that.btnSize});
	}
	// 左右按钮
	var p1 = $("<p>&lt;</p>");
	this.box.append(p1);	
	p1.css({"left":10, "top":(this.height-40)/2}).click(function(){
		that.dir = "left";
		that.index++;	
		that.tab();
	});
	var p2 = $("<p>&gt;</p>");
	this.box.append(p2);	
	p2.css({"right":10, "top":(this.height-40)/2}).click(function(){
		that.dir = "right";
		that.index--;
		that.tab();
	});
	// 初始化
	that.tab();
}

Slide.prototype.tab = function(){
	var that = this;
	// 下标3，为第4张图片
	// 下标4，为第1张图片
	if( this.index==this.count ){ // 如果超过最大值
		this.index=0;
		this.ul.animate({"left":this.count*-this.width}, function(){
			that.ul.css({"left":that.index*-that.width});
		});
	}else if( this.index==-1 ){  // 如果超过最小值
		this.index=this.count-1;
		that.ul.css({"left":that.count*-that.width});
		this.ul.animate({"left":this.index*-this.width});
	}else{	
		this.ul.animate({"left":this.index*-this.width});
	}
	
	
	this.ol.find("li>span").css({"background":"rgba(0,0,0,.5)","border":"none"});
	this.ol.children("li").eq(this.index).children("span")
		.css({"background":"white","border":"1px solid gray"})
}

Slide.prototype.next = function(){
	if(this.dir=="left"){
		this.index++;
	}else if(this.dir=="right"){
		this.index--;
	}	
	this.tab();
}

Slide.prototype.auto = function(){
	var that = this;
	this.timer = setInterval(function(){
		that.next();
	}, this.ms);
	
	this.box.mouseenter(function(){
		clearInterval(that.timer);
		that.box.children("p").fadeIn();
	}).mouseleave(function(){
		that.box.children("p").fadeOut();
		that.timer = setInterval(function(){
			that.next();			
		}, that.ms); 
	});	
}

