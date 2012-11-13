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
    $.each($scope.stripes, function() {
      Stripes.addStripe(this.color.hex, this.size);
    });
    Stripes.setOrient($scope.orient);
    Stripes.render();
  })();

  $scope.updateHex = function(index) {
    var hex = $scope.stripes[index].color.hex;
    hex = hex.match(/^#([0-9,a-f]{6}|[0-9,a-f]{3})$/i);
    
    if (hex) {
      // update rgb fields
      angular.extend($scope.stripes[index].color, hexToRGB(hex[0]));
      // update stripes
      Stripes.updateStripe(index, { color: hex[0] });
      Stripes.render();
    }

    setError(index, 'hex', hex ? false : true);
  };

  $scope.updateRGB = function(index, options) {
    var rgb = {
          r: parseInt($scope.stripes[index].color.r),
          g: parseInt($scope.stripes[index].color.g),
          b: parseInt($scope.stripes[index].color.b)
        },
        isError = true;
    
    if (options && options.key && options.inc) {
      rgb[options.key] = rgb[options.key] + options.inc;
    }
    
    if (rgb.r >= 0 && rgb.r <= 255 &&
        rgb.g >= 0 && rgb.g <= 255 &&
        rgb.b >= 0 && rgb.b <= 255) {
      
      var hex = rgbToHex(rgb);  
      // update hex field
      $scope.stripes[index].color.hex = hex
      // update stripes
      Stripes.updateStripe(index, { color: hex });
      Stripes.render();

      isError = false;
    }

    setError(index, 'rgb', isError);
  };

  $scope.updateSize = function(index, options) {
    var size = parseInt($scope.stripes[index].size),
        isError = true;
    
    if (options && options.inc) {
      $scope.stripes[index].size = size + options.inc;
      size = $scope.stripes[index].size;
    }
    
    if (size >= 1 && size <= 100) {
      // update stripes
      Stripes.updateStripe(index, { size: size });
      Stripes.render();

      isError = false;
    }

    setError(index, 'size', isError);
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
    var stripe = { color: { r: 156, g: 197, b: 201, hex: '#9CC5C9' }, size: 15 };
    $scope.stripes.push(stripe);
    
    // update stripes
    Stripes.addStripe(stripe.color.hex, stripe.size);
    Stripes.render();
  };

  $scope.showRemove = function() {
    return $scope.stripes.length > 2;
  }
  
  $scope.remove = function(index) {
    $scope.stripes.splice(index, 1);
    
    // remove stripe
    Stripes.removeStripe(index);
    Stripes.render();
  };

  $scope.updateOrient = function(inc) {
    var orient = parseInt($scope.orient),
        isError = true;
    
    if (inc) {
      $scope.orient = orient + inc;
      orient = $scope.orient;
    }
    
    if (orient >= 0 && orient < 180) {
      // update stripes
      Stripes.setOrient(orient);
      Stripes.render();
    
      isError = false;
    }
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
    return '#' + zeroPad(toHex(rgb.r)) + zeroPad(toHex(rgb.g)) + zeroPad(toHex(rgb.b));
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
