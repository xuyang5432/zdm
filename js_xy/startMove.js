/*
 * elem: 操作哪一个元素
 * json：表示多个属性
 		* attr: 操作的那个元素的css中的什么属性
 		* value: 操作的那个元素的css中的那个属性的目标值
 * cb：回调函数，前一个运动执行后，这一段代码才被执行 
 */
var startMove = (elem, json, cb)=>{
	// 每当执行运动函数的时候，都先把上一次的运动结束掉
	clearInterval(elem.timer);
	// 开启定时器，让elem的attr属性，不断的变化
	elem.timer = setInterval( ()=>{
		// 循环，把json中的每一个属性，都做处理（让json中的每一个属性，都运动起来）
		var flag = true;		//是不是所有的属性，都运动到了目标值
		for( var attr in json ){
			// attr属性的目标值
			var value = json[attr];					
			// 求当前属性值
			var v = getComputedStyle(elem)[attr];
			if( attr=="opacity" ){
				v = Math.round(v*100);
			}else{
				v = parseInt(v);
			}
			//console.log(v);
			// 求目标值与当前值的间距
			var dist = value-v;
			// 求步长值（注意：缓冲运动中，步长值是逐渐减小的）
			var step = dist/6;
			//console.log(step);
			// 如果属性逐渐变大的运动，那么step最后几次的值类似 0.1，我们希望把0.1变为1
			// 如果属性逐渐变小的运动，那么step最后几次的值类似 -0.1，我们希望把-0.1变为-1
			if( step>0 ){	
				step = Math.ceil(step);
			}else{
				step = Math.floor(step);
			}
			// 更新属性值
			//console.log(v, step);
			if( attr=="opacity" ){
				elem.style[attr] = (v+step)/100;
			}else{
				elem.style[attr] = (v+step)+'px';
			}
			// 如果到达目标值，运动停止
			//if( v==value ){
			//	clearInterval(elem.timer);
			//}
			if( v!=value ){// 只要有1个属性，没有到达目标值，就让flag等于false
				flag = false;	
			}
		}	
		// 判断是否所有的属性，都已经到达了目标值
		if( flag ){
			clearInterval(elem.timer);
			if( cb ){	// 如果设置了回调函数，则执行它
				cb();
			}
		}
	}, 30 );
}
