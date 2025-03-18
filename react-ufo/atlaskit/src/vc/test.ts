import { VCObserverNOOP } from './no-op-vc-observer';
import { VCObserver } from './vc-observer';

import { getVCObserver } from './index';

describe('getVCObserver', () => {
	it('is a singleton', () => {
		const vcObserver = getVCObserver();
		const anotherVCObserver = getVCObserver();
		const manuallyInstantiatedVCObserver = new VCObserver({});
		// leveraging triple equal check for objects, i.e. by comparing memory references
		expect(vcObserver === anotherVCObserver).toBe(true);
		expect(vcObserver !== manuallyInstantiatedVCObserver).toBe(true);
	});
});

describe('isEnvironmentSupported', () => {
	const originalGlobal = {
		WeakRef: globalThis.WeakRef,
		MutationObserver: globalThis.MutationObserver,
		IntersectionObserver: globalThis.IntersectionObserver,
		PerformanceObserver: globalThis.PerformanceObserver,
		__SERVER__: (globalThis as any).__SERVER__,
	};
	const originalEnv = process.env;

	beforeEach(() => {
		// Reset global object before each test
		globalThis.WeakRef = jest.fn();
		globalThis.MutationObserver = jest.fn();
		globalThis.IntersectionObserver = jest.fn();
		(globalThis as any).PerformanceObserver = jest.fn();
		(globalThis as any).__SERVER__ = undefined;
		process.env.REACT_SSR = undefined;
	});

	afterAll(() => {
		// Restore original values after all tests
		globalThis.WeakRef = originalGlobal.WeakRef;
		globalThis.MutationObserver = originalGlobal.MutationObserver;
		globalThis.IntersectionObserver = originalGlobal.IntersectionObserver;
		globalThis.PerformanceObserver = originalGlobal.PerformanceObserver;
		(globalThis as any).__SERVER__ = originalGlobal.__SERVER__;
		process.env = originalEnv;
	});

	it('should return false when in ReactSSR environment', () => {
		jest.isolateModules(() => {
			process.env.REACT_SSR = 'true';
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(false);
		});
	});

	it('should return false when in Server environment', () => {
		jest.isolateModules(() => {
			(globalThis as any).__SERVER__ = true;
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(false);
		});
	});

	it('should return false when WeakRef is not supported', () => {
		jest.isolateModules(() => {
			(globalThis as any).WeakRef = undefined;
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(false);
		});
	});

	it('should return false when MutationObserver is not supported', () => {
		jest.isolateModules(() => {
			(globalThis as any).MutationObserver = undefined;
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(false);
		});
	});

	it('should return false when IntersectionObserver is not supported', () => {
		jest.isolateModules(() => {
			(globalThis as any).IntersectionObserver = undefined;
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(false);
		});
	});

	it('should return false when PerformanceObserver is not supported', () => {
		jest.isolateModules(() => {
			(globalThis as any).PerformanceObserver = undefined;
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(false);
		});
	});

	it('should return true when all required features are supported', () => {
		jest.isolateModules(() => {
			const { isEnvironmentSupported } = require('./index');
			expect(isEnvironmentSupported()).toBe(true);
		});
	});
});

describe('getVCObserver', () => {
	beforeEach(() => {
		// Clear the singleton instance before each test
		delete (globalThis as any).__vcObserver;
	});

	afterEach(() => {
		// Clear the singleton instance before each test
		delete (globalThis as any).__vcObserver;
	});

	it('is a singleton', () => {
		const vcObserver = getVCObserver();
		const anotherVCObserver = getVCObserver();
		const manuallyInstantiatedVCObserver = new VCObserver({});

		expect(vcObserver === anotherVCObserver).toBe(true);
		expect(vcObserver !== manuallyInstantiatedVCObserver).toBe(true);
	});

	it('should return VCObserverNOOP when environment is not supported', () => {
		jest.isolateModules(() => {
			// Simulate unsupported environment
			(globalThis as any).__SERVER__ = true;
			const { VCObserverNOOP: VCObserverNOOPIsolated } = require('./no-op-vc-observer');
			const { getVCObserver: getVCObserverIsolated } = require('./index');

			const vcObserver = getVCObserverIsolated();
			expect(vcObserver).toBeInstanceOf(VCObserverNOOPIsolated);
		});
	});

	it('should return VCObserverWrapper when environment is supported', () => {
		const vcObserver = getVCObserver();
		expect(vcObserver).not.toBeInstanceOf(VCObserverNOOP);
	});

	it('should pass options to the observer', () => {
		const vcObserver = getVCObserver({});

		// You might need to add more specific assertions here depending on how you want to verify
		// that the options were properly passed through
		expect(vcObserver).not.toBeNull();
	});
});
