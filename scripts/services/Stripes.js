'use strict';

StripesFactoryv2App.factory('Stripes', function() {
  // Service logic
  var cnv = $('canvas#cnv')[0] || $('<canvas id="cnv"></canvas>').appendTo('body')[0],
  	  ctx = cnv.getContext('2d'),
  	  orient = 0.0,
  	  stripes = [],
      previewEl = null;

  function degToRad(deg) {
  	return deg * Math.PI / 180;
  }

  function computeStripeSize(size, rad) {
    var width = Math.floor(size / Math.sin(rad));
    return {
      width: width,
      height: Math.floor(width * Math.tan(rad))
    };
  }

  function computeCanvasSize() {
  	var size = {
  		width: 0,
  		height: 0
  	}

  	if (orient === 0) {
    $.each(stripes, function(){
        size.height += this.size;
      });

      size.width = 10;
    }
    else if (orient === 90) {
      $.each(stripes, function(){
        size.width += this.size;
      });

      size.height = 10;
    }
  	else {
  		var rad = degToRad(
        orient > 90 ? 180 - orient : orient
      );

  		$.each(stripes, function(){
  			var stripeSize = computeStripeSize(this.size, rad);
  			size.width += stripeSize.width;
  			size.height += stripeSize.height;
  		});
  	}

  	return size;
  }

  function setCanvasSize(size) {
    cnv.width = size.width;
    cnv.height = size.height;
  }

  function drawStripes() {
    if (orient === 0) {
      drawStripesAsVertRect();
    }
    else if (orient > 0 && orient < 90) {
      drawStripesAsLTriangle();
    }
    else if (orient === 90) {
      drawStripesAsHorzRect();
    }
    else if (orient > 90 && orient < 180) {
      drawStripesAsRTriangle();
    }
  }

  function drawStripesAsHorzRect() {
    var x = 0;
    $.each(stripes, function(){
      ctx.fillStyle = this.color;
      ctx.fillRect(x, 0, this.size, cnv.height);
      x += this.size;
    });
  }

  function drawStripesAsVertRect() {
    var y = 0;
    $.each(stripes, function(){
      ctx.fillStyle = this.color;
      ctx.fillRect(0, y, cnv.width, this.size);
      y += this.size;
    });
  }

  function drawStripesAsLTriangle() {
    var width = cnv.width * 2,
        height = cnv.height * 2,
        rad = degToRad(orient);

    while (width && height) {
      for (var i = stripes.length-1; i >= 0; i--) {
        drawPaths([
          {x: 0, y: 0},
          {x: width, y: 0},
          {x: 0, y: height}
        ]);

        ctx.fillStyle = stripes[i].color;
        ctx.fill();

        var stripeSize = computeStripeSize(stripes[i].size, rad);
        width -= stripeSize.width;
        height -= stripeSize.height;
      }
    }
  }

  function drawStripesAsRTriangle() {
    var width = cnv.width * 2,
        height = cnv.height * 2,
        x = cnv.width,
        rad = degToRad(180 - orient);

    while (width && height) {
      for (var i = 0; i < stripes.length; i++) {
        drawPaths([
          {x: x, y: 0},
          {x: x - width, y: 0},
          {x: x, y: height}
        ]);

        ctx.fillStyle = stripes[i].color;
        ctx.fill();

        var stripeSize = computeStripeSize(stripes[i].size, rad);
        width -= stripeSize.width;
        height -= stripeSize.height;
      }
    }
  }

  function drawPaths(points) {
    var lastPt = points[points.length-1];

    ctx.beginPath();
    ctx.moveTo(lastPt.x, lastPt.y);
    $.each(points, function(){
      ctx.lineTo(this.x, this.y);
    });
    ctx.closePath();
  }

  // Public API here
  return {
    setPreviewEl: function(selector) {
      previewEl = $(selector);
    },
    getOrient: function() {
    	return orient;
    },
    setOrient: function(value) {
    	orient = value;
    },
    addStripe: function(color, size) {
    	stripes.push({
    		size: size,
    		color: color
    	});
    },
    updateStripe: function(index, props) {
    	if (stripes[index] && props) {
        for (var prop in stripes[index]) {
          if (prop in props) {
            stripes[index][prop] = props[prop];
          }
        }
      }
    },
    removeStripe: function(index) {
    	if (stripes[index]) {
    		stripes.splice(index, 1);
    	}
    },
    render: function() {
      setCanvasSize(
        computeCanvasSize()
      );
      drawStripes();
      if (previewEl) {
        previewEl.css('background-image', 'url('+ cnv.toDataURL() +')');
      }
      //return cnv.toDataURL();
    },
    getURL: function() {
      return cnv.toDataURL();
    }
  };
});
