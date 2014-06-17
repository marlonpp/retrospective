'use strict';

describe('LandingPageCtrl', function () {

    var scope, landing_page_ctrl, location;

    beforeEach(module("advisor"));


    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location) {

        scope = $rootScope.$new();
        location = $location;
        landing_page_ctrl = $controller("LandingPageCtrl", {
            $scope: scope
        });

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
        $httpBackend.expectGET('/products/by-category').respond({});

    }));

    it('should change location', function () {

        expect(location.path()).toBe('');
        scope.goTo('/cloud-stack');
        expect(location.path()).toBe('/cloud-stack');

    });

    it('should scroll to advisorSolutions', function () {

        expect(location.hash()).toBe('');
        scope.scrollTo('advisorSolutions');
        expect(location.hash()).toBe('advisorSolutions');

    });
});