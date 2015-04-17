var nock = require('nock');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var yoapi = require('./index');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('yo-api', function() {
  describe('Default behavior', function() {
    it('should partially apply if passed a string as the first argument', function () {
      expect(yoapi('asdfghjkl')).to.be.a('function');
    });
    it('should throw if passed anything other than a string first', function() {
      expect(function() { yoapi(1)         }).to.throw(Error);
      expect(function() { yoapi([])        }).to.throw(Error);
      expect(function() { yoapi({})        }).to.throw(Error);
      expect(function() { yoapi(null)      }).to.throw(Error);
      expect(function() { yoapi(undefined) }).to.throw(Error);
    });
  });
  describe('sendYo', function() {
    beforeEach(function() {
      nock('https://api.justyo.co')
        .post('/yo/', {
          'api_token': 'asdfghjkl',
          'username': 'aulekin'
        })
        .reply(200, {
          'success': true, // lol, this is what 200 is for...
          'yo_id': '553159ba9e43a200273eb64b'
        });
    });
    it('should send a yo to the username', function() {
      expect(yoapi._sendYo('asdfghjkl', 'aulekin')).to.eventually.eql({
        'success': true,
        'yo_id': '553159ba9e43a200273eb64b'
      });
    });
    // TODO: Figure out why nock behavior is different for this case
    it('should provide a callback api as well', function(done) {
      yoapi._sendYo('asdfghjkl', 'aulekin', function(err, body) {
        expect(err).to.be.null;
        expect(body).to.eql({
          'success': true,
          'yo_id': '553159ba9e43a200273eb64b'
        });

        done();
      });
    });
    it('should send a link if one is provided', function() {
      throw new Error('write this test');
    });
    it('should fail if link is not a URL', function() {
      throw new Error('write this test');
    });
  });
  describe('getSubscribers', function() {
    beforeEach(function() {
      nock('https://api.justyo.co')
        .get('/subscribers_count/?api_token=asdfghjkl')
        .reply('200', { count: 5 });
    });

    it('should resolve to the response body', function() {
      expect(yoapi.subs('asdfghjkl')).to.eventually.have.property('count');
    });

    it('should accept a callback', function(done) {
      yoapi.subs('asdfghjkl', function(err, data) {
        expect(data).to.eql({ count: 5 });
        done();
      });
    });
    it('should throw if passed anything other than a string', function() {
      expect(function() { yoapi.subs(1)         }).to.throw(Error);
      expect(function() { yoapi.subs([])        }).to.throw(Error);
      expect(function() { yoapi.subs({})        }).to.throw(Error);
      expect(function() { yoapi.subs(null)      }).to.throw(Error);
      expect(function() { yoapi.subs(undefined) }).to.throw(Error);
    });
  });
});
