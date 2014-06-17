'use strict';

describe('anchorSmoothScroll', function () {

    var service;

    var obj = {};

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('$document', [
                {
                    getElementById: function (id) {

                        if (id === "scrollToTopId") {
                            obj.offsetTop = 950;
                        } else if (id === "scrollDownId") {
                            obj.offsetTop = 3000;
                        } else if (id === "scrollUpId") {
                            obj.offsetTop = 90;
                        }

                        return obj;
                    },
                    documentElement: {
                    },
                    body: {
                    }
                }
            ]);

            $provide.value('$window', {});
        });
    });

    beforeEach(module("advisor"));

    beforeEach(inject(function (anchorSmoothScroll) {
        service = anchorSmoothScroll;
    }));

    it('should scroll down with default setting', function () {

        var scrollDownSpy = sinon.spy(service, "scrollDown");

        expect(scrollDownSpy.calledOnce).toBe(false);

        service.scrollTo('scrollDownId');

        expect(scrollDownSpy.calledOnce).toBe(true);
    });

    it('should scroll to top with distance less than a 100', inject(function ($document) {

        $document[0].documentElement.scrollTop = 1000;

        var scrollToTopSpy = sinon.spy(service, "scrollToTop");

        expect(scrollToTopSpy.calledOnce).toBe(false);

        service.scrollTo('scrollToTopId', 10);

        expect(scrollToTopSpy.calledOnce).toBe(true);
    }));

    it('should scroll down with distance bigger than a 100 and offsetTop bigger', inject(function ($document) {

        $document[0].documentElement.scrollTop = 1000;

        var scrollDownSpy = sinon.spy(service, "scrollDown");

        expect(scrollDownSpy.calledOnce).toBe(false);

        service.scrollTo('scrollDownId');

        expect(scrollDownSpy.calledOnce).toBe(true);
    }));

    it('should scroll up with distance bigger than a 100 and offsetTop smaller', inject(function ($document) {

        $document[0].documentElement.scrollTop = 1000;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);
    }));

    it('should support anchor with pageYOffset', inject(function ($window) {

        $window.pageYOffset = 1000;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);

    }));

    it('should support anchor with body.scrollTop', inject(function ($document) {

        $document[0].body.scrollTop = 1000;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);

    }));

    it('should support anchor with element having offsetParent', function () {

        obj.offsetParent = 1;

        var scrollUpSpy = sinon.spy(service, "scrollUp");

        expect(scrollUpSpy.calledOnce).toBe(false);

        service.scrollTo('scrollUpId');

        expect(scrollUpSpy.calledOnce).toBe(true);

    });
});