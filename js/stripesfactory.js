var StripesFactory = function(c,ctx) {

	this.orient = 0.0;
	this.stripes = [ /*{ size : 0, color : "" },{...},...*/ ];

	this.init = function() {
		this.orient = 0.0;
		this.stripes.push({ size : 20, color : "#1F497D" });
		this.stripes.push({ size : 15, color : "#C6D9F1" });
	};
	
	this.getOrient = function() {
		return this.orient;
	};
	
	this.getStripes = function(index) {
		if (index === undefined)
		{
			return this.stripes;
		}
		else if (index >= 0 && index < this.stripes.length)
		{
			return this.stripes[index];
		}
		return null;
	};

	this.setOrient = function(value) {
		if (value !== undefined && typeof value === "number")
		{
			this.orient = value;
		}
	};

	this.addStripe = function(value1,value2) {
		if (value1 !== undefined && typeof value1 === "number" &&
			value2 !== undefined && typeof value2 === "string")
		{
			this.stripes.push({ size : value1, color : value2 });
		}
		else
		{
			this.stripes.push({ size : 20, color : "#1F497D" });
		}
	};

	this.updateStripe = function(index,value) {
		if (index !== undefined && index >= 0 && index < this.stripes.length)
		{
			if (value !== undefined)
			{
				if (typeof value === "number")
				{
					this.stripes[index].size = value;
				}
				else if (typeof value === "string")
				{
					this.stripes[index].color = value;
				}
			}
		}
	};

	this.removeStripe = function(index) {
		if (index === undefined)
		{
			return this.stripes.pop();
		}
		else if (index >= 0 && index < this.stripes.length)
		{
			return this.stripes.splice(index,1);
		}
		return null;
	};

	this.render = function() {
		if (this.orient === 0)
		{
			this.render0deg();
		}
		else if (this.orient > 0 && this.orient < 90)
		{
			this.render1quad();
		}
		else if (this.orient === 90)
		{
			this.render90deg();
		}
		else if (this.orient > 90 && this.orient < 180)
		{
			this.render2quad();
		}
		return c.toDataURL();
	};

	this.render90deg = function() {
		var canvasWidth = 0;
		var canvasHeight = 10;
		$.each(this.stripes,function(){
			canvasWidth += this.size;
		});

		// Resize canvas
		c.width = canvasWidth;
		c.height = canvasHeight;

		var x = 0;

		$.each(this.stripes,function(){
			ctx.fillStyle = this.color;
			ctx.fillRect(x,0,this.size,canvasHeight);
			x += this.size;
		});
	};

	this.render0deg = function() {
		var canvasWidth = 10;
		var canvasHeight = 0;
		$.each(this.stripes,function(){
			canvasHeight += this.size;
		});

		// Resize canvas
		c.width = canvasWidth;
		c.height = canvasHeight;

		var y = 0;

		$.each(this.stripes,function(){
			ctx.fillStyle = this.color;
			ctx.fillRect(0,y,canvasWidth,this.size);
			y += this.size;
		});
	};

	this.render1quad = function() {
		var rad = this.orient * Math.PI / 180;

		// compute canvas width by getting the width of the rotated stripes parallel to the x axis
		// same thing for canvas height, parallel to y axis
		var canvasWidth = 0;
		var canvasHeight = 0;
		$.each(this.stripes,function(){
			var stripeWidth = Math.floor(this.size / Math.sin(rad));
			canvasWidth += stripeWidth;
			canvasHeight += Math.floor(stripeWidth * Math.tan(rad));
		});

		// resize and clear canvas
		c.width = canvasWidth;
		c.height = canvasHeight;

		var multiplier = 2;
		canvasWidth *= multiplier;
		canvasHeight *= multiplier;

		// draw stripes
		for (var i = 0; i < multiplier; i++)
		{
			for (var j = this.stripes.length-1; j >= 0; j--)
			{	
				ctx.fillStyle = this.stripes[j].color;
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(canvasWidth,0);
				ctx.lineTo(0,canvasHeight);
				ctx.lineTo(0,0);
				ctx.closePath();
				ctx.fill();

				var stripeWidth = Math.floor(this.stripes[j].size / Math.sin(rad));
				var stripeHeight = Math.floor(stripeWidth * Math.tan(rad));

				canvasWidth -= stripeWidth;
				canvasHeight -= stripeHeight;
			}
		}
	};

	this.render2quad = function() {
		var rad = (180 - this.orient) * Math.PI / 180;

		// compute canvas width by getting the width of the rotated stripes parallel to the x axis
		// same thing for canvas height, parallel to y axis
		var canvasWidth = 0;
		var canvasHeight = 0;
		$.each(this.stripes,function(){
			var stripeWidth = Math.floor(this.size / Math.sin(rad));
			canvasWidth += stripeWidth;
			canvasHeight += Math.floor(stripeWidth * Math.tan(rad));
		});

		// resize and clear canvas
		c.width = canvasWidth;
		c.height = canvasHeight;

		var x = canvasWidth;

		var multiplier = 2;
		canvasWidth *= multiplier;
		canvasHeight *= multiplier;

		// draw stripes
		for (var i = 0; i < multiplier; i++)
		{
			for (var j = 0; j < this.stripes.length; j++)
			{	
				ctx.fillStyle = this.stripes[j].color;
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x-canvasWidth,0);
				ctx.lineTo(x,canvasHeight);
				ctx.lineTo(x,0);
				ctx.closePath();
				ctx.fill();

				var stripeWidth = Math.floor(this.stripes[j].size / Math.sin(rad));
				var stripeHeight = Math.floor(stripeWidth * Math.tan(rad));

				canvasWidth -= stripeWidth;
				canvasHeight -= stripeHeight;
			}
		}
	};
};