'use strict';

retrospective.controller('HomeCtrl',
function HomeCtrl($scope, $location, retroService) {
    $scope.description = "";

    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.retros = [];

    retroService.setUrl("retrospectivesWS");
    retroService.service.connect();

    retroService.service.subscribe(function(response) {
        $scope.$apply(function(){
            if (Array.isArray(response)) {
                $scope.retros = response;
            } else {
                var index = indexById(response);
                if(index >= 0){
                    $scope.retros[index] = response;
                }
                else{
                    $scope.retros.push(response);
                }
            }
        });
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

    function indexById(retro){
        for (var j = 0; j < $scope.retros.length; j++) {
            if ($scope.retros[j]._id === retro._id) {
                return j;
            }
        }
        return -1;
    }

});