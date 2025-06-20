# simple-xdm

A simple library that allows to expose host API to an embedded iframe through the `postMessage` protocol.

This has been migrated from [simple-xdm](https://bitbucket.org/atlassian/simple-xdm/src/master/).


## Goals

* No changes necessary in the iframe library when the host API changes.
* No DOM modifications (plays well with [React.js](https://facebook.github.io/react/)).
* Works with different module loaders using [UMD](https://github.com/umdjs/umd/blob/master/returnExports.js):
 AMD, Common.js and globals.
* Supports modern browsers (ES5+, i.e. IE10 and upwards, Chrome and Firefox)

## Usage

### Build

    npm install
    gulp

This command generates the two minified libs for the host and the iframe:

* dist/host.min.js
* dist/iframe.min.js

### Code Coverage

We use [Istanbul](http://gotwarlost.github.io/istanbul/) for code coverage statistics.

To run tests and generate coverage results:

    COVERAGE=true gulp karma-ci

Then point your browser at:

    file:///<path to simple-xdm>/coverage/index.html

### Define your API

Include `/dist/host.min.js` or `import host from 'simple-xdm/host';` on the host side. See `/example/product/product.html` for an example.
Then you can use `host.defineModule` to define your API (see `/example/product/product.js`):

    host.defineModule('messages', {
        error: function(title, body, options) {
            // your code
        },
        info: function(title, body, options) {
            // your code
        },
        success: function(title, body, options) {
            // your code
        },
        warning: function(title, body, options) {
            // your code
        },
    });

Code in the iframe can call this API using:

    AP.require('messages', function(messages) {
        messages.error('Error', message)
    });

You can also define globals:

    host.defineGlobals({
       request: function(options, cb) {
           setTimeout(function() {
               cb({statusCode: 200, response: options});
           }, 10);
       }
    });

Code in the iframe can call this API using:

    AP.request({ ... }, function(result) {
        // do something
    });

### Use the API in the iframe

Include `/dist/iframe.min.js` or `import AP from 'simple-xdm/plugin';` on the iframe side. See `/example/addon/add-on.html` for an example.

Use the API either through globals or modules:

    AP.require('messages', function(messages) {
        messages.error('Error', message)
    });

    AP.request({ ... }, function(result) {
        // do something
    });

### Create an iframe

The library does not modify the DOM directly, iframe creation is delegated to the host product.
Here's how you create an iframe that will be able to call the host API through the `simple-xdm` bridge:

    function setup(extension) {

        var iframeParams = AP.create(extension, init);

        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', iframeParams.id);
        iframe.setAttribute('name', iframeParams.name);
        iframe.setAttribute('src', iframeParams.src);
        iframe.setAttribute('frameBorder', 0);
        document.getElementById(extension.key).appendChild(iframe);
        return true;
    }

    function init(extensionId) {
        console.log('Bridge established:' + extensionId);
    }

    setup({
        addon_key: 'my-addon',
        key: 'my-panel',
        url: 'http://localhost:8080/addon/add-on.html'
    });

### Events

iframes can also handle events dispatched by the host. A callback can optionally be used to return a result.

Event registration in the iframe:

    AP.register({
        'some-event': function (event, cb) {
            cb('Some response');
        },
        'some-other-event': function(event) {
            // do something
        }
    });

The host side can send events to a specific add-on using

    host.dispatch('some-event',
        {addon_key: extension.addon_key},
        {message: message},
        function (result) {
            // do something
        }
    );

Or it can target a specific module:

    host.dispatch('some-event',
        {addon_key: extension.addon_key, key: extension.key},
        {message: message},
        function (result) {
            // do something
        }
    );

Events can also be broadcast to all add-ons on the page:

    host.dispatch('some-other-event', {}, {message: message});

iframes can also dispatch events to other iframes from the same plugin. This can be achieved using the broadcast method:

    AP.broadcast('some-event', {})   

All other iframes from this plugin will then receive an event identical to events dispatched from the host container, with the event name provided. Broadcast events are not durable and will only be delivered to active iframes.

### Seamless Iframes (AKA: auto resizing)

If you wish to have iframes without scrollbars. You can enable auto resizing. This will add new dom elements inside the iframe to detect when the width / height of the iframe content has changed, publish an event to the host page and resize the iframe DOM element.

    host.create({
        addon_key: 'my-addon',
        key: 'my-module',
        url: 'https://example.com/my-module',
        options: { autoresize: true }
    });


### Conventions

* Callbacks must be the last argument in the function declaration
* Callbacks must be the only function in the argument list
* Callbacks are optional
* All function parameters besides the callback must be serializable through the [Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm)

## Try it

In the project directory:

```
http-server
```

Then point your browser to [http://localhost:8080/example/product/product.html](http://localhost:8080/example/product/product.html)

To test the actual cross-domain case, you can serve the local project through ngrok:

```
ngrok -log=stdout 8080
```

Then point your browser to your ngrok URL: [http://<your-id>.ngrok.com/example/product/product.html](http://42782db2.ngrok.com/example/product/product.html)

### Prerequisites

Install the HTTP server:

    npm install -g http-server

[Install ngrok](https://ngrok.com/download)

### Sub-Extensions

You may require extensions to host other extensions.

1. Use the combined.js located in ./dist.
2. Your sub-extensions should use subCreate instead of create

### Sub-Extensions modules
By default, modules can only be declared once and will send their messages to the frame that declares them. Modules declared in the top window are available to the sub-extension and can be used as expected.

Extensions can declare additional modules that are available for sub-extensions. By default they cannot overwrite existing modules.

For most use cases this will just work. However, there many be times when the same module is needed for both.

You can redeclare an existing module (as to target the parent frame) using extension options.

````
/* possible values
* parent    - targets only the parent frame (default).
* top       - targets the top frame (default for window.top declarations).
* both      - targets the parent but allows re-declaring.
**/

var options = {
    targets: {
        moduleName: {
            methodName: 'both'
        }
    }
};
window.combined.subCreate({options:options, ...});
````
