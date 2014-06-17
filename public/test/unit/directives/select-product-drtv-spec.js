'use strict';

describe('select product', function () {

    var el, scope, fixture;

    beforeEach(module("advisor"));
    beforeEach(module("views/advisor/directives/av-product.html"));
    beforeEach(module("views/advisor/directives/av-select-product.html"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
        fixture = mock.productFixture;
        scope = $rootScope;

        scope.handleProductSelection = function () {
            scope.selectedProduct = null;
        };

        scope.selectProduct = function (product) {
            product.active = true;
            scope.handleProductSelection();
        };

        $.fx.off = true;

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

        scope.products = fixture.products;

        el = angular.element('<div av-select-product selected-product="selectedProduct" products="products"/>');

        $compile(el)(scope);
        scope.$digest();

        $.prototype.slideUp = function () {
            this.hide();
        };

        $.prototype.slideDown = function () {
            this.show();
        };

    }));

    /*it('should not have dropdownItems if product list is empty', function () {
        scope.products = undefined;
        scope.$apply();

        expect(el.find(".dropdownItem").length).toBe(0);
    });

    it('should have as many dropdownItems as the product list length', function () {
        expect(el.find(".dropdownItem").not(".ng-hide").length).toBe(fixture.products.length);
    });

    it('should have only one select dropdown visible', function () {
        expect(el.find(".dropdownItem").not(".ng-hide").find(".selectProductDropdown").not(".ng-hide").length).toBe(1);
    });

    it('should hide view details from the dropdown items', function () {
        expect(el.find(".viewDetails").not(".ng-hide").length).toBe(0);
    });

    it('should hide why recommended from the dropdown items', function () {
        expect(el.find(".whyRecommended").not(".ng-hide").length).toBe(0);
    });

    it('should have quantity as text for the dropdown items', function () {
        expect(el.find(".dropdownItem").not(".ng-hide").find(".quantityText").not(".ng-hide").length).toBe(0);
        expect(el.find(".dropdownItem").not(".ng-hide").find(".quantityReadOnly").not(".ng-hide").length).toBe(fixture.products.length);
    });

    it('should close the list container when clicking at select dropdown', function () {

        el.find('.productListContainer:first').show();

        expect(el.find('.productListContainer:first').attr('style')).toContain('display: block');

        el.find(".dropdownItem").not(".ng-hide").find(".selectProductDropdown").not(".ng-hide").click();

        expect(el.find('.productListContainer:first').attr('style')).toContain('display: none');

    });

    it('should select the product when clicking at the dropdown item', function () {

        var category = fixture.products[1].category;
        el.find('#productListContainer_' + category).show();

        expect(el.find('#productListContainer_' + category).attr('style')).toContain('display: block');

        expect(fixture.products[1].active).toBe(false);

        el.find(".dropdownItem").not(".ng-hide")[1].click();

        expect(fixture.products[1].active).toBe(true);

        expect(el.find('#productListContainer_' + category).attr('style')).toContain('display: none');

    });*/

});