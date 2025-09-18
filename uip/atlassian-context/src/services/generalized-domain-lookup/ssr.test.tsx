/**
 * @jest-environment node
 */

import { DEV, PRODUCTION, STAGING } from '../../common/constants';

import { getDomainInContext, getUrlForDomainInContext } from './index';

describe('getDomainInContext', () => {
	beforeEach(() => {
		(globalThis as any).location = { protocol: '', hostname: '' };
		(globalThis as any).ssrContext = { isInFedramp: false, isInIC: false };
	});

	describe('Test correct domain resolution for Isolated Cloud perimeters', () => {
		beforeEach(() => {
			(globalThis as any).ssrContext.isInIC = true;
		});

		it('Returns reserved name domain when requested name is a reserved name', () => {
			(globalThis as any).location.hostname = 'apple.atlassian-isolated.net';
			expect(getDomainInContext('admin', PRODUCTION)).toBe('admin.apple.atlassian-isolated.net');
		});

		it('Returns atl domain when requested name has an atl subdomain', () => {
			(globalThis as any).location.hostname = 'apple.atlassian-isolated.net';
			expect(getDomainInContext('packages', PRODUCTION)).toBe(
				'packages.atl.apple.atlassian-isolated.net',
			);
		});

		it('Returns vanity domain when requested name is neither a reserved name nor has an atl subdomain', () => {
			(globalThis as any).location.hostname = 'apple.atlassian-isolated.net';
			expect(getDomainInContext('my-service', STAGING)).toBe(
				'my-service.services.apple.atlassian-isolated.net',
			);
		});
	});

	describe('Test correct domain resolution for Non-Isolated Cloud perimeters', () => {
		describe('FedRAMP Moderate', () => {
			beforeEach(() => {
				(globalThis as any).ssrContext.isInFedramp = true;
			});

			it('Returns correct override TLD when requested name has an exact override match for perimeter and environment', () => {
				expect(getDomainInContext('id', STAGING)).toBe('id.stg.atlassian-us-gov-mod.com');
			});

			it('Returns override TLD for Commercial Production global domain', () => {
				expect(getDomainInContext('design', PRODUCTION)).toBe('design.atlassian.com');
			});

			it('Returns correct TLD for staging and production domain patterns when requested name does not have an override', () => {
				expect(getDomainInContext('atlassian-experience', DEV)).toBe('');
				expect(getDomainInContext('atlassian-experience', STAGING)).toBe(
					'atlassian-experience.stg.atlassian-us-gov-mod.com',
				);
				expect(getDomainInContext('atlassian-experience', PRODUCTION)).toBe(
					'atlassian-experience.atlassian-us-gov-mod.com',
				);
			});
		});

		describe('Commercial', () => {
			it('Returns correct override TLD when requested name has an exact override match for perimeter and environment', () => {
				expect(getDomainInContext('id', STAGING)).toBe('id.stg.internal.atlassian.com');
			});

			it('Returns correct global domain for Commercial Production', () => {
				expect(getDomainInContext('surveys', STAGING)).toBe('surveys.atlassian.com');
			});

			it('Returns correct TLD for staging and production domain patterns when requested name does not have an override', () => {
				expect(getDomainInContext('atlassian-experience', DEV)).toBe(
					'atlassian-experience.dev.atlassian.com',
				);
				expect(getDomainInContext('atlassian-experience', STAGING)).toBe(
					'atlassian-experience.stg.atlassian.com',
				);
				expect(getDomainInContext('atlassian-experience', PRODUCTION)).toBe(
					'atlassian-experience.atlassian.com',
				);
			});
		});
	});
});

