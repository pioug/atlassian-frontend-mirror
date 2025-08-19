import {
	isFedrampModerate,
	isIsolatedCloud,
	isolatedCloudDomain,
	isolationContextId,
} from './index';

describe('Perimeter Methods for Browser', () => {
	afterEach(() => {
		// Clear cookies
		globalThis.document.cookie = 'Atl-Ctx-Perimeter=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		globalThis.document.cookie =
			'Atl-Ctx-Isolation-Context-Domain=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		globalThis.document.cookie =
			'Atl-Ctx-Isolation-Context-Id=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	});

	describe('Returns correct isFedrampModerate() value', () => {
		it('returns FedRAMP Moderate from Atl-Ctx-Perimeter cookie', () => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=fedramp-moderate';
			expect(isFedrampModerate()).toBe(true);
			expect(isIsolatedCloud()).toBe(false);
		});

		it('returns not FedRAMP Moderate if cookie is missing', () => {
			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
		});
	});

	describe('Returns correct isIsolatedCloud() value', () => {
		it('returns Isolated Cloud from cookies', () => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=commercial';
			globalThis.document.cookie =
				'Atl-Ctx-Isolation-Context-Domain=simcity.atlassian-isolated.net';

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(true);
		});

		it('returns not Isolated Cloud if cookies are missing', () => {
			globalThis.document.cookie = 'other-cookie=value';

			expect(isFedrampModerate()).toBe(false);
			expect(isIsolatedCloud()).toBe(false);
			globalThis.document.cookie = 'other-cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // clear other cookie
		});
	});

	describe('Returns correct isolatedCloudDomain() value', () => {
		it('returns domain for isolated cloud environments', () => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=commercial';
			globalThis.document.cookie =
				'Atl-Ctx-Isolation-Context-Domain=simcity.atlassian-isolated.net';
			expect(isolatedCloudDomain()).toBe('simcity.atlassian-isolated.net');
		});

		it('returns undefined for non-isolated cloud environments (fedramp)', () => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=fedramp-moderate';
			expect(isolatedCloudDomain()).toBeUndefined();
		});

		it('returns undefined for non-isolated cloud environments (commercial)', () => {
			expect(isolatedCloudDomain()).toBeUndefined();
		});
	});

	describe('Returns correct isolationContextId() value', () => {
		it('returns id for isolated cloud environments', () => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=commercial';
			globalThis.document.cookie = 'Atl-Ctx-Isolation-Context-Id=ic-123';

			expect(isolationContextId()).toBe('ic-123');
		});

		it('returns undefined for non-isolated cloud environments (fedramp)', () => {
			globalThis.document.cookie = 'Atl-Ctx-Perimeter=fedramp-moderate';
			expect(isolationContextId()).toBeUndefined();
		});

		it('returns undefined for non-isolated cloud environments (commercial)', () => {
			expect(isolationContextId()).toBeUndefined();
		});
	});
});
