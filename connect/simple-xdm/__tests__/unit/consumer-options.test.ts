// @ts-nocheck
import ConsumerOptions from '../../src/plugin/consumer-options';
var OPTIONS_DIV_ID = 'ac-iframe-options';
var SCRIPT_ID = 'ac-script';

describe('Consumer Options', function () {
	var div;

	beforeEach(function () {
		ConsumerOptions._flush();
		div = document.createElement('div');
		div.id = OPTIONS_DIV_ID;
		document.body.appendChild(div);
	});

	afterEach(function () {
		var script = document.getElementById(SCRIPT_ID);
		if (script) {
			document.body.removeChild(script);
		}
		document.body.removeChild(div);
	});

	it('get is empty by default', function () {
		expect(ConsumerOptions.get()).toEqual({});
	});

	it('gets target-options from a script tag', function () {
		var script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = '/atlassian-connect/all.js';
		script.setAttribute('data-options', 'x:y');
		document.body.appendChild(script);

		expect(ConsumerOptions.get('x')).toEqual('y');
	});

	it('gets target-options from a CDN script tag', function () {
		var script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = 'https://connect-cdn.atl-paas.net/all-.js';
		script.setAttribute('data-options', 'e:f');
		document.body.appendChild(script);
		expect(ConsumerOptions.get('e')).toEqual('f');
	});

	it('get returns all options if no key is supplied', function () {
		div.setAttribute('data-options', 'a:b;c:d');

		expect(ConsumerOptions.get()).toEqual({ a: 'b', c: 'd' });
	});

	it('get returns the value for a supplied key', function () {
		div.setAttribute('data-options', 'a:b;c:d');
		expect(ConsumerOptions.get('c')).toEqual('d');
	});

	it('get returns boolean values not strings', function () {
		div.setAttribute('data-options', 'a:true;b:false');
		expect(ConsumerOptions.get('a')).toEqual(true);
		expect(ConsumerOptions.get('b')).toEqual(false);
	});

	it('prioritises div with options over script without', function () {
		div.setAttribute('data-options', 'a:b;c:d');
		var script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = '/atlassian-connect/all.js';
		document.body.appendChild(script);
		expect(ConsumerOptions.get('a')).toEqual('b');
		expect(ConsumerOptions.get('c')).toEqual('d');
	});
});
