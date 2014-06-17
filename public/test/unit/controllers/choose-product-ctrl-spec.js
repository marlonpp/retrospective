describe('ChooseProductCtrl', function () {

    var scope, choose_product_ctrl, fixture, location, httpBackend;

    beforeEach(module("advisor"));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location) {

        scope = $rootScope.$new();
        location = $location;
        httpBackend = $httpBackend;
        fixture = mock.productFixture;
        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

    }));

    it('should have stack = to CLOUD, SubCategory = to Laptop', inject(function ($controller) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD, product: "12345"};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        expect(scope.stack).not.toBe(null);
        expect(scope.stack).toBe("CLOUD");

        expect(scope.subCategory).not.toBe(null);
        expect(scope.subCategory).toBe("Laptop");

        expect(scope.oldProductId).not.toBe(null);
        expect(scope.oldProductId).toBe("12345");

    }));

    it('should change location if subCategory does not exist', inject(function ($controller) {
        var routeParams = {subCategory: "ANY", stack: Stack.CLOUD, product: "12345"};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();
        expect(location.path()).toBe('/landing-page');

    }));

    it('should have product list', inject(function ($controller, $httpBackend) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD, product: ""};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        $httpBackend.flush();

        expect(scope.products).not.toBe(undefined);


    }));

    it('should change location if uses goBack function', inject(function ($controller) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD, product: "12345"};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        scope.goBack();
        expect(location.path()).toBe('/cloud-stack');

    }));

    it('should change location if uses goBack function', inject(function ($controller, productService) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD, product: "12345"};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        scope.chooseProduct(fixture.laptop2);
        expect(location.path()).toBe('/cloud-stack');

        productService.getShoppingCartByStack(Stack.CLOUD).then(function (shoppingCartForCloud) {
            expect(shoppingCartForCloud).not.toBe(undefined);
            expect(shoppingCartForCloud["Personal Systems"]["Laptop"].products[0]._id).toBe(fixture.laptop1._id);
        });

    }));

    it('should not change product size if no filter is provided', inject(function ($controller, $httpBackend) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        $httpBackend.flush();

        expect(scope.products.length).toBe(3);

        scope.applyFilter();

        expect(scope.products.length).toBe(3);
    }));

    it('should not change product size if there is no option selected', inject(function ($controller, $httpBackend) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        $httpBackend.flush();

        expect(scope.products.length).toBe(3);

        scope.applyFilter(mock.productFixture.getMockFilter());

        expect(scope.products.length).toBe(3);
    }));

    it('should not change product size if there is all options are selected', inject(function ($controller, $httpBackend) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        $httpBackend.flush();

        var filter = mock.productFixture.getMockFilter();

        filter.options.forEach(function (option) {
            option.selected = true;
        });

        expect(scope.products.length).toBe(3);

        scope.applyFilter(filter);

        expect(scope.products.length).toBe(3);
    }));

    it('should change product size if there is an option selected and matching', inject(function ($controller, $httpBackend) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        $httpBackend.flush();

        var filter = mock.productFixture.getMockFilter();

        filter.options[0].selected = true;

        expect(scope.products.length).toBe(3);

        scope.applyFilter(filter);

        expect(scope.products.length).toBe(1);
    }));

    it('should change product size if there is an option selected and no match', inject(function ($controller, $httpBackend) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("ChooseProductCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        $httpBackend.flush();

        var filter = mock.productFixture.getMockFilter();

        filter.options[3].selected = true;

        expect(scope.products.length).toBe(3);

        scope.applyFilter(filter);

        expect(scope.products.length).toBe(0);
    }));
});