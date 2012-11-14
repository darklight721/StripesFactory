'use strict';

StripesFactoryv2App.controller('MainCtrl', ['$scope', 'Stripes', function($scope, Stripes) {
  // default stripes
  $scope.stripes = [
    { color: { r: 156, g: 197, b: 201, hex: '#9CC5C9' }, size: 15 },
    { color: { r: 213, g:  84, b:  79, hex: '#D5544F' }, size: 15 },
    { color: { r: 205, g: 181, b: 153, hex: '#CDB599' }, size: 15 },
    { color: { r: 160, g: 134, b: 137, hex: '#A08689' }, size: 15 }
  ];
  $scope.orient = 90;

  // init Stripes
  (function() {
    Stripes.setPreviewEl('.header-block');
    Stripes.clearStripes();
    $.each($scope.stripes, function() {
      Stripes.addStripe(this.color.hex, this.size);
    });
    Stripes.setOrient($scope.orient);
    Stripes.render();
  })();

  $scope.updateHex = function(index) {
    var stripe = $scope.stripes[index];
    Stripes.updateStripe(
      index, { color: stripe.color.hex }
    ).render();
    
    var hasError = Stripes.hasParamError();
    if (!hasError) {
      // update rgb fields
      angular.extend(stripe.color, hexToRGB(stripe.color.hex));
    }
    setError(index, 'hex', hasError);
  };

  $scope.updateRGB = function(index, options) {
    var stripe = $scope.stripes[index];
    if (options && options.key && options.inc) {
      stripe.color[options.key] = 
        parseInt(stripe.color[options.key]) + options.inc;
    }
    
    var hex = rgbToHex(stripe.color);
    Stripes.updateStripe(index, { color: hex }).render();
    
    var hasError = Stripes.hasParamError();
    if (!hasError) {
      // update hex field
      stripe.color.hex = hex;
    }
    setError(index, 'rgb', hasError);
  };

  $scope.updateSize = function(index, options) {
    var stripe = $scope.stripes[index];
    if (options && options.inc) {
      stripe.size = parseInt(stripe.size) + options.inc;
    }
    
    Stripes.updateStripe(index, { size: stripe.size }).render();

    setError(index, 'size', Stripes.hasParamError());
  };

  $scope.showSwap = function(isLeft, index) {
    return isLeft ? index : index < $scope.stripes.length-1;
  };
  
  $scope.swap = function(index1, index2) {
    var temp = angular.copy($scope.stripes[index1]);
    angular.extend($scope.stripes[index1], $scope.stripes[index2]);
    angular.extend($scope.stripes[index2], temp);
    
    //update stripes
    angular.forEach([index1, index2], function(index){
      Stripes.updateStripe(index, {
        color: $scope.stripes[index].color.hex,
        size: $scope.stripes[index].size
      });
    });
    Stripes.render();
  };

  $scope.showNew = function() {
    return $scope.stripes.length <= 10;
  }

  $scope.new = function() {
    var stripe = { 
      color: { r: 156, g: 197, b: 201, hex: '#9CC5C9' }, size: 15 
    };
    $scope.stripes.push(stripe);
    
    // update stripes
    Stripes.addStripe(stripe.color.hex, stripe.size).render();
  };

  $scope.showRemove = function() {
    return $scope.stripes.length > 2;
  }
  
  $scope.remove = function(index) {
    $scope.stripes.splice(index, 1);
    
    // remove stripe
    Stripes.removeStripe(index).render();
  };

  $scope.updateOrient = function(inc) {
    if (inc) {
      $scope.orient = parseInt($scope.orient) + inc;
    }
    
    Stripes.setOrient($scope.orient).render();
  };

  function setError(index, key, isError) {
    if(!$scope.stripes[index].error) {
      $scope.stripes[index].error = {};
    }
    $scope.stripes[index].error[key] = isError;
  }

  function hexToRGB(hex) {
    var rgb = {};
    hex = hex.substr(1); // remove '#'
    if (hex.length === 3) {
      rgb.r = parseInt(duplicate(hex.substr(0,1)), 16);
      rgb.g = parseInt(duplicate(hex.substr(1,1)), 16); 
      rgb.b = parseInt(duplicate(hex.substr(2,1)), 16); 
    }
    else if (hex.length === 6) {
      rgb.r = parseInt(hex.substr(0,2), 16);
      rgb.g = parseInt(hex.substr(2,2), 16);
      rgb.b = parseInt(hex.substr(4,2), 16);
    }
    return rgb;
  }
  
  function rgbToHex(rgb) {
    return '#' + 
           zeroPad(toHex(rgb.r)) + 
           zeroPad(toHex(rgb.g)) + 
           zeroPad(toHex(rgb.b));
  }
  
  function zeroPad(str) {
    return str.length === 1 ? '0' + str : str;
  }

  function duplicate(str) {
    return str + str;
  }
  
  function toHex(num) {
    return parseInt(num).toString(16);
  }
  
}]);
