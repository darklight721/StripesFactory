'use strict';

StripesFactoryv2App.directive('icon', function() {
	return {
		template: '<span class="icon" ng-transclude></span>',
		restrict: 'E',
		replace: true,
		transclude: true
	};
});
