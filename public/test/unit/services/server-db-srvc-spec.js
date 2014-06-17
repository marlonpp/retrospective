/*'use strict';

 describe('serverDBService', function () {
 var mockServerDBService, $httpBackend;
 beforeEach(module('advisor'));

 beforeEach(inject(function ($injector) {
 $httpBackend = $injector.get('$httpBackend');
 mockServerDBService = $injector.get('serverDBService');
 $httpBackend.expectGET('/languages/advisor/en_US.json').respond({});
 })
 );

 it('should return a user based on id', inject(function (serverDBService) {
 $httpBackend.expectGET('/product/123').respond({
 id: '123',
 class: 'best'
 });

 var result = mockServerDBService.getProduct(123);
 $httpBackend.flush();
 console.log('hello world ' + result.class);
 result.then(function(data) {
 console.log('********here');
 expect(data).toBe(null);
 }, function(err) {
 console.log('*********not here');
 expect(true).toBe(false);
 }).catch(function(err){
 console.log('*******error');
 var a = err;
 }).finally(function(abc) {
 console.log('******bad')
 var a = abc;
 });
 }));

 it('should return a userdasd based on id', inject(function (serverDBService) {
 $httpBackend.expectGET('/product?class=best').respond([{
 id: '123',
 class: 'best'
 }]);

 var result = mockServerDBService.queryProduct({class:'best'});
 $httpBackend.flush();
 console.log('hello world ' + result.class);
 result.then(function(data) {
 console.log('********here');
 expect(data).toBe(null);
 }, function(err) {
 console.log('*********not here');
 expect(true).toBe(false);
 }).catch(function(err){
 console.log('*******error');
 var a = err;
 }).finally(function(abc) {
 console.log('******bad')
 var a = abc;
 });
 }));


 });
 */