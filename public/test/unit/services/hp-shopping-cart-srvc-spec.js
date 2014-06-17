'use strict';

describe('hpShoppingCart', function () {

    var fixture, service, shoppingCartService, $httpBackend;
    var URL = 'http://h71016.www7.hp.com/dcart/cart.asp?HPURL=Y&From=HPStore&HP_PartNo=%id%';
    var UPDATE_URL = 'http://h71016.www7.hp.com/dstore/dcart/cart.asp?HeaderAction=ViewCart&oi=E9CED&BEID=19701&SBLID=';
    var JSONP_URL = 'http://www.shopping.hp.com/webapp/shopping/services.do?action=ac&add_prod_id=%id%&qty=%q%&callback=JSON_CALLBACK';
    var  cookieValue = {};

    beforeEach(module("advisor"));

    beforeEach(function() {
            module(function ($provide) {
                $provide.value('$cookies',
                    cookieValue
                );
            });
            inject(function (productService, hpShoppingCartService, _$httpBackend_) {
                fixture = mock.productFixture;

                shoppingCartService = hpShoppingCartService;
                service = productService;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

            });
        }
    );

    it('should make insert products into HP Shopping Cart', function () {

        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        service.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();

        var products = service.getProductsForCart(Stack.CLOUD);
        angular.forEach(products, function (product) {
            var productUrl = JSONP_URL.replace('%id%', encodeURIComponent(product._id)).replace('%q%',product.quantity);
            $httpBackend.expectJSONP(productUrl).respond({});
        });

        shoppingCartService.addProductsToShoppingCart(products);
        $httpBackend.flush();

    });

    // (SERVER INSERT)
    it('should make insert products into HP Shopping1 Cart', function () {
        cookieValue = {
            "PA_SMB_ShopperId" : "12345"
        };
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        service.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();

        var products = service.getProductsForCart(Stack.CLOUD);
        $httpBackend.expectPOST("/shoppingcart").respond({});
        shoppingCartService.addProductsToShopping1Cart(products);

    });

    it('should make insert products into HP Shopping1 Cart', function () {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        service.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();

        var products = service.getProductsForCart(Stack.CLOUD);
        shoppingCartService.addProductsToShopping1Cart(products);

    });

});
