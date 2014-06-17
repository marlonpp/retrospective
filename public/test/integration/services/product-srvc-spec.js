'use strict';

xdescribe('productService', function () {
    var $httpBackend, fixture;

    beforeEach(module('advisor'));
    beforeEach(module('xc.indexedDB'));

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('browserService', mock.browserService);
        });
    });

    beforeEach(inject(function (_$httpBackend_) {
        fixture = mock.productFixture;
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
    }));

    it('should be able to save a single product to the indexed DB database', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        var done;
        runs(function () {
            productService.deleteAll().then(function () {
                productService.insert(fixture.laptop3).then(function () {
                    done = true;
                }).catch(function () {
                    //should never be here
                    expect(true).toBe(false);

                });
                return true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Saving data to IndexedDB', 3000);
    }));

    xit('should be able to save a multiple products to the indexed DB database', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        var done;
        runs(function () {
            productService.deleteAll().then(function () {
                productService.insert([fixture.laptop2, fixture.laptop3]).then(function () {
                    done = true;
                }).catch(function () {
                    //should never be here
                    expect(true).toBe(false);
                });
                return true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Saving data to IndexedDB', 5000);

    }));

   /* it('should be able to query database by product class from IndexedDB', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        var done;
        runs(function () {
            productService.deleteAll().then(function () {
                productService.insert([mock.productService.getProductById(fixture.laptop1._id), mock.productService.getProductById(fixture.tablet1._id), mock.productService.getProductById(fixture.laptop2._id), mock.productService.getProductById(fixture.laptop3._id)]).then(function () {
                    productService.getByProductClass('good').then(function (data) {
                        if (data) {
                            expect(data.length).toEqual(2);
                            expect(data[0]._id).toEqual(fixture.laptop1._id);
                            expect(data[1]._id).toEqual(fixture.tablet1._id);
                            done = true;
                        } else {
                            console.log('Failed to query item in indexed db');
                            //should never be here
                            expect(true).toBe(false);
                        }
                    });
                }).catch(function () {
                    //should never be here
                    expect(true).toBe(false);
                });
            });
        });

        waitsFor(function () {
            return done;
        }, 'Saving and querying data to IndexedDB', 3000);

    }));*/

    xit('should be able to get a product by id from IndexedDB', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        var done;
        runs(function () {
            productService.deleteAll().then(function () {
                productService.insert(fixture.laptop2).then(function () {
                    productService.getById(fixture.laptop2._id).then(function (data) {
                        if (data) {
                            expect(data._id).toBe(fixture.laptop2._id);
                            done = true;

                        } else {
                            console.log('Failed to query item in indexed db');
                            //should never be here
                            expect(true).toBe(false);
                        }
                    });
                }).catch(function () {
                    //should never be here
                    expect(true).toBe(false);
                });
            });
        });

        waitsFor(function () {
            return done;
        }, 'Saving and querying data to IndexedDB', 3000);

    }));

    xit('should be able to get all products from IndexedDB', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        var done = [fixture.tablet1._id, fixture.laptop2._id, fixture.laptop3._id];

        runs(function () {
            productService.deleteAll().then(function () {
                productService.insert([fixture.tablet1, fixture.laptop2, fixture.laptop3]).then(function () {
                    productService.getAll().then(function (data) {
                        if (data) {
                            expect(data.length).toBe(3);
                            done = true;
                        } else {
                            console.log('Failed to query item in indexed db');
                            //should never be here
                            expect(true).toBe(false);
                        }
                    });
                }).catch(function () {
                    //should never be here
                    expect(true).toBe(false);
                });
            });
        });

        waitsFor(function () {
            return done;
        }, 'Saving and querying data to IndexedDB', 3000);

    }));


    xit('should be able to get a product by query from IndexedDB', inject(function (productService) {
        mock.browserService.isIndexedDBSupported.andReturn(true);
        var done;
        runs(function () {
            productService.deleteAll().then(function () {
                productService.insert(fixture.laptop2).then(function () {
                    productService.query("productId_idx", fixture.laptop2._id).then(function (data) {
                        if (data) {
                            expect(data[0]._id).toBe(fixture.laptop2._id);
                            done = true;

                        } else {
                            console.log('Failed to query item in indexed db');
                            //should never be here
                            expect(true).toBe(false);
                        }
                    });
                }).catch(function () {
                    //should never be here
                    expect(true).toBe(false);
                });
            });
        });

        waitsFor(function () {
            return done;
        }, 'Saving and querying data to IndexedDB', 3000);

    }));

});
