(function($){

	var c = null;
	var ctx = null;

	var StripesFactory = function() {
		
		this.orient = 0.0;
		this.stripes = [ /*{ size : 0, color : "" },{...},...*/ ];
		
		this.init = function() {
			this.orient = 0.0;
			this.stripes.push({ size : 20, color : "#1F497D" });
			this.stripes.push({ size : 15, color : "#C6D9F1" });
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
		};
		
		this.updateStripe = function(index,value) {
			if (index !== undefined && index >= 0 && index < this.stripes.length)
			{
				if (value1 !== undefined)
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
				return this.stripes.splice(i,1);
			}
			return null;
		};
		
		this.render = function() {
			var url = null;
			if (this.orient === 0)
			{
				url = this.renderHorz();
			}
			else if (this.orient > 0 && this.orient < 90)
			{
				url = this.renderAngled();
			}
			else if (this.orient === 90)
			{
				url = this.renderVert();
			}
			else
			{
				url = this.renderAngled();
			}
			return url;
		}
		
		this.renderVert = function() {
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
			
			return c.toDataURL();
		};
		
		this.renderHorz = function() {
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
			
			return c.toDataURL();
		};
		
		this.renderAngled = function() {
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
			
			return c.toDataURL();
		};
	};
	
	$(document).ready(function(){
		c = $("canvas")[0];
		ctx = c.getContext("2d");
	
		var stripes = new StripesFactory();
		stripes.init();
		stripes.setOrient(45);
		var stripe = stripes.removeStripe();
		stripes.addStripe(20,"#4bacc6");
		stripes.addStripe(stripe.size,stripe.color);
		$("body").css("background-image","url('" + stripes.render() + "')");
	});

})(jQuery);