import { isTrustedOrigin, isSafeHttpsUrl } from '../../src/ui/GiveKudosLauncher/main';

describe('isTrustedOrigin', () => {
	it('returns true when the event origin matches the base URL origin', () => {
		expect(isTrustedOrigin('https://team.atlassian.com', 'https://team.atlassian.com')).toBe(true);
	});

	it('returns true when the base URL has a path but origin still matches', () => {
		expect(
			isTrustedOrigin('https://team.atlassian.com/give-kudos', 'https://team.atlassian.com'),
		).toBe(true);
	});

	it('returns false when the origins differ by subdomain', () => {
		expect(isTrustedOrigin('https://team.atlassian.com', 'https://other.atlassian.com')).toBe(
			false,
		);
	});

	it('returns false when the origins differ by scheme', () => {
		expect(isTrustedOrigin('https://team.atlassian.com', 'http://team.atlassian.com')).toBe(false);
	});

	it('returns false when the origins differ by port', () => {
		expect(isTrustedOrigin('https://team.atlassian.com:8080', 'https://team.atlassian.com')).toBe(
			false,
		);
	});

	it('returns false when the origins differ by host entirely', () => {
		expect(isTrustedOrigin('https://team.atlassian.com', 'https://evil.com')).toBe(false);
	});

	it('returns false when baseUrl is an invalid URL', () => {
		expect(isTrustedOrigin('not-a-valid-url', 'https://team.atlassian.com')).toBe(false);
	});

	it('returns false when baseUrl is an empty string', () => {
		expect(isTrustedOrigin('', 'https://team.atlassian.com')).toBe(false);
	});
});

describe('isSafeHttpsUrl', () => {
	it('returns true for a valid https URL', () => {
		expect(isSafeHttpsUrl('https://team.atlassian.com')).toBe(true);
	});

	it('returns true for a valid https URL with a path and query string', () => {
		expect(isSafeHttpsUrl('https://team.atlassian.com/some/path?query=1')).toBe(true);
	});

	it('returns false for an http URL', () => {
		expect(isSafeHttpsUrl('http://team.atlassian.com')).toBe(false);
	});

	it('returns false for a javascript: URL', () => {
		expect(isSafeHttpsUrl('javascript:alert(1)')).toBe(false);
	});

	it('returns false for a data: URL', () => {
		expect(isSafeHttpsUrl('data:text/html,<h1>hi</h1>')).toBe(false);
	});

	it('returns false when url is undefined', () => {
		expect(isSafeHttpsUrl(undefined)).toBe(false);
	});

	it('returns false when url is an empty string', () => {
		expect(isSafeHttpsUrl('')).toBe(false);
	});
});
