//获取属性值函数
//说明 1 不可以获取复合样式的值。例如不要获取background的值 每个浏览器都不同 有兼容性问题。可以获取backgroundColor的值；2 获取的值不可以拿来做判断；3 获取的宽或高均不包含边框和padding 只是width or height的值；4 属性值书写的时候不要有空格;5 不要获取未设置后的样式（不兼容）
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,"FOR FF4.0")[attr];
}

//运动函数封装 leo domove
function doMove ( obj, attr, dir, target, endFn ) {
	dir = parseInt(getStyle( obj, attr )) < target ? dir : -dir;
	clearInterval( obj.timer );
	obj.timer = setInterval(function () {
		var speed = parseInt(getStyle( obj, attr )) + dir;			// 步长
		
		if ( speed > target && dir > 0 ||  speed < target && dir < 0  ) {//刚刚跑过目标点 就马上拉回来
			//这样判断实际上是每次可能超过目标点后再拉回来 。用绝对值方法会好一些。比如步长是3 当从90-93 -96-99走到99的时候 仍然继续 但是此时步长变为目标点100到99差的绝对值 这样就不存在偏离目标点再退回的情况（也许会是bug）
			speed = target;
		}
		
		obj.style[attr] = speed + 'px';
		
		if ( speed == target ) {
			clearInterval( obj.timer );
			/*
			if ( endFn ) {
				endFn();
			}
			*/
			endFn && endFn();
		}
		
	}, 30);
}
//运动函数封装 leo domove 结束

//抖动函数封装
function shake ( obj, attr, endFn ) {
	var pos = parseInt( getStyle(obj, attr) );//有bug 每次重开定时器回不到原点 解决办法：
	//在函数体外把原始的attr值储存起来 每次点击 都把原始值付给该对象。比如是left 
	//和top方向抖动 首先把初始的left和top值储存起来 然后每次点击事件发生 都把原始的
	//left和top值付给被点击对象
	var arr = [];			// 20, -20, 18, -18 ..... 0
	var num = 0;
	var timer = null;
		
	for ( var i=20; i>0; i-=2 ) {
		arr.push( i, -i );
	}
	arr.push(0);
		
	clearInterval( obj.shake );
	obj.shake = setInterval(function (){
		obj.style[attr] = pos + arr[num] + 'px';
		num++;
		if ( num === arr.length ) {
			clearInterval( obj.shake );
			endFn && endFn();
		}
	}, 50);
}
//抖动函数封装结束

//透明度函数
function changeOpacity(obj,target){ 
	var opa; 
	var speed; 
	if(obj.currentStyle){ 
		  //判断浏览器类型，此类型为IE浏览器，即使IE不支持opacity属性，但是仍然可以获取值 
		 opa = obj.currentStyle['opacity']*100; 
	} 
	else{//其他浏览器 
		opa = getComputedStyle(obj,false)['opacity']*100; 
	} 
	//透明度每次变化的值（步长），根据目标值和当前值的差来决定步长的正负 
	target-opa>=0?speed=1:speed=-1; 
	clearInterval(obj.timer); 
	obj.timer = setInterval(function (){ 
	//目标值和当前值差值的绝对值大于等于步长的绝对值，设置透明度为当前值加步长 
	if(Math.abs(target-opa)>=Math.abs(speed)){ 
		obj.style.opacity=(opa+speed)/100; 
		obj.style.filter='alpha(opacity:'+(opa+speed)+')'; 
	} 
	//目标值和当前值差值的绝对值小于步长的绝对值，剩余的距离一步到位， 
	//设置透明度直接为目标值，同时清除定时器 
	else{ 
	   obj.style.opacity=target/100; 
	   obj.style.filter='alpha(opacity:'+target+')'; 
	   clearInterval(obj.timer); 
	} 
	//直接对透明度参数进行加步长的运算，避免每次都要获取当前透明度 
	opa=opa+speed; 
	},30); 
} 