'use strict';

describe('productService', function () {
    var fixture;

    beforeEach(module("advisor"));

    beforeEach(function () {
        fixture = mock.productFixture;
    });

    it('should set the icon url for all of the specifications', inject(function (productSpecService) {
        productSpecService.handleIconUrl(fixture.laptop1.details.specifications);

        angular.forEach(fixture.laptop1.details.specifications, function (specification) {
            expect(specification).not.toBe(undefined);
        });
    }));

    it('should not break for undefined specs', inject(function (productSpecService) {
        productSpecService.handleIconUrl(undefined);
    }));
});