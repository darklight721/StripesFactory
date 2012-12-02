'use strict';

StripesFactoryv2App.factory('Stripes', function() {
	// Service logic
	var _cnv = $('canvas#cnv')[0] ||
			$('<canvas id="cnv"></canvas>').appendTo('body')[0],
		_ctx = _cnv.getContext('2d'),
		_orient = 0,
		_stripes = [],
		_previewEl = null,
		_hasParamError = false;

	// default stripes
	(function(){
		_stripes = [
			{ color: '#9CC5C9', size: 15 },
			{ color: '#D5544F', size: 15 },
			{ color: '#CDB599', size: 15 },
			{ color: '#A08689', size: 15 }
		];
		_orient = 90;
	})();

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
		};

		if (_orient === 0) {
			$.each(_stripes, function(){
				size.height += this.size;
			});
			size.width = 10;
		}
		else if (_orient === 90) {
			$.each(_stripes, function(){
				size.width += this.size;
			});
			size.height = 10;
		}
		else {
			var rad = degToRad(
				_orient > 90 ? 180 - _orient : _orient
			);

			$.each(_stripes, function(){
				var stripeSize = computeStripeSize(this.size, rad);
				size.width += stripeSize.width;
				size.height += stripeSize.height;
			});
		}

		return size;
	}

	function setCanvasSize(size) {
		_cnv.width = size.width;
		_cnv.height = size.height;
	}

	function drawStripes() {
		if (_orient === 0) {
			drawStripesAsVertRect();
		}
		else if (_orient > 0 && _orient < 90) {
			drawStripesAsLTriangle();
		}
		else if (_orient === 90) {
			drawStripesAsHorzRect();
		}
		else if (_orient > 90 && _orient < 180) {
			drawStripesAsRTriangle();
		}
	}

	function drawStripesAsHorzRect() {
		var x = 0;
		$.each(_stripes, function(){
			_ctx.fillStyle = this.color;
			_ctx.fillRect(x, 0, this.size, _cnv.height);
			x += this.size;
		});
	}

	function drawStripesAsVertRect() {
		var y = 0;
		$.each(_stripes, function(){
			_ctx.fillStyle = this.color;
			_ctx.fillRect(0, y, _cnv.width, this.size);
			y += this.size;
		});
	}

	function drawStripesAsLTriangle() {
		var width = _cnv.width * 2,
			height = _cnv.height * 2,
			rad = degToRad(_orient);

		while (width && height) {
			for (var i = _stripes.length-1; i >= 0; i--) {
				drawPaths([
					{x: 0, y: 0},
					{x: width, y: 0},
					{x: 0, y: height}
				]);

				_ctx.fillStyle = _stripes[i].color;
				_ctx.fill();

				var stripeSize = computeStripeSize(_stripes[i].size, rad);
				width -= stripeSize.width;
				height -= stripeSize.height;
			}
		}
	}

	function drawStripesAsRTriangle() {
		var width = _cnv.width * 2,
			height = _cnv.height * 2,
			x = _cnv.width,
			rad = degToRad(180 - _orient);

		while (width && height) {
			for (var i = 0; i < _stripes.length; i++) {
				drawPaths([
				{x: x, y: 0},
				{x: x - width, y: 0},
				{x: x, y: height}
				]);

				_ctx.fillStyle = _stripes[i].color;
				_ctx.fill();

				var stripeSize = computeStripeSize(_stripes[i].size, rad);
				width -= stripeSize.width;
				height -= stripeSize.height;
			}
		}
	}

	function drawPaths(points) {
		var lastPt = points[points.length-1];
		_ctx.beginPath();
		_ctx.moveTo(lastPt.x, lastPt.y);
		$.each(points, function(){
			_ctx.lineTo(this.x, this.y);
		});
		_ctx.closePath();
	}

	function checkIntRange(num, min, max) {
		num = parseInt(num);
		return num >= min && num <= max;
	}

	function checkHexColor(hex) {
		return typeof hex === 'string' && 
			hex.match(/^#([0-9,a-f]{6}|[0-9,a-f]{3})$/i);
	}

	// Public API here
	return {
		previewEl: function(selector) {
			_previewEl = $(selector);
			return this;
		},
		orient: function(orient) {
			// as getter
			if (typeof orient === 'undefined') {
				return _orient;
			}
			// as setter
			if (checkIntRange(orient, 0, 179)) {
				_orient = parseInt(orient);
				_hasParamError = false;
			}
			else {
				_hasParamError = true;
			}
			return this;
		},
		add: function(props) {
			if (props && 
				props.hasOwnProperty('color') && 
				checkHexColor(props.color) &&
				props.hasOwnProperty('size') && 
				checkIntRange(props.size, 1, 100)) {
				_stripes.push({
					color: props.color,
					size: parseInt(props.size)
				});
				_hasParamError = false;
			}
			else {
				_hasParamError = true;
			}
			return this;
		},
		update: function(index, props) {
			_hasParamError = true;
			if (_stripes[index] && props) {
				if (props.hasOwnProperty('color') && 
					checkHexColor(props.color)) {
					_stripes[index].color = props.color;
					_hasParamError = false;
				}
				if (props.hasOwnProperty('size') && 
					checkIntRange(props.size, 1, 100)) {
					_stripes[index].size = parseInt(props.size);
					_hasParamError = false;
				}
			}
			return this;
		},
		remove: function(index) {
			if (typeof index === 'undefined') {
				_stripes.length = 0;
			}
			else if (_stripes[index]) {
				_stripes.splice(index, 1);
			}
			return this;
		},
		get: function(index) {
			if (typeof index === 'undefined') {
				return angular.copy(_stripes);
			}
			return _stripes[index] ? angular.copy(_stripes[index]) : null;
		},
		count: function() {
			return _stripes.length;
		},
		render: function() {
			if (!_hasParamError) {
				setCanvasSize(
					computeCanvasSize()
				);
				drawStripes();
				if (_previewEl) {
					_previewEl.css(
						'background-image', 'url(' + _cnv.toDataURL() + ')'
					);
				}
				else {
					return _cnv.toDataURL();
				}
			}
			return this;
		},
		getURL: function() {
			return _cnv.toDataURL();
		},
		hasParamError: function() {
			return _hasParamError;
		}
	};
});
