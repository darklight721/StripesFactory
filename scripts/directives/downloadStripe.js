'use strict';

StripesFactoryv2App.directive('downloadStripe', ['Stripes', function(Stripes) {
	return function(scope, element, attrs) {
		element.bind('click', function(){
			element.attr('href', Stripes.getURL());
		});
	};
}]);
