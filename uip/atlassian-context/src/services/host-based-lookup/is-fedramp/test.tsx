import { isFedRamp } from './index';

describe('isFedRamp', () => {
	beforeEach(() => {
		// @ts-expect-error
		delete globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY;
	});

	it('returns true', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = 'fedramp-moderate';
		expect(isFedRamp()).toBeTruthy();
	});

	it('returns false', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = 'commercial';
		expect(isFedRamp()).toBeFalsy();
	});

	it('check if a match exists if perimeter is unset', () => {
		jsdom.reconfigure({
			url: 'https://api-private.atlassian-fex.com',
		});

		expect(isFedRamp()).toBeTruthy();
	});

	describe('matching for fedramp domains', () => {
		jsdom.reconfigure({
			url: 'https://api-private.atlassian-us-gov-mod.com',
		});

		expect(isFedRamp()).toBeTruthy();
	});
});
