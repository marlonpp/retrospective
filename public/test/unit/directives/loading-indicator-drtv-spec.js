'use strict';

describe('avLoadingIndicator', function () {

    var el, scope, httpBackend;

    beforeEach(module("advisor"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {

        scope = $rootScope;
        httpBackend = $httpBackend;

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
        $httpBackend.expectGET('/views/advisor/landing-page.html').respond({});

        el = angular.element('<div id="loading" av-loading-indicator style="display: none;"></div>');
        $compile(el)(scope);
        scope.$digest();


    }));

    it('should contain loading div.', function () {
            expect(el.attr('style')).toContain('display: none;');
    });

    it('should show and hide loading div.', function () {
        scope.$broadcast('loading-started');
        scope.$digest();
        expect(el.attr('style')).toContain('display: inline;');
        scope.$broadcast('loading-complete');
        scope.$digest();
        expect(el.attr('style')).toContain('display: none;');
    });

});