'use strict';

var retrospective = angular.module('retrospective', ['ngResource', 'ngRoute', 'routeStyles', 'pascalprecht.translate', 'ngSanitize', 'ui.bootstrap', 'emoji']);

retrospective.config(function ($routeProvider) {

    $routeProvider.
        when('/', {
            controller: 'HomeCtrl',
            templateUrl: '/app/retrospective/views/home.html'
        }).
        when('/home', {
            controller: 'HomeCtrl',
            templateUrl: '/app/retrospective/views/home.html'
        }).
        when('/retro/:id', {
            controller: 'RetroCtrl',
            templateUrl: '/app/retrospective/views/retro.html'
        }).
        when('/how-it-works', {
            controller: 'HowItWorksCtrl',
            templateUrl: '/app/retrospective/views/how-it-works.html'
        })
});

retrospective.config(function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: '/languages/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en_US');
});

retrospective.config(function ($httpProvider){

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

});


