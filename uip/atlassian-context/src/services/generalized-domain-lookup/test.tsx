import { PRODUCTION, STAGING } from '../../common/constants';
import { isFedrampModerate } from '../perimeter';

import { getDomainInContext, getUrlForDomainInContext } from './index';

describe('getDomainInContext', () => {
	afterEach(() => {
		global.document.cookie = 'atl-ctx=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	});

	describe('Test correct domain resolution for Isolated Cloud perimeters', () => {
		beforeEach(() => {
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"commercial", "ic_domain":"apple.atlassian-isolated.net"}';
		});

		it('Returns reserved name domain when requested name is a reserved name', () => {
			expect(getDomainInContext('admin')).toBe('admin.apple.atlassian-isolated.net');
		});

		it('Returns atl domain when requested name has an atl subdomain', () => {
			expect(getDomainInContext('packages')).toBe('packages.atl.apple.atlassian-isolated.net');
		});

		it('Returns vanity domain when requested name is neither a reserved name nor has an atl subdomain', () => {
			expect(getDomainInContext('my-service')).toBe(
				'my-service.services.apple.atlassian-isolated.net',
			);
		});
	});

	describe('Test correct domain resolution for Non-Isolated Cloud perimeters', () => {
		describe('FedRAMP Moderate', () => {
			beforeEach(() => {
				globalThis.document.cookie = 'atl-ctx={"perimeter":"fedramp-moderate", "ic_domain":null}';
			});

			it('Returns correct override TLD when requested name has an exact override match for perimeter and environment', () => {
				expect(getDomainInContext('id', STAGING)).toBe('id.stg.atlassian-us-gov-mod.com');
			});

			it('Returns override TLD for Commercial Production fallback when there is no exact override match for perimeter and environment', () => {
				expect(getDomainInContext('design', PRODUCTION)).toBe('design.atlassian.com');
			});

			it('Returns correct TLD for staging and production domain patterns when requested name does not have an override', () => {
				expect(getDomainInContext('atlassian-experience', STAGING)).toBe(
					'atlassian-experience.stg.atlassian-us-gov-mod.com',
				);
				expect(getDomainInContext('atlassian-experience', PRODUCTION)).toBe(
					'atlassian-experience.atlassian-us-gov-mod.com',
				);
			});

			it('Returns correct TLD when environment is not provided', () => {
				jsdom.reconfigure({
					url: 'https://atlassian-experience.stg.atlassian-us-gov-mod.com',
				});

				globalThis.document.cookie = 'atl-ctx={"perimeter":"fedramp-moderate", "ic_domain":null}';
				expect(getDomainInContext('atlassian-experience')).toBe(
					'atlassian-experience.stg.atlassian-us-gov-mod.com',
				);
			});
		});

		describe('Commercial (atl-ctx cookie is undefined)', () => {
			it('Returns correct override TLD when requested name has an exact override match for perimeter and environment', () => {
				expect(getDomainInContext('id', STAGING)).toBe('id.stg.internal.atlassian.com');
			});

			it('Returns override TLD for Commercial Production fallback when there is no exact override match for perimeter and environment', () => {
				expect(getDomainInContext('integrations', STAGING)).toBe('integrations.atlassian.com');
			});

			it('Returns correct TLD for staging and production domain patterns when requested name does not have an override', () => {
				expect(getDomainInContext('atlassian-experience', STAGING)).toBe(
					'atlassian-experience.stg.atlassian.com',
				);
				expect(getDomainInContext('atlassian-experience', PRODUCTION)).toBe(
					'atlassian-experience.atlassian.com',
				);
			});
		});
	});

	describe('Handle Edge cases', () => {
		it('Returns undefined when perimeter is unexpected', () => {
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"unregistered-new-perimeter", "ic_domain":"some.domain"}';
			expect(getDomainInContext('id', STAGING)).toBeUndefined();
		});
	});
});

describe('getUrlForDomainInContext', () => {
	afterEach(() => {
		global.document.cookie = 'atl-ctx=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	});

	describe('Test URL generation for Isolated Cloud perimeters', () => {
		it('Returns correct URL for reserved name domain', () => {
			jsdom.reconfigure({
				url: 'https://admin.apple.atlassian-isolated.net',
			});
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"commercial", "ic_domain":"apple.atlassian-isolated.net"}';
			expect(getUrlForDomainInContext('admin', PRODUCTION)).toBe(
				'https://admin.apple.atlassian-isolated.net',
			);
		});

		it('Returns correct URL for vanity domain', () => {
			jsdom.reconfigure({
				url: 'https://my-service.services.apple.atlassian-isolated.net',
			});
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"commercial", "ic_domain":"apple.atlassian-isolated.net"}';
			expect(getUrlForDomainInContext('my-service', PRODUCTION)).toBe(
				'https://my-service.services.apple.atlassian-isolated.net',
			);
		});

		it('Handles http protocol correctly', () => {
			jsdom.reconfigure({
				url: 'http://admin.apple.atlassian-isolated.net',
			});
			globalThis.document.cookie =
				'atl-ctx={"perimeter":"commercial", "ic_domain":"apple.atlassian-isolated.net"}';
			expect(getUrlForDomainInContext('admin', PRODUCTION)).toBe(
				'http://admin.apple.atlassian-isolated.net',
			);
		});
	});

	describe('Test URL generation for Non-Isolated Cloud perimeters', () => {
		it('Returns correct URL for override TLD', () => {
			jsdom.reconfigure({
				url: 'https://id.stg.atlassian-us-gov-mod.com',
			});
			globalThis.document.cookie = 'atl-ctx={"perimeter":"fedramp-moderate", "ic_domain":null}';
			expect(isFedrampModerate()).toBe(true);
			expect(getUrlForDomainInContext('id', STAGING)).toBe(
				'https://id.stg.atlassian-us-gov-mod.com',
			);
		});

		it('Returns correct URL for commercial production fallback', () => {
			jsdom.reconfigure({
				url: 'https://design.atlassian.com',
			});
			expect(getUrlForDomainInContext('design', STAGING)).toBe('https://design.atlassian.com');
		});
	});

	describe('Test error handling', () => {
		it('Returns undefined when domain cannot be determined', () => {
			// Set an invalid IC domain to force undefined return
			globalThis.document.cookie = 'atl-ctx={"perimeter":"invalid-perimeter", "ic_domain":null}';
			expect(getUrlForDomainInContext('invalid-domain', PRODUCTION)).toBeUndefined();
		});
	});
});