describe('Methods for SSR (non-browser): getUrlForDomainInContext', () => {
	beforeEach(() => {
		(globalThis as any).location = { protocol: '', hostname: '' };
		(globalThis as any).ssrContext = { isInFedramp: false, isInIC: false };
	});

	describe('Test URL generation for Isolated Cloud perimeters', () => {
		beforeEach(() => {
			(globalThis as any).ssrContext.isInIC = true;
		});

		it('Returns correct URL for reserved name in any environment', () => {
			(globalThis as any).location.protocol = 'https:';
			(globalThis as any).location.hostname = 'apple.atlassian-isolated.net';

			expect(getUrlForDomainInContext('id', DEV)).toBe('https://id.apple.atlassian-isolated.net');
			expect(getUrlForDomainInContext('id', PRODUCTION)).toBe(
				'https://id.apple.atlassian-isolated.net',
			);
			expect(getUrlForDomainInContext('id', STAGING)).toBe(
				'https://id.apple.atlassian-isolated.net',
			);
		});

		it('Returns correct URL for vanity domain', () => {
			(globalThis as any).location.protocol = 'https:';
			(globalThis as any).location.hostname = 'apple.atlassian-isolated.net';

			expect(getUrlForDomainInContext('my-service', PRODUCTION)).toBe(
				'https://my-service.services.apple.atlassian-isolated.net',
			);
		});

		it('Handles http protocol correctly', () => {
			(globalThis as any).location.protocol = 'http:';
			(globalThis as any).location.hostname = 'apple.atlassian-isolated.net';

			expect(getUrlForDomainInContext('admin', PRODUCTION)).toBe(
				'http://admin.apple.atlassian-isolated.net',
			);
		});
	});

	describe('Test URL generation for Non-Isolated Cloud perimeters', () => {
		it('Returns correct URL for non-override TLD in fedramp', () => {
			(globalThis as any).ssrContext.isInFedramp = true;
			(globalThis as any).location.protocol = 'https:';

			expect(getUrlForDomainInContext('newExperience', DEV)).toBe(undefined);
			expect(getUrlForDomainInContext('newExperience', STAGING)).toBe(
				'https://newExperience.stg.atlassian-us-gov-mod.com',
			);
			expect(getUrlForDomainInContext('newExperience', PRODUCTION)).toBe(
				'https://newExperience.atlassian-us-gov-mod.com',
			);
		});

		it('Returns correct URL for non-override TLD in commercial', () => {
			(globalThis as any).location.protocol = 'https:';

			expect(getUrlForDomainInContext('newExperience', DEV)).toBe(
				'https://newExperience.dev.atlassian.com',
			);
			expect(getUrlForDomainInContext('newExperience', STAGING)).toBe(
				'https://newExperience.stg.atlassian.com',
			);
			expect(getUrlForDomainInContext('newExperience', PRODUCTION)).toBe(
				'https://newExperience.atlassian.com',
			);
		});

		it('Returns correct URL for override TLD in fedramp', () => {
			(globalThis as any).ssrContext.isInFedramp = true;
			(globalThis as any).location.protocol = 'https:';

			expect(getUrlForDomainInContext('id', STAGING)).toBe(
				'https://id.stg.atlassian-us-gov-mod.com',
			);
			expect(getUrlForDomainInContext('id', PRODUCTION)).toBe(
				'https://id.atlassian-us-gov-mod.com',
			);
			expect(getUrlForDomainInContext('id', DEV)).toBe(undefined);
		});

		it('Returns correct URL for override TLD in commercial', () => {
			(globalThis as any).location.protocol = 'https:';

			expect(getUrlForDomainInContext('id', DEV)).toBe('https://id.dev.internal.atlassian.com');
			expect(getUrlForDomainInContext('id', STAGING)).toBe('https://id.stg.internal.atlassian.com');
			expect(getUrlForDomainInContext('id', PRODUCTION)).toBe('https://id.atlassian.com');
		});

		it('Returns correct URL for global domain in commercial', () => {
			(globalThis as any).ssrContext.isInFedramp = false;
			(globalThis as any).location.protocol = 'https:';

			expect(getUrlForDomainInContext('design', STAGING)).toBe('https://design.atlassian.com');
		});
	});
});
