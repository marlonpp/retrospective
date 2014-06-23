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
                var input = {description : $scope.description, type : $scope.type, votes : 0};
                $scope.retro.inputs.push(input);
                retroService.addInput(retroId, input).then(function(){
                    $scope.description = "";
                    $scope.type = "START";
                });
            }
        };

        $scope.remove = function(input){
            var index = getIndex(input);
            $scope.retro.inputs.splice(index,1);
            retroService.removeInput(retroId, $scope.retro.inputs.indexOf(input));
        };

        $scope.addVote = function(input){
            var index = getIndex(input);
            $scope.retro.inputs[index].votes += 1;
            retroService.addVote(retroId, index);
        }

        $scope.save = function(){
            retroService.add($scope.retro);
            $scope.editCancel();
        }

        $scope.editCancel = function(){
            $(".edit").toggle();
        }

        function getIndex(input){
            return $scope.retro.inputs.indexOf(input);
        }

    }
);