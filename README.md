# Yet another Yo api wrapper
This one has been done in a pseudo-functional style. Returns promise objects unless you give a callback function.

## Installation
Standard npm installation:
```bash
$ npm install --save yo-api
```

## Usage
yo-api has a do-what-I-mean style API in the vein of jsdom.

yoapi('api_key', 'username'[, link, callback])

```bash
var yoapi = require('yo-api');

yoapi('api_key', 'aulekin', 'https://google.com');

// Send a link
yoapi('api_key', 'aulekin', 'https://google.com');

// Get your subscriber count
yoapi.subs('api_key');

// yoapi arity 1 returns curried version. Functional constructor pattern.
var yo = yoapi('api_key');

yo('aulekin');
yo('all');
yo('aulekin', 'https://google.com');
```

Please note that the following does not work
```bash
yo.subs() // undefined is not a function
```

## License
Creative Commons Attribution 4.0 International
MIT

## Acknowledgements
Superagent is awesome
Bluebird is awesomer
Ramda is definitely my favorite though.