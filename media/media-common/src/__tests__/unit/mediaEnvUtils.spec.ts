import { isGCPtenant } from '../../utils/mediaEnvUtils';

describe('isGCPtenant', () => {
	describe('with explicit hostname argument', () => {
		it('should return true for a valid GCP tenant hostname', () => {
			expect(isGCPtenant('my-site-cdp-abc123.jira-dev.com')).toBe(true);
		});

		it('should return true for a GCP tenant hostname with numeric cdp id', () => {
			expect(isGCPtenant('another-tenant-cdp-xyz789.jira-dev.com')).toBe(true);
		});

		it('should return false for a non-GCP Atlassian hostname', () => {
			expect(isGCPtenant('mysite.atlassian.net')).toBe(false);
		});

		it('should return false for a staging media hostname', () => {
			expect(isGCPtenant('media.staging.atl-paas.net')).toBe(false);
		});

		it('should return false for a production media API hostname', () => {
			expect(isGCPtenant('api.media.atlassian.com')).toBe(false);
		});

		it('should return false for a hostname that partially matches but lacks the cdp segment', () => {
			expect(isGCPtenant('mysite.jira-dev.com')).toBe(false);
		});

		it('should return false for a hostname with cdp in the wrong position', () => {
			expect(isGCPtenant('cdp-abc123.jira-dev.com')).toBe(false);
		});

		it('should return false when hostname is an empty string', () => {
			expect(isGCPtenant('')).toBe(false);
		});
	});

	describe('without hostname argument (uses globalThis.location)', () => {
		const originalLocation = globalThis.location;

		afterEach(() => {
			// Restore original location
			Object.defineProperty(globalThis, 'location', {
				value: originalLocation,
				writable: true,
				configurable: true,
			});
		});

		it('should return false when globalThis.location is undefined (SSR)', () => {
			Object.defineProperty(globalThis, 'location', {
				value: undefined,
				writable: true,
				configurable: true,
			});
			expect(isGCPtenant()).toBe(false);
		});

		it('should return true when globalThis.location.hostname matches GCP pattern', () => {
			Object.defineProperty(globalThis, 'location', {
				value: { hostname: 'my-site-cdp-abc123.jira-dev.com' },
				writable: true,
				configurable: true,
			});
			expect(isGCPtenant()).toBe(true);
		});

		it('should return false when globalThis.location.hostname is a regular Atlassian host', () => {
			Object.defineProperty(globalThis, 'location', {
				value: { hostname: 'mycompany.atlassian.net' },
				writable: true,
				configurable: true,
			});
			expect(isGCPtenant()).toBe(false);
		});
	});
});
