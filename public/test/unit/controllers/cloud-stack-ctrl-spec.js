'use strict';

describe('CloudStackCtrl', function () {

    var scope, cloud_stack_ctrl, fixture;

    beforeEach(module("advisor"));
    
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location, $route) {
    	fixture = mock.productFixture; 
    	scope = $rootScope.$new();
    	cloud_stack_ctrl = $controller("CloudStackCtrl", {
    		$scope: scope
        });
       
        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});



    }));
    
    it('should have type = to CLOUD', function () { 	
    	expect(scope.stack).not.toBe(null);
    	expect(scope.stack).toBe("CLOUD");

    });

    it('should have a category list', inject(function ($httpBackend) {
        $httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
        $httpBackend.expectGET('/views/advisor/landing-page.html').respond(200);
        $httpBackend.flush();
        expect(scope.data).not.toBe(undefined);
    }));
    
    it('should route to cloud stack page', inject(function($controller, $rootScope, $location,$httpBackend) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/choose/'+Stack.CLOUD);
        $httpBackend.expectGET('/views/advisor/cloud-stack.html').respond(200);
        $rootScope.$digest();
      	$httpBackend.flush();

    }));
    
    it('should route to cloud stack page (/hmc-cat/CLOUD)', inject(function($controller, $rootScope, $location,$httpBackend) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/hmc-cat/'+Stack.CLOUD);
        $httpBackend.expectGET('/views/advisor/cloud-stack.html').respond(200);
        $rootScope.$digest();
      	$httpBackend.flush();

    }));
    
    it('should route to cloud stack page (/hmc-sub/CLOUD)', inject(function($controller, $rootScope, $location,$httpBackend) {      
    	$httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
    	$location.path('/hmc-sub/'+Stack.CLOUD);
        $httpBackend.expectGET('/views/advisor/cloud-stack.html').respond(200);
        $rootScope.$digest();
      	$httpBackend.flush();

    }));
    
    
});


