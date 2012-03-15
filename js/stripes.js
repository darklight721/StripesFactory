(function($){

	var c = null;
	var ctx = null;
	var stripes = null;
	var eventFromText = false; // flag when text input is changed./ used also to force update model
	
	$(document).ready(function(){
		c = $("canvas")[0];
		ctx = c.getContext("2d");
	
		stripes = new StripesFactory(c,ctx);
		stripes.init();
		stripes.setOrient(90+45);
		var stripe = stripes.removeStripe();
		stripes.addStripe(20,"#4bacc6");
		stripes.addStripe(stripe.size,stripe.color);
		
		initControls();
		bindControlsToModel();
		syncColorTiles();
		
		$(".tile:first").click();
		
		renderBackground();
	});
	
	function renderBackground()
	{
		$("body").css("background-image","url('" + stripes.render() + "')");
	}
	
	function initControls()
	{
		$(".slider").slider();
		
		// initialize rgb sliders
		$("#sliderR,#sliderG,#sliderB").slider("option","max",255);
		
		// initialize size slider
		$("#sliderSize").slider("option","min",1);
		$("#sliderSize").slider("option","max",50);
		
		// initialize orient slider
		$("#sliderOrient").slider("option","max",170);
		
		$("#sliderR,#textR").data("id","R");
		$("#sliderG,#textG").data("id","G");
		$("#sliderB,#textB").data("id","B");
		$("#sliderSize,#textSize").data("id","Size");
		$("#sliderOrient,#textOrient").data("id","Orient");
	}
	
	function bindControlsToModel()
	{	
		// Bind sliders
		$(".slider").bind("slidechange",function(event,ui){
			
			// only update the model when not set programmatically or when text input is changed
			if (event.originalEvent !== undefined || eventFromText)
			{
				eventFromText = false;
				
				var r = $("#sliderR").slider("option","value");
				var g = $("#sliderG").slider("option","value");
				var b = $("#sliderB").slider("option","value");
				var color = rgbToHex(r,g,b);
				var size = $("#sliderSize").slider("option","value");
				var orient = $("#sliderOrient").slider("option","value");
				
				// get index
				var index = 0;
				$(".tile").each(function(){
					if ($(this).hasClass("selected"))
					{
						index = $(this).data("index");
						return false;
					}
				});
				
				// update model
				stripes.updateStripe(index,color);
				stripes.updateStripe(index,size);
				stripes.setOrient(orient);
				
				syncColorTiles();
				// update background
				renderBackground();
			}
			
			$("#text"+$(this).data("id")).val(ui.value);
		});
		
		// Bind text inputs
		$(".text input").bind("change",function(){
			eventFromText = true;
			$("#slider"+$(this).data("id")).slider("option","value",parseInt($(this).val()));
		});
		
		// Bind tiles
		$(".tile").click(selectTile);
	}
	
	function syncColorTiles()
	{
		var colorStripes = stripes.getStripes();
		
		var tileCount = $(".tile").length;
		if (colorStripes.length <= tileCount)
		{
			var i;
			for (i = 0; i < colorStripes.length; i++)
			{
				var color = colorStripes[i].color;
				
				var elem = $(".tile")[i];
				$(elem).removeClass("plus disabled");
				$(elem).css("background-color",color);
				$(elem).data("index",i);
			}
			
			if (i < tileCount)
			{
				var elem = $(".tile")[i];
				$(elem).removeClass("disabled");
				$(elem).addClass("plus");
				$(elem).data("index","+");
				i++;
			}
			
			while (i < tileCount)
			{
				var elem = $(".tile")[i];
				$(elem).removeClass("plus");
				$(elem).addClass("disabled");
				$(elem).data("index",".");
				i++;
			}
		}
	}
	
	function selectTile()
	{
		var index = $(this).data("index");
		
		if (typeof index === "number")
		{
			var stripe = stripes.getStripes(index);
			if (stripe !== null)
			{
				var color = stripe.color;
				var r = parseInt(color.substr(1,2),16);
				var g = parseInt(color.substr(3,2),16);
				var b = parseInt(color.substr(5),16);
				
				$("#sliderR").slider("option","value",r);
				$("#sliderG").slider("option","value",g);
				$("#sliderB").slider("option","value",b);
				
				$("#sliderSize").slider("option","value",stripe.size);
				$("#sliderOrient").slider("option","value",stripes.getOrient());
				
				$(".tile").removeClass("selected");
				$(this).addClass("selected");
			}
		}
		else if (index === "+")
		{
			stripes.addStripe();
			syncColorTiles();
			$(this).click();
			renderBackground();
		}
		else
		{
			// do nothing
		}
	}
	
	function rgbToHex(r,g,b)
	{
		var hexR = hexTo2Digits(r);
		var hexG = hexTo2Digits(g);
		var hexB = hexTo2Digits(b);
		
		var hex = "#" + hexR + hexG + hexB;
		return hex;
	}
	
	function hexTo2Digits(str)
	{
		if (typeof str === "string")
		{
			str = parseInt(str);
		}
		str = str.toString(16);
		if (str.length === 1)
		{
			str = "0" + str;
		}
		return str;
	}

})(jQuery);