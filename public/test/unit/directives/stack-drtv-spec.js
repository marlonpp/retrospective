'use strict';

describe('StackDrtv', function () {

    var el, scope, fixture, location, httpBackend, timeout, q;
    var success = true;
    var fakeProducts = [{"_id":"12345", "quantity" : "1"}];

    beforeEach(module("advisor"));
    beforeEach(module("views/advisor/directives/av-product.html"));
    beforeEach(module("views/advisor/directives/av-stack.html"));



    beforeEach(function() {
        module(function ($provide) {
            $provide.value('productService',
                {
                    getProductListSummary : function(){
                        return {
                            products : [fixture.laptop1],
                            totalCost: 823.30,
                            period: '',
                            totalQuantity: 1,
                            currency: '',
                            emptyFields: false
                        }
                    },
                    getProductsForCart : function(){

                        return fakeProducts;
                    }
                }
            );

            $provide.value('hpShoppingCartService',
                {
                    addProductsToShopping1Cart : function(products){
                        var deferred = q.defer();
                        if(success) {
                            deferred.resolve({});
                            return deferred.promise;
                        } else{
                            deferred.reject({data : "message"});
                            return deferred.promise;
                        }
                    }

                }
            );

            $provide.value('$window',
                {
                    parent : { location : ""},
                    location : "",
                    document: window.document

                }
            );


        });

        inject(function ($compile, $rootScope, $httpBackend, $location, $timeout, $q) {
            fixture = mock.productFixture;
            scope = $rootScope;

            $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
            q = $q;
            scope.data = fixture.categoryList;
            el = angular.element('<div  av-stack type="CLOUD" data="data"></div>');

            httpBackend = $httpBackend;
            location = $location;
            timeout = $timeout;
            $compile(el)(scope);
            scope.$digest();

        });
    });

    it('should generate the page with category in it.', function () {
        expect(el.text()).not.toBe('');
        expect(el.text()).toContain('Personal Systems');
    });
    
    it('should contain subcategories.', function () {
        expect(el.text()).toContain(SubCategory.LAPTOP);        
    });
    
    it('should contain the products from subcategories.', function () {
        expect(el.text()).toContain(fixture.laptop1.name);
        
    });

    it('should contain the totalCost', function () {
        expect(el.find("#totalCost").html()).toContain('<div><span class="lead">$823</span>.30</div>');
    });

    it('should contain a table with the summary', function () {
        var tbody = el.find("#solution_summary tbody");
        var tr = tbody.find("tr");
        expect(tr.length).not.toBe(0);
        expect(tr.find("td").text()).toContain("Testing Product Name Chromebook 11");

    });
    
    it('should change location when calling chooseProduct function', function () {

    	var chooseProductLink = el.find("a[ng-click*='chooseProduct']");
        expect(chooseProductLink).not.toBe(null);
        chooseProductLink.click();
        expect(location.path()).toBe('/hmc-sub/CLOUD/Laptop');


    });

    it('should call scrollTo function of the controller', function () {

        var scrollTo = el.find("a[ng-click*='scrollTo']");
        expect(scrollTo).not.toBe(null);
        scrollTo.click();
        expect(location.path()).toBe('');

    });


    it('should add products to cart', inject(function ($window) {
        var addToCart = el.find("#cartButton");
        expect(addToCart).not.toBe(null);
        addToCart.click();
        httpBackend.flush();
        expect($window.parent.location).toBe('http://h71016.www7.hp.com/dcart/cart.asp');


    }));

    it('should add products to cart, error response', inject(function ($window) {
        success = false;
        var addToCart = el.find("#cartButton");
        expect(addToCart).not.toBe(null);
        addToCart.click();
        httpBackend.flush();
        expect($window.parent.location).toBe('');


    }));

    it('should call addToCart more than 12', function () {
        var addToCart = el.find("#cartButton");
        for(var i=0; i < 15; i++){
            fakeProducts.push({ _id : i, quantity : 1});
        }
        expect(addToCart).not.toBe(null);
        addToCart.click();


    });

    it('should call scroll to with timeout = 0 milliseconds, when url has anchor.', function () {

    	 location.url('/cloud-stack#Laptop');
       
          scope.$digest();
    	 expect(location.hash()).toBe("Laptop");
    	 timeout.flush();
       

    });

});