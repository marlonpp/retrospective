'use strict';

describe('avProduct', function () {

    var el;
    var parent_el;
    var scope;
    var fixture, service, location, httpBackend;

    beforeEach(module("advisor"));
    beforeEach(module("views/advisor/directives/av-product.html"));

    beforeEach(inject(function ($compile, $rootScope, $httpBackend, $location, productService) {
        fixture = mock.productFixture;
        scope = $rootScope;

        scope.product = fixture.laptop1;
        service = productService;
        location = $location;
        httpBackend = $httpBackend;

        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});

        parent_el = angular.element('<div></div>');
        el = angular.element('<div av-product model="product" type="CLOUD" hasquestions="true"></div>');
        parent_el.append(el);

        $compile(el)(scope);
        scope.$digest();

        $.prototype.slideUp = function () {
            this.hide();
        };

        $.prototype.slideDown = function () {
            this.show();
        };

    }));

    it('should bind the product model to the template', function () {
        expect(el.text()).toContain('Testing Product Name');
    });

    it('should use product unit price', function () {
        expect(el.find('#unitCost').text()).toBe("$82.33");
    });

    it('should change each product total cost when changing product quantity', function () {
        el.find('#quantityText').val('10');
        el.find('#quantityText').trigger('change');

        expect(el.find('#quantityText').val()).toBe('10');
        expect(el.find('#totalCost').text()).toBe('$823.30');
    });
    
    it('should remove element when clicking in the remove button', function () {

        var link = el.find('#removeProduct');

        httpBackend.expectGET('/products/by-category').respond(fixture.categoryList);
        service.getShoppingCartByStack(Stack.CLOUD).then(function(){
            expect(service.getProductsForCart(Stack.CLOUD).length).toBe(1);
        });

        setTimeout(function(link){
            httpBackend.flush();
            link.click();
            expect(service.getProductsForCart(Stack.CLOUD).length).toBe(0);
        }(link),1);

    });

    it('should call function choose when clicking in the choose different link', function () {
        el.find('#chooseDifferentProduct').click();
        expect(location.path()).toBe('/hmc-sub/CLOUD/Laptop/F1J74UT');

    });

    it('should start with the details container hidden', function () {
        var viewDetailsContainer = el.find('#viewDetailsContainer');

        expect(viewDetailsContainer.attr('style')).toContain('display: none;');
    });

    it('should open the view details container when clicking in View Details link', function () {
        el.find('#viewDetailsLink').click();

        var viewDetailsContainer = el.find('#viewDetailsContainer');

        expect(viewDetailsContainer.attr('style')).toContain('display: block;');
    });

    it('should close the view details container when clicking in View Details link for the second time', function () {

        var viewDetailsLink = el.find('#viewDetailsLink').click();

        viewDetailsLink.click();

        var viewDetailsContainer = el.find('#viewDetailsContainer');

        viewDetailsContainer.show();
        expect(viewDetailsContainer.attr('style')).toContain('display: block;');

        viewDetailsLink.click();

        expect(viewDetailsContainer.attr('style')).toContain('display: none;');
    });

    it('should default the image container to the first one on the image array', function () {

        var activeImage = el.find('#activeDetailImage');

        expect(activeImage.attr('src')).toBe('http://www.shopping.hp.com/is-bin/INTERSHOP.static/WFS/HP-HHO-Site/-/HP-HHO/en_US/violators/quickship/513x385/c03961016_quickship_513.png');
    });

    it('should change the active image on hovering over the thumbnail image', function () {

        var secondImage = $(el.find('.product-thumbnails')[1]);

        secondImage.trigger('mouseenter');

        var activeImage = el.find('#activeDetailImage');
        expect(activeImage.attr('src')).toBe('http://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c03962020.png');
    });

    it('should not show thumbnail for product with details with just one image', function () {

        var imageThumbnailContainer = el.find('#imageThumbnailContainer');
        expect(imageThumbnailContainer.attr('class')).not.toContain("ng-hide");

        scope.product = fixture.laptopWithOneImage;
        scope.$apply();

        expect(imageThumbnailContainer.attr('class')).toContain("ng-hide");
    });

    it('should work for product and skus without any specs', function () {

        scope.product = fixture.laptopWithNoProdAndSkuSpecs;
        scope.$apply();

        var specsDetailsContainer = el.find('#specDetailsSection');
        expect(specsDetailsContainer.find('tbody').children().length).toBe(0);
    });

});