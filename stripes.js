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
		
		this.renderAngled = function() {
			var that = this;
			
			// compute canvas width by getting the width of the rotated stripes parallel to the x axis
			// same thing for canvas height, parallel to y axis
			var canvasWidth = 0;
			var canvasHeight = 0;
			$.each(this.stripes,function(){
				var stripeWidth = Math.floor(this.size / Math.sin(that.orient));
				canvasWidth += stripeWidth;
				canvasHeight += Math.floor(stripeWidth * Math.tan(that.orient));
			});
			
			// resize and clear canvas
			c.width = canvasWidth;
			c.height = canvasHeight;
			
			var multiplier = 2;
			canvasWidth *= multiplier;
			canvasHeight *= multiplier;
			
			// draw stripes, it's actually just a series of triangles
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
					
					var stripeWidth = Math.floor(this.stripes[j].size / Math.sin(this.orient));
					var stripeHeight = Math.floor(stripeWidth * Math.tan(this.orient));
					
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
		stripes.setOrient(Math.PI/3);
		var stripe = stripes.removeStripe();
		stripes.addStripe(20,"#4bacc6");
		stripes.addStripe(stripe.size,stripe.color);
		$("body").css("background-image","url('" + stripes.renderAngled() + "')");
	});

})(jQuery);