(function($){

	var c = null;
	var ctx = null;

	var StripesFactory = function() {
		//stripe size, spacing, colors[], bgcolor, orientation
		this.attr = {
			"size"		: 0,
			"spacing"	: 0,
			"colors"	: [],
			"bgColor"	: 0,
			"orient"	: 0.0
		};
		
		this.init = function() {
			this.attr["size"] = 20;
			this.attr["spacing"] = 15;
			this.attr["colors"].push("#1F497D");
			this.attr["bgColor"] = "#C6D9F1";
			this.attr["orient"] = 0.0;
		};
		
		this.update = function(key,value) {
			if (typeof this.attr[key] !== undefined)
			{
				this.attr[key] = value;
			}
		};
		
		this.addColor = function(color) {
			this.attr["colors"].push(color);
		};
		
		this.removeColor = function(color) {
			var colors = this.attr["colors"];
			
			if (color === undefined)
			{
				colors.pop();
			}
			else
			{
				for (var i = 0; i < colors.length; i++)
				{
					if (colors[i] === color)
					{
						colors.splice(i,1);
						break;
					}
				}
			}
		};
		
		this.render = function() {
			var width = (this.attr["colors"].length * this.attr["size"] + this.attr["spacing"]) * 2;
			var height = width;
			
			// resize canvas
			c.width = width/2;
			c.height = height/2;
			
			ctx.translate(width/4,height/4);
			ctx.rotate(this.attr["orient"]);
			ctx.translate(0-(width/2),0-(height/2));
			
			var that = this;
			var x = 0;
			
			for (var i = 0; i < 2; i++)
			{	
				// draw stripes
				$.each(this.attr["colors"],function(){
					ctx.fillStyle = this.toString();
					ctx.fillRect(x,0,that.attr["size"],height);
					x += that.attr["size"];
				});
				
				// draw space
				ctx.fillStyle = this.attr["bgColor"];
				ctx.fillRect(x,0,this.attr["spacing"],height);
				x += this.attr["spacing"];
			}
			
			return c.toDataURL();
		};
	};
	
	$(document).ready(function(){
		//c = $("#c");
		c = document.getElementById("c");
		ctx = c.getContext("2d");
	
		var stripes = new StripesFactory();
		stripes.init();
		stripes.addColor("#4bacc6");
		$("body").css("background-image","url('" + stripes.render() + "')");
	});

})(jQuery);