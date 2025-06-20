// @ts-nocheck
import host from '../../src/host';

describe('Host', function () {
	it('returns the iframe attributes', function () {
		let data = {
				addon_key: 'some-addon-key',
				key: 'some-module-key',
				url: 'http://www.example.com',
			},
			created = host.create(data);

		expect(created.id).toBeDefined();
		expect(created.src).toEqual(data.url);
		expect(created.name).toBeDefined();
	});

	it('returns the extension id', function () {
		let addon_key = 'abc123',
			key = 'module435';
		expect(host._createId({ addon_key, key })).toContain(addon_key + '__' + key);
	});

	it('contains a dispatch method', function () {
		expect(host.dispatch).toBeDefined();
	});

	it('contains a broadcast method', function () {
		expect(host.broadcast).toBeDefined();
	});

	it('contains a getExtensions method', function () {
		expect(host.getExtensions).toBeDefined();
	});

	it('contains a returnsPromise method', function () {
		expect(host.returnsPromise).toBeDefined();
	});

	describe('returnsPromise', function () {
		it('should return the wrapped method with returnsPromise', function () {
			const method = () => {};
			expect(method.returnsPromise).toBeUndefined();
			host.returnsPromise(method);
			expect(method.returnsPromise).toBe(true);
		});
	});
});
