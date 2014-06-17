'use strict';

describe('directives', function () {

    beforeEach(module("advisor"));

    it('should load the cost filter correctly', inject(function (costFilter) {
        expect(costFilter).not.toBe(null);
        expect(costFilter).not.toBe(undefined);
    }));

    it('should load the unit cost filter correctly', inject(function (unitCostFilter) {
        expect(unitCostFilter).not.toBe(null);
        expect(unitCostFilter).not.toBe(undefined);
    }));


    it('should return empty string when sending invalid input to cost filter', inject(function (costFilter) {
        expect(costFilter(null)).toBe('');
        expect(costFilter(undefined)).toBe('');
    }));

    it('should return empty string when sending invalid input to unit cost filter', inject(function (unitCostFilter) {
        expect(unitCostFilter(null)).toBe('');
        expect(unitCostFilter(undefined)).toBe('');
    }));


    it('should return valid html when sending valid cost object to cost filter', inject(function (costFilter) {
        expect(costFilter({
            "period": "/month",
            "currency": "$",
            "price": 82.33
        })).toBe('<div><span class="lead">$82</span>.33</div>');
    }));


    it('should load the cost filter correctly', inject(function (unitCostFilter) {
        expect(unitCostFilter).not.toBe(null);
        expect(unitCostFilter).not.toBe(undefined);
    }));

    it('should return empty string when sending invalid input to cost filter', inject(function (unitCostFilter) {
        expect(unitCostFilter(null)).toBe('');
        expect(unitCostFilter(undefined)).toBe('');
    }));

    it('should return valid html when sending valid unitCost object to filter', inject(function (unitCostFilter) {
        expect(unitCostFilter({
            "period": "month",
            "currency": "$",
            "unitCost": 82.33
        })).toBe('<span class="lead">$82</span>.33');
    }));

    it('should load the cost filter correctly', inject(function (startFromFilter) {
        expect(startFromFilter).not.toBe(null);
        expect(startFromFilter).not.toBe(undefined);
    }));

    it('should return sliced array', inject(function (startFromFilter) {
        expect(startFromFilter([1,2,3,4,5], 3).length).toBe(2);
    }));

    it('should return undefined if send undefined', inject(function (startFromFilter) {
        expect(startFromFilter(undefined, 3)).toBe(undefined);
    }));
});