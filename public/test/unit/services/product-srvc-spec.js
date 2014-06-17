'use strict';

describe('productService', function () {
    var $httpBackend, $q, fixture;

    beforeEach(module("advisor"));

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('browserService', mock.browserService);
        });

        module(function ($provide) {
            $provide.value('browserDBService', mock.browserDBService);
        });
    });

    beforeEach(inject(function (_$httpBackend_, _$q_) {
        $q = _$q_;
        fixture = mock.productFixture;

        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
    }));

    it('should return a Chromebook when requesting for a Laptop', inject(function (productService) {
        var product = productService.getById(fixture.laptop1._id);
        product.then(function (data) {
            expect(data.name).toBe("Chromebook 14\" w/ mobile broadband");
            expect(data.category).toBe("Laptops");
        });
    }));

    it('should return a HP Slate when requesting for a Tablet', inject(function (productService) {
        var product = productService.getById(fixture.tablet1._id);
        product.then(function (data) {
            expect(data.name).toBe("HP Slate 7 Extreme Business Tablet (Android)");
            expect(data.category).toBe("Tablets");
        });
    }));

    it('should return server data of a product given an id when Indexed DB is not supported', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/123').respond(fixture.laptop1);

        productService.getById(123).then(function (data) {
            expect(data._id).toBe(fixture.laptop1._id);
        });
        $httpBackend.flush();
    }));

    it('should return server data of a product given an param when Indexed DB is not supported', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products?class=123').respond([fixture.laptop1]);

        productService.query("",123).then(function (data) {
            expect(data.length).toBe(1);
        });
        $httpBackend.flush();
    }));

    it('should return data from Indexed DB of a product given an id when Indexed DB is supported', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        mock.browserDBService.getById.andReturn(indexedDBPromise());

        productService.getById(123).then(function (data) {
            expect(data._id).toBe(fixture.laptop1._id);
        });
        $httpBackend.flush();
    }));

    it('should return all products from server when Indexed DB is not supported', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getAll().then(function (data) {
            expect(data).not.toBe(undefined);
            expect(data["categories"].length).toBe(1);
            var personalSystem = data["categories"][0];
            expect(personalSystem.name).toBe(Category.PERSONALSYSTEMS);
            expect(personalSystem.subCategories.length).toBe(1);
            expect(personalSystem.subCategories[0].name).toBe(SubCategory.LAPTOP);
            expect(data["Personal Systems"]["Laptop"].products.length).toBe(mock.productFixture.categoryList["Personal Systems"].Laptop.products.length);
            expect(data["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();
    }));

    it('should return data from Indexed DB of a product given a class when Indexed DB is supported', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        mock.browserDBService.getAll.andReturn(indexedDBPromise());

        productService.getAll().then(function (data) {
            expect(data._id).toBe(fixture.laptop1._id);
        });
        $httpBackend.flush();
    }));

    it('should return the cart for a given stack', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();

    }));

    it('should return the same cart for second Cloud stack calls', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        //emulating first call
        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id = "Changing ID!";
        });

        //second call should return th
        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe("Changing ID!");
        });

        $httpBackend.flush();

    }));

    it('should return the products of a subcategory', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getProductsBySubCategory(SubCategory.LAPTOP).then(function (response) {
            expect(response.products).not.toBe(undefined);
            expect(response.products.length).toBe(mock.productFixture.categoryList["Personal Systems"].Laptop.products.length);
            expect(response.products[0]._id).toBe(fixture.laptop1._id);
            expect(response.hasQuestions).toBe(true);
        });

        $httpBackend.flush();

    }));

    it('should return the hmc for a given answer key of subcategory', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getHMCFromSubCategory("1D2A3A", SubCategory.LAPTOP).then(function (hmc) {
            expect(hmc).not.toBe(undefined);
            expect(hmc.length).toBe(3);
            expect(hmc[0].sku).toBe("F1J74UT");
        });

        $httpBackend.flush();

    }));

    it('should return a product given a valid sku', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getProduct("F2J07AA", SubCategory.LAPTOP).then(function (laptop) {
            expect(laptop).not.toBe(undefined);
            expect(laptop._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();

    }));

    it('should return no product for invalid sku', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getProduct("THISISINVALID", SubCategory.LAPTOP).then(function (laptop) {
            expect(laptop).toBe(null);
        });

        $httpBackend.flush();

    }));

    it('should add a new product to a cart', inject(function (productService, $timeout) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.addProductToCart(Stack.CLOUD, fixture.laptop3);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(2);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[1]._id).toBe(fixture.laptop3._id);
        });

        $httpBackend.flush();

    }));

    it('should add the same product to a cart', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.addProductToCart(Stack.CLOUD, fixture.laptop3);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {

            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(2);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[1].quantity).toBe(1);
        });

        //second add
        productService.addProductToCart(Stack.CLOUD, fixture.laptop3);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(2);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[1].quantity).toBe(2);
        });

        $httpBackend.flush();

    }));

    it('should change to another product when add product to a cart with an old product', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        //first add
        productService.addProductToCart(Stack.CLOUD, fixture.laptop3);
        //second add replacing laptop3 by laptop2
        productService.addProductToCart(Stack.CLOUD, fixture.laptop2, fixture.laptop3._id);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(2);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[1].quantity).toBe(1);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[1]._id).toBe(fixture.laptop2._id);
        });

        $httpBackend.flush();

    }));

    it('should increase the quantity and remove old product when there add for an existing product', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        //first add
        productService.addProductToCart(Stack.CLOUD, fixture.laptop3);

        //second add replacing laptop3 by laptop2
        productService.addProductToCart(Stack.CLOUD, fixture.laptop1, fixture.laptop3._id);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {

            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(1);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0].quantity).toBe(2);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

        $httpBackend.flush();

    }));

    it('should remove a given product from cart', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(1);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0].quantity).toBe(1);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);

            productService.addProductToCart(Stack.CLOUD, fixture.laptop3);

            productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
                expect(shoppingCartForCloud).not.toBe(undefined);
                expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(2);
                expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[1]._id).toBe(fixture.laptop3._id);

                productService.removeProductFromCart(fixture.laptop3, Stack.CLOUD);

                productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
                    expect(shoppingCartForCloud).not.toBe(undefined);
                    expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products.length).toBe(1);
                    expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0].quantity).toBe(1);
                    expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
                });
            });


        });

        $httpBackend.flush();

    }));

    it('should get the product summary for a given stack', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (cart) {
            fixture.laptop2.quantity = undefined;
            cart["Personal Systems"]["Laptop"].products.push(fixture.laptop2);
            var summary = productService.getProductListSummary(Stack.CLOUD);
            expect(summary).not.toBe(undefined);
            expect(summary.totalCost).toBe(82.33);
            expect(summary.totalQuantity).toBe(1);
            expect(summary.emptyFields).toBe(true);

        });

        $httpBackend.flush();

    }));

    it('should get the products of a given stack', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(false);
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

        productService.getShoppingCartByStack(Stack.CLOUD).then(function () {

            var products = productService.getProductsForCart(Stack.CLOUD);
            expect(products).not.toBe(undefined);
            expect(products.length).toBe(1);
            expect(products[0]._id).toBe(fixture.laptop1._id+"#"+fixture.laptop1.optionCode);

        });

        $httpBackend.flush();

    }));


    function indexedDBPromise() {
        var deferred = $q.defer();

        deferred.resolve(fixture.laptop1);

        return deferred.promise;
    }
});
