var _ = require('lodash');
var R = require('ramda');

var req       = require('superagent');
var request   = require('superagent-promise');
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

  if (_.isFunction(link)) {
    callback = link;
    link = undefined;
  } else if (_.isString(link)) {
    if (!validator.isURL(link)) throw new Error('YoAPI link must be a valid URL');
  }

  return sendYo(apiKey, username, link, callback);
}

// These functions assume arguments are valid
function sendYo(apiKey, username, link, callback) {
  var endpoint = baseURL + (R.eq(username, 'all') ? yoEndpoint : allEndpoint);

  var r = request
            .post(endpoint)
            .send('api_token=' + apiKey);

  if (!R.eq('all', username)) r.send('username=' + username);
  if (link) r.send('link=' + link);

  if (_.isFunction(callback)) {
    return r.end(callback);
  }
  // TODO (mrnice): Fix promise swallower
  return r.end().catch(function(err) { console.log(err) });
}

function getSubscribers(apiKey, callback) {
  if (!_.isString(apiKey)) throw new Error('getSubscribers requires a string apiKey');

  var r = request
            .get(baseURL + subsEndpoint + '?api_token=' + apiKey)
            .end();

  if (_.isFunction(callback)) {
    throw new Error('callback support not implemented yet');
  } else {
    r.catch(function(err) { throw err });
  }

  return r;
}

yoapi.subs = getSubscribers;
yoapi._sendYo = sendYo;

module.exports = yoapi;
