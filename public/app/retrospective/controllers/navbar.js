'use strict';

retrospective.controller('NavbarCtrl', function NavbarCtrl($scope, $location) {
    $scope.links = [
        {
            name: "Home",
            address: "#/"
        },
        {
            name: "How it Works",
            address: "#/how-it-works"
        }
    ];

  $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };

});