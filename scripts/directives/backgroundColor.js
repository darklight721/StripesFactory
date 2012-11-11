'use strict';

StripesFactoryv2App.directive('backgroundColor', function() {
	return function(scope, element, attrs) {
		scope.$watch(attrs.backgroundColor, function(value) {
			element.css('background-color', value);
		});
	};
});
