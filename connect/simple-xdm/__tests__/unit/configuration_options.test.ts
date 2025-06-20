// @ts-nocheck
import ConfigurationOptions from '../../src/plugin/configuration-options';

describe('Configuration Options', function () {
	beforeEach(function () {
		ConfigurationOptions._flush();
	});

	it('get is empty by default', function () {
		expect(ConfigurationOptions.get()).toEqual({});
	});

	it('get returns the set option', function () {
		ConfigurationOptions.set('a', 'b');
		expect(ConfigurationOptions.get('a')).toEqual('b');
	});

	it('get returns the set option by object', function () {
		ConfigurationOptions.set({ x: 'y' });
		expect(ConfigurationOptions.get('x')).toEqual('y');
	});

	it('get returns everything by default', function () {
		var toSet = { x: 'y' };
		ConfigurationOptions.set(toSet);
		expect(ConfigurationOptions.get()).toEqual(toSet);
	});

	it('adds new properties if set is called multiple times', function () {
		ConfigurationOptions.set('a', 'b');
		ConfigurationOptions.set('c', 'd');
		expect(ConfigurationOptions.get()).toEqual({ a: 'b', c: 'd' });
	});
});
