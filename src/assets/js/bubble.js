function testvar() {
   var app = angular.module('ionicList', ['ionic']);

   app.controller('DemoController', ['$scope', '$ionicSideMenuDelegate', function ($scope, $ionicSideMenuDelegate) {
   
   $ionicSideMenuDelegate.canDragContent(false);
   
   $scope.showContent = function($fileContent){
      $scope.content = $fileContent;
      document.getElementById('csvForm').reset();
   };
   
   $scope.triggerCSV = function() {
      setTimeout(function() {
         document.getElementById('csvFile').click();
      }, 0);
   };
   
   } ]);

   app.directive('onReadFile', function ($parse) {
      return {
         restrict: 'A',
         scope: false,
         link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
   
            element.on('change', function(onChangeEvent) {
               var reader = new FileReader();
   
               reader.onload = function(onLoadEvent) {
                  scope.$apply(function() {
                     fn(scope, {$fileContent:onLoadEvent.target.result});
                  });
               };
   
               reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
         }
      };
   });
}