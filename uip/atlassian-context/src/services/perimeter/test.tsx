import { isFedrampModerate, isIsolatedCloud, isolatedCloudDomain } from './index';

const mockDocument = { cookie: '' } as Document;
globalThis.document = mockDocument;

describe('Perimeter Detection', () => {
	afterEach(() => {
		global.document.cookie = 'atl-ctx=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	});

	describe('Cookie-based perimeter detection', () => {
		it('returns FedRAMP Moderate from atl-ctx cookie', () => {
			globalThis.document.cookie = `atl-ctx={"perimeter":"fedramp-moderate", "ic_domain":null}`;

			expect(isFedrampModerate()).toBe(true);
			expect(isIsolatedCloud()).toBe(false);
		});

		it('returns not FedRAMP Moderate if cookie is missing', () => {
			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
		});

		it('returns not FedRAMP Moderate if cookie parsing fails', () => {
			globalThis.document.cookie = 'atl-ctx=invalid-json';

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
		});

		it('returns Isolated Cloud from atl-ctx cookie', () => {
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"commercial", "ic_domain":"simcity.atlassian-isolated.net"}';

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(true);
		});

		it('returns not Isolated Cloud if cookie is missing', () => {
			globalThis.document.cookie = 'other-cookie={"k":"v""}';

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
			global.document.cookie = 'other-cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		});

		it('returns not Isolated Cloud if cookie parsing fails', () => {
			globalThis.document.cookie = 'atl-ctx=invalid-json';

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
		});
	});

	describe('Get isolatedCloudDomain', () => {
		it('returns domain for isolated cloud environments', () => {
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"commercial", "ic_domain":"simcity.atlassian-isolated.net"}';
			expect(isolatedCloudDomain()).toBe('simcity.atlassian-isolated.net');
		});

		it('returns undefined for non-isolated cloud environments', () => {
			globalThis.document.cookie = `atl-ctx={"perimeter":"fedramp-moderate", "ic_domain":null"}`;
			expect(isolatedCloudDomain()).toBeUndefined();
		});

		it('returns undefined when cookie is missing', () => {
			expect(isolatedCloudDomain()).toBeUndefined();
		});

		it('returns undefined when cookie parsing fails', () => {
			globalThis.document.cookie = 'atl-ctx=invalid-json';
			expect(isolatedCloudDomain()).toBeUndefined();
		});
	});
});
