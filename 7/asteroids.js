const MARGIN = 40, RADIUS = 10, NUMS_AST = 10, SPEED1 = 4, SPEED2 = 2, ASPEED1 = 0.2, ASPEED2 = 0.1;

$(function() {
	var canvas = $("#myCanvas"),
	context = canvas.get(0).getContext("2d"),
	canvasWidth = canvas.width(),
	canvasHeight = canvas.height();
	
	$(window).resize(resizeCanvas);
	
	function resizeCanvas() {
		canvas.attr("width", $(window).get(0).innerWidth);
		canvas.attr("height", $(window).get(0).innerHeight);
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();
	}
	
	resizeCanvas();
	
	var play = true;
	$("#startAnimation").hide().click(function(e) {
    $(this).hide();
		$("#stopAnimation").show();
		play = true;
		animate();
  });
	
	$("#stopAnimation").click(function(e) {
    $(this).hide();
		$("#startAnimation").show();
		play = false;
  });
	
	var Asteroid = function(x, y, radius, mass, vX, vY, aX, aY) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		
		this.vX = vX;
		this.vY = vY;
		this.aX = aX;
		this.aY = aY;
	}
	
	var asteroids = new Array();
	for(var i = 0; i < NUMS_AST; i++) {
		var x = MARGIN + (Math.random() * (canvasWidth - MARGIN * 2));
		var y = MARGIN + (Math.random() * (canvasHeight - MARGIN * 2));
		var radius = RADIUS / 2 + Math.random() * RADIUS;
		var mass = radius/2;
		var vX = Math.random() * SPEED1 - SPEED2;
		var vY = Math.random() * SPEED1 - SPEED2;
		//var aX = Math.random() * ASPEED1 - ASPEED2;
		//var aY = Math.random() * ASPEED1 - ASPEED2;
		var aX = 0;
		var aY = 0;
		
		asteroids.push(new Asteroid(x, y, radius, mass, vX, vY, aX, aY));
	}
	
	function animate() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = "rgb(255, 255, 255)";
		
		for(var i in asteroids) {
			var tmpAsteroid = asteroids[i];
			
			for(var j=parseInt(i,10)+1; j < asteroids.length; j++) {
				var tmpAsteroidB = asteroids[j];
				
				var dX = tmpAsteroidB.x - tmpAsteroid.x,
				dY = tmpAsteroidB.y - tmpAsteroid.y,
				distance = Math.sqrt((dX*dX)+(dY*dY));
				
				if (distance < tmpAsteroid.radius + tmpAsteroidB.radius) {
					var angle = Math.atan2(dY, dX),
					sine = Math.sin(angle),
					cosine = Math.cos(angle);
					
					// 旋转坐标系
					var x = 0;
					var y = 0;
					var xB = dX * cosine + dY * sine;
					var yB = dY * cosine - dX * sine;
					
					var vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					var vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;
					var vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					var vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;
					
					// 碰撞速度变化
					/*vX *= -1;
					vXb *= -1;*/
					var vTotal = vX - vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) / (tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;
					
					// 分离两个球
					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);
					
					// 复原旋转坐标系
					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);
					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);
					
					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;
					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;
				}
			}
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;
			
			// 增加加速度
			if(Math.abs(tmpAsteroid.vX) < 10) {
				tmpAsteroid.vX += tmpAsteroid.aX;
			}
			if(Math.abs(tmpAsteroid.vY) < 10) {
				tmpAsteroid.vY += tmpAsteroid.aY;
			}
			
			/*// 摩擦力
			if(Math.abs(tmpAsteroid.vX) > 0.1) {
				tmpAsteroid.vX *= 0.9;
			} else {
				tmpAsteroid.vX = 0;
			}
			if(Math.abs(tmpAsteroid.vY) > 0.1) {
				tmpAsteroid.vY *= 0.9;
			} else {
				tmpAsteroid.vY = 0;
			}*/			
			
			// 撞墙检测
			if (tmpAsteroid.x - tmpAsteroid.radius < 0) {
				tmpAsteroid.x = tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			} else if (tmpAsteroid.x + tmpAsteroid.radius > canvasWidth) {
				tmpAsteroid.x = canvasWidth - tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			}
			if (tmpAsteroid.y - tmpAsteroid.radius < 0) {
				tmpAsteroid.y = tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			} else if (tmpAsteroid.y + tmpAsteroid.radius > canvasHeight) {
				tmpAsteroid.y = canvasHeight - tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			}
			
			// 画图
			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI * 2, false);
			context.closePath();
			context.fill();
		}
		if(play) setTimeout(animate, 33);
	}
	
	animate();
});