'use strict';

describe('hpShoppingCart', function () {

    var service;

    beforeEach(module("advisor"));

    beforeEach(inject(function (routeService) {
        service = routeService;
    }));

    it('should return the right route', function () {
        expect(service.getRoute(Stack.CLOUD)).toBe("/cloud-stack");
        expect(service.getRoute(Stack.BALANCED)).toBe("/balanced-stack");
        expect(service.getRoute(Stack.BYPRODUCT)).toBe("/byproduct-stack");
    });
});