'use strict';

describe('directives', function () {

    var el, scope;

    beforeEach(module("advisor"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {

        scope = $rootScope;

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

        el = angular.element('<input type="text" id="quantityText" ng-model="quantity" av-positive-number-only="4">');

        $compile(el)(scope);
        scope.$digest();

    }));

    it('should not allow any char by digits', function () {
        el.val('a-#.$');
        el.trigger('change');

        expect(el.val()).toBe('');
    });

    it('should accept digits limited to the length of 4', function () {
        el.val('123456');
        el.trigger('change');

        expect(el.val()).toBe('1234');
    });

    it('should not accept negative numbers', function () {
        el.val('-1');
        el.trigger('change');

        expect(el.val()).toBe('1');
    });
});