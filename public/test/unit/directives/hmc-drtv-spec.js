'use strict';

describe('hmcQuestion', function () {

    var el, scope;
    beforeEach(module("advisor"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
        scope = $rootScope;

        scope.question = mock.hmcFixture.questions[0];
        scope.selected = "";

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

        el = angular.element('<av-hmc-question question=question ng-model="selected"></av-hmc-question>');

        $compile(el)(scope);
        scope.$digest();


    }));

    it('should display questions as a span', function () {
        expect(el.find("span").text()).toContain('Question Number 1');
    });

    it('should display options as radio buttons', function () {
        var input = el.find("input");
        expect(input.length).toBe(2);
        expect(input[0].type).toBe("radio");
        expect(input[0].value).toBe("1A");
        expect(input[1].type).toBe("radio");
        expect(input[1].value).toBe("2A");
    });
});

describe('hmcRecommendedSku', function () {

    var el, scope, fixture, httpBackend;

    beforeEach(module("advisor"));
    beforeEach(module("views/advisor/directives/av-hmc-recommended-sku.html"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
        scope = $rootScope;
        fixture = mock.productFixture;

        scope.recommendedSKUs = mock.hmcFixture.recommendedSku;
        scope.stack = "CLOUD";
        httpBackend = $httpBackend;
        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
        httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        el = angular.element('<av-hmc-recommended-sku ng-show="recommendedSKUs" product="oldProductId" recommended-sku="recommendedSKUs" stack="stack" sub-category="subCategory"></av-hmc-recommended-sku>');

        $compile(el)(scope);
        scope.$digest();


    }));

    it('should display captions as a first row', function () {
        var firstRow = el.find(".row")[0];
        expect(firstRow.textContent.trim()).toBe("Good Value");
    });

    it('display product name second row', function () {
        var secondRow = el.find(".row")[1];
        expect(secondRow.textContent.trim()).toBe("Testing Product Name Chromebook 11\"");
    });

    it('gets specs short list from the database', inject(function (productService) {
        productService.getSpecsShortListFromSubCategory("Laptop").then(function(shortSpecList) {
            expect(shortSpecList.length).toBe(1);
            expect(shortSpecList[0].property).toBe("Operating System property");
            expect(shortSpecList[0].display).toBe("Operating System display");
        })
    }));

    it('add product to cart', inject(function (productService) {
        var link = el.find('#addToCart');

        productService.getShoppingCartByStack(Stack.CLOUD).then(function(){
            expect(productService.getProductsForCart(Stack.CLOUD).length).toBe(1);
        });

        setTimeout(function(link){
            httpBackend.flush();
            link.click();
            expect(productService.getProductsForCart(Stack.CLOUD)[0].quantity).toBe(2);
        }(link),1);
    }));
});
