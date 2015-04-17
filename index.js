var _ = require('lodash');
var R = require('ramda');

var promise   = require('bluebird');
var request   = require('superagent');
var validator = require('validator');

var baseURL      = 'https://api.justyo.co';
var yoEndpoint   = '/yo/';
var allEndpoint  = '/yoall/';
var subsEndpoint = '/subscribers_count/';

// TODO (mrnice): Update to accept linkOrLocation, location is [ lat, long ]
function yoapi(apiKey, username, link, callback) {
  var args = Array.prototype.slice.call(arguments).length;

  if (R.eq(args, 0)) throw new Error('YoAPI requires at least an API key');
  // TODO: Validate API key structure to throw early
  if (!_.isString(apiKey)) throw new Error('YoAPI requires API key as a string');
  if (R.eq(args, 1)) return R.partial(yoapi, apiKey);

  return sendYo(apiKey, username, link, callback);
}

// These functions assume arguments are valid
function sendYo(apiKey, username, link, callback) {
  var sendAll = R.eq(username, 'all');
  var endpoint = baseURL + (sendAll ? allEndpoint : yoEndpoint);

  if (_.isFunction(link)) {
    callback = link;
    link = undefined;
  } else if (_.isString(link)) {
    if (!validator.isURL(link)) throw new Error('YoAPI link must be a valid URL');
  }

  var r = request
            .post(endpoint)
            .send('api_token=' + apiKey);

  if (!sendAll) r.send('username=' + username);
  if (link) r.send('link=' + link);

  if (_.isFunction(callback)) {
    return r.end(function(err, res) {
      if (err) return callback(err);
      callback(null, res.body);
    });
  } else {
    return new Promise(function(resolve, reject) {
      r.end(function(err, res) {
        if (err) reject(err);
        resolve(res.body);
      });
    });
  }
}

// TODO: Refactor or get rid of callback support
function getSubscribers(apiKey, callback) {
  if (!_.isString(apiKey)) throw new Error('getSubscribers requires a string apiKey');

  var r = request.get(baseURL + subsEndpoint + '?api_token=' + apiKey);

  if (_.isFunction(callback)) {
    return r.end(function(err, res) {
        if (err) return callback(err);
        callback(null, res.body);
      });
  } else {
    return new Promise(function(resolve, reject) {
      r.end(function(err, res) {
        if (err) reject(err);
        resolve(res.body);
      });
    })
    .catch(function(err) { throw err }); // TODO: Fix this error handling
  }
}

yoapi.subs = getSubscribers;
yoapi._sendYo = sendYo;

module.exports = yoapi;
