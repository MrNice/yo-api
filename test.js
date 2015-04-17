var nock = require('nock');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var yoapi = require('./index');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('yo-api', function() {
  describe('Default behavior', function() {
    it('should curry if passed a string as the first argument', function () {});
  });
  describe('sendYo', function() {});
  describe('getSubscribers', function() {
    beforeEach(function() {
      nock('https://dev.justyo.co')
        .get('/subscribers_count/?api_token=asdfghjkl')
        .reply('200', { count: 5 });
    });

    it('should resolve to the response body', function() {
      expect(yoapi.subs('asdfghjkl')).to.eventually.have.property('count');
    });
    xit('should accept a callback', function(done) {
      yoapi.subs('asdfghjkl', function(err, data) {
        expect(data).to.eql({ count: 5 });
        done();
      });
    });
    it('should throw if passed anything other than a string', function() {
      expect(function() { yoapi.subs(1) }).to.throw(Error);
      expect(function() { yoapi.subs([]) }).to.throw(Error);
      expect(function() { yoapi.subs({}) }).to.throw(Error);
      expect(function() { yoapi.subs(null) }).to.throw(Error);
      expect(function() { yoapi.subs(undefined) }).to.throw(Error);
    });
  });
});
