'use strict';

StripesFactoryv2App.controller('MainCtrl', ['$scope', 'Stripes', function($scope, Stripes) {
  $scope.stripes = [];
  $scope.orient = 0;
  $scope.stripe = {
  	color: {
  		r: 0, g: 0, b: 0, hex: '#000000'	
  	},
  	size: 10
  };
  $scope.currentStripe = 0;

  $scope.select = function(index) {
  	$scope.currentStripe = index;
  };

  $scope.updateColor = function(isHex) {
    if (isHex) {

    }

    Stripes.updateStripe($scope.currentStripe, {
      color: $scope.color.hex
    });
  };

  $scope.updateSize = function() {
    Stripes.updateStripe($scope.currentStripe, {
      size: $scope.size
    });
  };

  $scope.updateOrient = function() {
    Stripes.setOrient($scope.orient);
  }

  function hexColorToRGB(hex) {
    var color = {
      r: 0, g: 0, b: 0
    };


    return color;
  }
  
}]);
