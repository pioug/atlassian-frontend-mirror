import { isGoogleCloudPlatform } from './index';

describe('isGoogleCloudPlatform', () => {
	afterEach(() => {
		// Clear the cloud service provider cookie
		globalThis.document.cookie =
			'Bifrost-Atl-Ctx-Cloud-Service-Provider=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		// @ts-ignore
		delete globalThis.ssrContext;
	});

	describe('SSR (document is undefined)', () => {
		let originalDocument: Document;

		beforeEach(() => {
			originalDocument = globalThis.document;
			// @ts-ignore
			delete globalThis.document;
		});

		afterEach(() => {
			globalThis.document = originalDocument;
		});

		it('returns true when ssrContext.isInGCP is true', () => {
			// @ts-ignore
			globalThis.ssrContext = { isInGCP: true };
			expect(isGoogleCloudPlatform()).toBe(true);
		});

		it('returns false when ssrContext.isInGCP is false', () => {
			// @ts-ignore
			globalThis.ssrContext = { isInGCP: false };
			expect(isGoogleCloudPlatform()).toBe(false);
		});

		it('returns false when ssrContext is not set', () => {
			expect(isGoogleCloudPlatform()).toBe(false);
		});
	});

	it('returns true when Bifrost-Atl-Ctx-Cloud-Service-Provider cookie is GCP', () => {
		globalThis.document.cookie = 'Bifrost-Atl-Ctx-Cloud-Service-Provider=GCP';
		expect(isGoogleCloudPlatform()).toBe(true);
	});

	it('returns false when Bifrost-Atl-Ctx-Cloud-Service-Provider cookie is AWS', () => {
		globalThis.document.cookie = 'Bifrost-Atl-Ctx-Cloud-Service-Provider=AWS';
		expect(isGoogleCloudPlatform()).toBe(false);
	});

	it('returns false when Bifrost-Atl-Ctx-Cloud-Service-Provider cookie is not set', () => {
		expect(isGoogleCloudPlatform()).toBe(false);
	});

	it('returns false when Bifrost-Atl-Ctx-Cloud-Service-Provider cookie has an unknown value', () => {
		globalThis.document.cookie = 'Bifrost-Atl-Ctx-Cloud-Service-Provider=UNKNOWN';
		expect(isGoogleCloudPlatform()).toBe(false);
	});
});
