describe('HMCSubCtrl', function () {

    var scope, choose_product_ctrl, fixture, httpBackend, location;

    beforeEach(module("advisor"));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location) {

        scope = $rootScope.$new();
        fixture = mock.productFixture;

        location = $location;
        httpBackend = $httpBackend;
        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);

    }));


    it('should get initial set of questions', inject(function ($controller) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.questions.length).toBe(4);
        expect(scope.questions[0].text).toBe("Question Number 1");

    }));

    it('should change location if subCategory does not exist', inject(function($controller) {
        var routeParams = {subCategory : "ANY", stack : Stack.CLOUD, product : "12345"};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams : routeParams
        });

        httpBackend.flush();
        expect(location.path()).toBe('/landing-page');

    }));

    it('should display recommended skus if proper answer is given', inject(function ($controller) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.answerKey).toBe('');

        scope.questions[0].selected = "1D";
        scope.questions[0].visible = true;
        scope.questions[1].selected = "2A";
        scope.questions[1].visible = true;
        scope.questions[2].selected = "3A";
        scope.questions[2].visible = true;
        scope.$digest();

        scope.updateKey();

        scope.$digest();

        expect(scope.answerKey).toBe("1D2A3A");
        expect(scope.recommendedSKUs).not.toBe(undefined);
        expect(scope.recommendedSKUs.length).toBe(3);
        expect(scope.recommendedSKUs[0].sku).toBe("F1J74UT");
        expect(scope.recommendedSKUs[0].skuObject).not.toBe(undefined);


    }));

    it('should not bring recommended skus when there is no match', inject(function ($controller) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.answerKey).toBe('');

        scope.questions[0].selected = "1D";
        scope.questions[0].visible = true;
        scope.questions[1].selected = "2A";
        scope.questions[1].visible = true;
        scope.questions[2].selected = "3B";
        scope.questions[2].visible = true;
        scope.$digest();
        scope.updateKey();
        scope.$digest();

        expect(scope.answerKey).toBe("1D2A3B");
        expect(scope.recommendedSKUs).not.toBe(undefined);
        expect(scope.recommendedSKUs.length).toBe(0);
    }));

    it('should return undefined skus when invalid key is provided', inject(function ($controller) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.answerKey).toBe('');

        scope.questions[0].selected = "1F";
        scope.questions[0].visible = true;
        scope.questions[1].showIf = undefined;
        scope.questions[1].options[0].showIf = ["1A"];

        scope.$digest();
        scope.updateKey();
        scope.$digest();

        expect(scope.answerKey).toBe("1F");
        expect(scope.recommendedSKUs).toBe(undefined);
    }));

    it('should add old product id as part of the choose product link ', inject(function ($controller) {
        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD, product: "oldProduct"};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.chooseProductLink).toBe("#/choose/CLOUD/Laptop/oldProduct");
    }));

    it('should change the location url when clicking in go back ', inject(function ($controller, $location) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams,
            $location: $location
        });

        httpBackend.flush();

        expect($location.url()).toBe("");

        scope.goBack();

        expect($location.url()).toBe("/cloud-stack");
    }));

    it('should hide questions that are conditional', inject(function ($controller) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.answerKey).toBe('');
        expect(scope.questions[0].visible).toBe(true);
        expect(scope.questions[1].visible).toBe(true);
        expect(scope.questions[3].visible).toBe(undefined);
        expect(scope.questions[3].showIf.length).toBe(1);
        expect(scope.questions[3].showIf[0]).toBe("1D2A");

    }));

    it('should hide options that are conditional', inject(function ($controller) {

        var routeParams = {subCategory: SubCategory.LAPTOP, stack: Stack.CLOUD};

        choose_product_ctrl = $controller("HMCSubCtrl", {
            $scope: scope,
            $routeParams: routeParams
        });

        httpBackend.flush();

        expect(scope.questions[1].visible).toBe(true);
        expect(scope.questions[1].options[2].visible).toBe(undefined);
        expect(scope.questions[1].options[2].showIf[0]).toBe("1A");

    }));


});
