// @ts-nocheck
import AP from '../../src/plugin/ap';

describe('Plugin', function () {
	const moduleName = 'someModule';
	const className = 'SomeClass';
	const methodName = 'SomeMethod';
	const window_name = window.name;
	let instance;

	// window.location.origin is not defined in IE10.
	function getOrigin() {
		return (
			window.location.origin ||
			window.location.protocol +
				'//' +
				window.location.hostname +
				(window.location.port ? ':' + window.location.port : '')
		);
	}

	beforeEach(function () {
		const api = {};
		let module = {};
		module[methodName] = {};
		module[className] = {
			constructor: {},
		};
		api[moduleName] = module;
		window.name = JSON.stringify({
			origin: getOrigin(),
			hostOrigin: getOrigin(),
			api: api,
		});
		instance = new AP({ autoresize: false }, false);
	});

	afterEach(function () {
		window.name = window_name;
	});

	it('_checkOrigin checks for a valid origin', function () {
		let e = {
			origin: getOrigin(),
			source: window.parent,
		};

		expect(instance._checkOrigin(e)).toBe(true);
	});

	it('_checkOrigin errors on invalid origin', function () {
		let e = {
			origin: 'http://www.example.com',
			source: window.parent,
		};

		expect(instance._checkOrigin(e)).toBe(false);
	});

	it('_checkOrigin errors on invalid host', function () {
		let e = {
			origin: getOrigin(),
			// this was relying on karma running in an iframe
			// which it doesn't when debugging, this will also be
			// a false assumption when porting the test to jest.
			// for the sake of unit testing _checkOrigin, we can
			// set the source something other than window
			source: {},
		};

		expect(instance._checkOrigin(e)).toBe(false);
	});

	it('creates proxy classes for remote objects', function () {
		let Cls = instance[moduleName][className];
		let inst = Cls();
		expect(typeof Cls).toBe('function');
		expect(inst instanceof Cls).toBeTruthy();
	});

	describe('_createMethodHandler', () => {
		it('should return a promise if method is marked with returnsPromise', () => {
			const testMethod = jest.fn();
			testMethod.returnsPromise = true;

			window.name = JSON.stringify({
				origin: getOrigin(),
				hostOrigin: getOrigin(),
				api: {
					promiseModules: {
						testMethod: {
							returnsPromise: true,
						},
					},
				},
			});
			const testAP = new AP({ autoresize: false }, false);
			expect(testAP.promiseModules.testMethod).toBeDefined();

			// if no callback provided then return a promise
			expect(testAP.promiseModules.testMethod() instanceof Promise).toBeTruthy();
			// otherwise, do not return anything
			expect(testAP.promiseModules.testMethod(() => {})).toBeUndefined();
		});
	});
});
