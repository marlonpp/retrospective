'use strict';

retrospective.controller('RetroCtrl',
    function RetroCtrl($scope, $routeParams, retroService) {
        var retroId = $routeParams["id"];
        $scope.type = "START";
        $scope.description = "";
        $scope.retro = {};

        retroService.setUrl("retrospectiveWS/"+retroId);
        retroService.service.connect();

        retroService.service.subscribe(function(response) {
            $scope.retro = response;
            $scope.$apply();
        });

        $scope.submitForm = function() {
            if ($scope.inputForm.$valid) {
                var input = {description : $scope.description, type : $scope.type};
                retroService.addInput(retroId, input).then(function(){
                    $scope.description = "";
                    $scope.type = "START";
                });
            }
        };

        $scope.remove = function(input){
            retroService.removeInput(retroId, $scope.retro.inputs.indexOf(input));
        };

        $scope.addVote = function(input){
            console.log($scope.retro.inputs.indexOf(input));
            retroService.addVote(retroId, $scope.retro.inputs.indexOf(input));
        }

    }
);