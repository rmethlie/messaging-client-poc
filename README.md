# \<trm3-element\>



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Install bower stuff
```
$ bower install
```

## Install npm stuff
```
$ npm install
```

## Start polymer dev server (with proxy to beta)
```
$ polymer serve --proxy-path /nhttp-bind/ --proxy-target https://collab.reutest.com/nhttp-bind/
```

## View in browser
[localhost:8081/](http://localhost:8081)

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
