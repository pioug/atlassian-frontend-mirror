// @ts-nocheck

import Combined from '../../src/combined/combined';

describe('combined host and plugin js tests', () => {
	var origin = window.location.origin;
	if (!origin) {
		origin =
			window.location.protocol +
			'//' +
			window.location.hostname +
			(window.location.port ? ':' + window.location.port : '');
	}
	var instance;
	var pluginData = {
		origin: origin,
		hostOrigin: origin,
		api: {
			some: {},
			someModule: {
				somePromise: {
					returnsPromise: true,
				},
			},
		},
	};

	beforeEach(() => {
		window.name = JSON.stringify(pluginData);
		instance = new Combined(false);
	});

	describe('Plugin side:', () => {
		it('AP.register is present', function () {
			expect(instance.register).toEqual(expect.any(Function));
		});

		it('AP.registerAny is present', function () {
			expect(instance.registerAny).toEqual(expect.any(Function));
		});

		it('plugin modules are present', function () {
			expect(instance.some).toEqual(pluginData.api.some);
		});

		it('plugin promises are present', function () {
			expect(instance._hostModules.someModule.somePromise.returnsPromise).toBe(true);
		});
	});

	describe('host side:', () => {
		it('defineGlobal is present', function () {
			expect(instance.defineGlobal).toEqual(expect.any(Function));
		});

		it('defineModule is present', function () {
			expect(instance.defineModule).toEqual(expect.any(Function));
		});

		it('subCreate is present', function () {
			expect(instance.subCreate).toEqual(expect.any(Function));
		});
	});
});
