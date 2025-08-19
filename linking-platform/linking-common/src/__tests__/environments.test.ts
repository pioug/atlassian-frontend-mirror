import { getResolverUrl, getBaseUrl } from '../environments';

describe('getResolverUrl', () => {
	it('should return a dev environment when passed a dev key', () => {
		expect(getResolverUrl('dev')).toBe('https://api-private.dev.atlassian.com/object-resolver');
		expect(getResolverUrl('development')).toBe(
			'https://api-private.dev.atlassian.com/object-resolver',
		);
	});

	it('should return a stg environment when passed a stg key', () => {
		expect(getResolverUrl('stg')).toBe('https://pug.jira-dev.com/gateway/api/object-resolver');
		expect(getResolverUrl('staging')).toBe('https://pug.jira-dev.com/gateway/api/object-resolver');
	});

	it('should return a prod environment when passed a prod key', () => {
		expect(getResolverUrl('prd')).toBe('https://api-private.atlassian.com/object-resolver');
		expect(getResolverUrl('prod')).toBe('https://api-private.atlassian.com/object-resolver');
		expect(getResolverUrl('production')).toBe('https://api-private.atlassian.com/object-resolver');
	});

	it('should return a the edge proxy url when no environment is passed', () => {
		expect(getResolverUrl()).toBe('/gateway/api/object-resolver');
	});

	it('should use custom baseUrl when provided', () => {
		expect(getResolverUrl('prod', 'https://trellis.coffee/gateway/api')).toBe(
			'https://trellis.coffee/gateway/api/object-resolver',
		);
	});

	it('should return the same baseUrlOverride for custom environment', () => {
		expect(getResolverUrl('custom', 'https://trellis.coffee/custom/api')).toBe(
			'https://trellis.coffee/custom/api',
		);
	});

	it('should return the fallback URL for custom environment if baseUrlOverride is not set', () => {
		expect(getResolverUrl('custom', undefined)).toBe('/gateway/api/object-resolver');
	});
});

describe('getBaseUrl', () => {
	it('should return the same baseUrlOverride for custom environment', () => {
		expect(getBaseUrl('custom', 'https://trellis.coffee/custom/api')).toBe(
			'https://trellis.coffee/custom/api',
		);
	});

	it('should return the fallback prod URL for custom environment if baseUrlOverride is not set', () => {
		expect(getBaseUrl('custom', undefined)).toBe('https://api-private.atlassian.com');
	});
});
