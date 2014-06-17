'use strict';

describe('avProduct', function () {

    var el;
    var compile;
    var scope;
    var  httpBackend, fixture;

    beforeEach(module("advisor"));
    beforeEach(module("views/advisor/directives/av-breadcrumbs.html"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend, productService) {
        fixture = mock.productFixture;

        scope = $rootScope;      
        httpBackend = $httpBackend;

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
        $httpBackend.expectGET('/views/advisor/landing-page.html').respond({});
        
        el = angular.element('<div av-breadcrumbs></div>');    
       compile = $compile;
            
       
    }));

    it('should contain contain breadcrumb service and landing page breadcrumb.', function () {
    	compile(el)(scope);
        scope.$digest();
        expect(el.text()).toContain('PRODUCT_ADVISOR_TEXT');
    	expect(scope.breadcrumbs).not.toBe(null);
    	//expect(scope.breadcrumbs.options).toBe();
    });
    
    it('should contain CLOUD stack label if breadcrumbs are in CLOUD stack related pages.', function () {
    	scope.stack = Stack.CLOUD;
    	compile(el)(scope);
        scope.$digest();
    	expect(el.text()).toContain('PRODUCT_ADVISOR_TEXT');
    	expect(scope.breadcrumbs).not.toBe(null);
    	expect(scope.breadcrumbs.options).not.toBe(undefined);
    	expect(scope.breadcrumbs.options.stack).not.toBe(null);
    	expect(scope.breadcrumbs.options.stack).toBe('CLOUD_OPTIMIZED_STACK_TEXT');

    });
    
    it('should contain BALANCED stack label if breadcrumbs are in CLOUD stack related pages.', function () {
    	scope.stack = Stack.BALANCED;
    	compile(el)(scope);
        scope.$digest();
    	expect(el.text()).toContain('PRODUCT_ADVISOR_TEXT');
    	expect(scope.breadcrumbs).not.toBe(null);
    	expect(scope.breadcrumbs.options).not.toBe(undefined);
    	expect(scope.breadcrumbs.options.stack).not.toBe(null);
    	expect(scope.breadcrumbs.options.stack).toBe('BALANCED_STACK_TEXT');

    });
    
    it('should contain BYPRODUCT stack label if breadcrumbs are in CLOUD stack related pages.', function () {
    	scope.stack = Stack.BYPRODUCT;
    	compile(el)(scope);
        scope.$digest();
    	expect(el.text()).toContain('PRODUCT_ADVISOR_TEXT');
    	expect(scope.breadcrumbs).not.toBe(null);
    	expect(scope.breadcrumbs.options).not.toBe(undefined);
    	expect(scope.breadcrumbs.options.stack).not.toBe(null);
    	expect(scope.breadcrumbs.options.stack).toBe('BUILD_YOUR_SOLUTION');

    });  
    
    it('should replace default breadcrumb for subcategory with dynamic label.', function () {
    	scope.subCategory = SubCategory.LAPTOP;
    	compile(el)(scope);
        scope.$digest();    
    	expect(scope.breadcrumbs).not.toBe(null);    	
    	expect(scope.breadcrumbs.options.CHOOSE_PRODUCT_SUBCATEGORY).not.toBe(null);
    	expect(scope.breadcrumbs.options.CHOOSE_PRODUCT_SUBCATEGORY).toContain(SubCategory.LAPTOP);
    	expect(scope.breadcrumbs.options.CHOOSE_PRODUCT_SUBCATEGORY).toContain('CHOOSE_SUBCATEGORY');
    });  
    
    it('should replace default breadcrumb for category with dynamic label.', function () {    	
    	scope.category = Category.PERSONALSYSTEMS;
    	compile(el)(scope);
        scope.$digest();    
    	expect(scope.breadcrumbs).not.toBe(null);    	
    	expect(scope.breadcrumbs.options.CHOOSE_PRODUCT_CATEGORY).not.toBe(null);
    	expect(scope.breadcrumbs.options.CHOOSE_PRODUCT_CATEGORY).toContain(Category.PERSONALSYSTEMS);
    	expect(scope.breadcrumbs.options.CHOOSE_PRODUCT_CATEGORY).toContain('HELP_CHOOSING');
    });  
    
    it('should remove breadcrumb with NO_BREADCRUMB label', function () {
    	scope.stack = Stack.CLOUD;
    	scope.subCategory = SubCategory.LAPTOP;
    	scope.product =  fixture.laptop1;

    	compile(el)(scope);
        scope.$digest();
    	expect(el.text()).toContain('PRODUCT_ADVISOR_TEXT');
    	expect(scope.breadcrumbs.options).not.toBe(undefined);
    	expect(scope.breadcrumbs.options.NO_BREADCRUMB).toBe(undefined);
    	expect(scope.breadcrumbs.breadcrumbs.length).toBe(2);
    	expect(scope.breadcrumbs.options.stack).toBe('CLOUD_OPTIMIZED_STACK_TEXT');

    });
  

});