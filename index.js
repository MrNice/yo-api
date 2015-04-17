var _ = require('lodash');
var R = require('ramda');

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
  if (R.eq(args, 1)) return R.partial(yoapi, apiKey);

  if (_.isFunction(link)) {
    callback = link;
    link = undefined;
  } else if (_.isString(link)) {
    if (!validator.isURL(link)) throw new Error('YoAPI link must be a valid URL');
  }

  // nodeify "just works", does nothing if callback is not function
  return sendYo(apiKey, username, link)
           .nodeify(callback);
}

// These functions assume arguments are valid
function sendYo(apiKey, username, link) {
  var endpoint = baseURL + (R.eq(username, 'all') ? yoEndpoint : allEndpoint);
 
  var r = request
            .post(endpoint)
            .send('api_token=' + apiKey);

  if (!R.eq('all', username)) r.send('username=' + username);
  if (link) r.send('link=' + link);
 
  return r.end();
}

function getSubscribers(apiKey, callback) {
  return request
           .post(baseURL + subsEndpoint)
           .send('api_token=' + apiKey)
           .end()
           .nodeify(callback);
}

yoapi.subs = getSubscribers;
yoapi._sendYo = sendYo;

module.exports = yoapi;
