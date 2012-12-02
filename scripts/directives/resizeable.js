'use strict';

StripesFactoryv2App.directive('resizeable', function() {
	return function(scope, element, attrs) {
		var $resizeEl = $(element)
				.wrapInner('<div class="resizeable"></div>')
				.find('.resizeable'),
			stripWidth = 0;

		scope.$watch(
			attrs.resizeable,
			function(value) {
				stripWidth = stripWidth || $resizeEl.find('.strip').outerWidth();
				$resizeEl.width(stripWidth * value);
			}
		);
	};
});
