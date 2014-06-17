'use strict';

retrospective.controller('HomeCtrl',
function HomeCtrl($scope, $location, retroService) {
    $scope.description = "";

    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.retros = [];

    retroService.setUrl("retrospectivesWS");
    retroService.service.connect();

    retroService.service.subscribe(function(response) {
        if (Array.isArray(response)) {
            $scope.retros = response;
        } else {
            console.log(response);
            $scope.retros.unshift(response);
        }
        $scope.$apply();
    });

    $scope.numberOfPages = function(){
        if($scope.retros) {
            return Math.ceil($scope.retros.length / $scope.pageSize);
        } else{
            return 0;
        }
    };

    $scope.page = function(index){
        $scope.currentPage=index;
    };

    $scope.goTo = function(id){
        console.log('test '+id);
        $location.url("/retro/"+id);
    };

    $scope.submitForm = function() {
        if ($scope.retroForm.$valid) {
            var retro = {description : $scope.description, isClosed : false};
            $scope.description = "";
            retroService.add(retro).then(function(response){
                $location.url("/retro/"+response.data);
            });
        }
    };

    $scope.addNew = function(){
        var div = $("#newRetrospective");
        var button = $("#addNew");

        if (div.css('display') !== 'none') {
            div.slideUp();
            button.prop('value', 'Add New');
            button.toggleClass("btn-danger");
        } else {
            div.slideDown();
            $("#desc").focus();
            button.prop('value', 'Cancel');
            button.toggleClass( "btn-danger");
        }
    };

});