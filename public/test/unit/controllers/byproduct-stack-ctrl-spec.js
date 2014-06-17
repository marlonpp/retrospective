'use strict';

describe('ByProductStackCtrl', function () {

    var scope, byproduct_stack_ctrl, fixture;

    beforeEach(module("advisor"));

   
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location, $route, $routeParams) {
     	fixture = mock.productFixture;
    	scope = $rootScope.$new();

        byproduct_stack_ctrl = $controller("ByProductStackCtrl", {
            $scope: scope
        });

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

    }));
    
    it('should have type = to BALANCED', function () { 	
    	expect(scope.stack).not.toBe(null);
    	expect(scope.stack).toBe("BYPRODUCT");

    });

    it('should have a category list', inject(function ($httpBackend) {
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
        $httpBackend.expectGET('/views/advisor/landing-page.html').respond(200);
        $httpBackend.flush();
        expect(scope.data).not.toBe(undefined);
    }));
    
    it('should route to by product stack page', inject(function($controller, $rootScope, $location, $httpBackend, $routeParams) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/choose/'+Stack.BYPRODUCT);
        $httpBackend.expectGET('/views/advisor/byproduct-stack.html').respond(200);
        //$rootScope.$digest();      
      	$httpBackend.flush();

    }));
    
    it('should route to by product stack page (/hmc-cat/BYPRODUCT)', inject(function($controller, $rootScope, $location, $httpBackend, $routeParams) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/hmc-cat/'+Stack.BYPRODUCT);
        $httpBackend.expectGET('/views/advisor/byproduct-stack.html').respond(200);
        //$rootScope.$digest();      
      	$httpBackend.flush();

    }));
    
    
    it('should route to by product stack page (/hmc-cat/BYPRODUCT)', inject(function($controller, $rootScope, $location, $httpBackend, $routeParams) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/hmc-sub/'+Stack.BYPRODUCT);
        $httpBackend.expectGET('/views/advisor/byproduct-stack.html').respond(200);
        //$rootScope.$digest();      
      	$httpBackend.flush();

    }));

});


