'use strict';

describe('BalancedStackCtrl', function () {

    var scope, balanced_stack_ctrl, fixture;

    beforeEach(module("advisor"));

 	beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location, $route) {
     	fixture = mock.productFixture; 
        scope = $rootScope.$new();

        balanced_stack_ctrl = $controller("BalancedStackCtrl", {
            $scope: scope
        });

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

    }));
    
    it('should have type = to BALANCED', function () { 	
    	expect(scope.stack).not.toBe(null);
    	expect(scope.stack).toBe("BALANCED");

    });

    it('should have a category list', inject(function ($httpBackend) {
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
        $httpBackend.expectGET('/views/advisor/landing-page.html').respond(200);
        $httpBackend.flush();
        expect(scope.data).not.toBe(undefined);
    }));
    
    it('should route to balanced stack page', inject(function($rootScope, $location,$httpBackend, $route) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/choose/'+Stack.BALANCED);
        $httpBackend.expectGET('/views/advisor/balanced-stack.html').respond(200);
       // $rootScope.$digest();
       // expect($route.current.controller).toBe('BalancedStackCtrl');
      	$httpBackend.flush();

    }));
    
    it('should route to balanced stack page (/hmc-cat/BALANCED)', inject(function($rootScope, $location,$httpBackend, $route) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/hmc-cat/'+Stack.BALANCED);
        $httpBackend.expectGET('/views/advisor/balanced-stack.html').respond(200);
       // $rootScope.$digest();
       // expect($route.current.controller).toBe('BalancedStackCtrl');
      	$httpBackend.flush();

    }));
    
    it('should route to balanced stack page (/hmc-sub/BALANCED)', inject(function($rootScope, $location,$httpBackend, $route) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/hmc-sub/'+Stack.BALANCED);
        $httpBackend.expectGET('/views/advisor/balanced-stack.html').respond(200);
       // $rootScope.$digest();
       // expect($route.current.controller).toBe('BalancedStackCtrl');
      	$httpBackend.flush();

    }));

});


