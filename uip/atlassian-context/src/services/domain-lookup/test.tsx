import { COMMERCIAL } from '../../common/constants';
import { type DomainConfig, type DomainKey } from '../../common/types';

import {
	_getEnvironmentFromDomain,
	configure,
	getATLContextDomain,
	getATLContextUrl,
} from './index';

const ATL_CONTEXT_DOMAIN: DomainConfig = {
	admin: 'admin.atlassian.com',
	atlaskit: 'atl-global.atlassian.com',
	auth: 'auth.atlassian.com',
} as DomainConfig;

describe('getATLContextDomain()', () => {
	beforeEach(() => {
		// @ts-expect-error
		delete globalThis.ATL_CONTEXT_DOMAIN;
		// @ts-expect-error
		delete globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY;
	});

	it('returns domain', () => {
		globalThis.ATL_CONTEXT_DOMAIN = ATL_CONTEXT_DOMAIN;
		expect(getATLContextDomain('admin')).toBe('admin.atlassian.com');
	});

	it('returns domain based on passed environment if available ( staging )', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = COMMERCIAL;
		expect(getATLContextDomain('id', ['stg', 'commercial'])).toBe('id.stg.internal.atlassian.com');
	});

	it('returns domain based on passed environment if available ( dev )', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = COMMERCIAL;
		expect(getATLContextDomain('id', ['dev', 'commercial'])).toBe('id.dev.internal.atlassian.com');
	});

	it('returns domain from hardcoded list if ATL_CONTEXT_DOMAIN is not set', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = COMMERCIAL;
		expect(getATLContextDomain('admin')).toBe('admin.atlassian.com');
	});

	it('returns domain from hardcoded list if ATL_CONTEXT_DOMAIN is not set', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = COMMERCIAL;
		expect(getATLContextDomain('admin', ['stg', 'commercial'])).toBe('admin.stg.atlassian.com');
	});

	it('returns predefined fedramp prod environment', () => {
		expect(getATLContextDomain('start', ['prod', 'fedramp-moderate'])).toBe(
			'start.atlassian-us-gov-mod.com',
		);
	});
	it('returns predefined fedramp staging environment', () => {
		expect(getATLContextDomain('start', ['stg', 'fedramp-moderate'])).toBe(
			'start.stg.atlassian-us-gov-mod.com',
		);
	});
	it('returns predefined fedramp prod environment for id domain key', () => {
		expect(getATLContextDomain('id', ['prod', 'fedramp-moderate'])).toBe(
			'id.atlassian-us-gov-mod.com',
		);
	});
	it('returns predefined fedramp staging environment for id domain key', () => {
		expect(getATLContextDomain('id', ['stg', 'fedramp-moderate'])).toBe(
			'id.stg.atlassian-us-gov-mod.com',
		);
	});
	it('returns fallback consumer prod environment for full-domain override sites with no staging mapping for fedramp fedex perimeter', () => {
		expect(getATLContextDomain('id', ['prod', 'fedramp-fedex'])).toBe('id.atlassian.com');
	});
	it('returns fallback consumer staging environment for full-domain override sites with no staging mapping for fedramp fedex perimeter', () => {
		expect(getATLContextDomain('id', ['stg', 'fedramp-fedex'])).toBe('id.atlassian.com');
	});
	it('returns generated fallback for non full-domain override site in commercial prod perimeter', () => {
		expect(getATLContextDomain('team', ['prod', 'commercial'])).toBe('team.atlassian.com');
	});
	it('returns generated fallback for non full-domain override sites in fedramp-moderate prod perimeter', () => {
		expect(getATLContextDomain('team', ['prod', 'fedramp-moderate'])).toBe(
			'team.atlassian-us-gov-mod.com',
		);
	});
	it('returns generated fallback for non full-domain override sites in fedramp-fedex prod perimeter', () => {
		expect(getATLContextDomain('team', ['prod', 'fedramp-fedex'])).toBe('team.atlassian.com');
	});
	it('returns generated fallback for non full-domain override site in commercial staging perimeter', () => {
		expect(getATLContextDomain('team', ['stg', 'commercial'])).toBe('team.stg.atlassian.com');
	});
	it('returns generated fallback for non full-domain override sites in fedramp-moderate staging perimeter', () => {
		expect(getATLContextDomain('team', ['stg', 'fedramp-moderate'])).toBe(
			'team.stg.atlassian-us-gov-mod.com',
		);
	});
	it('returns generated fallback for non full-domain override sites in fedramp-fedex staging perimeter', () => {
		expect(getATLContextDomain('team', ['stg', 'fedramp-fedex'])).toBe('team.atlassian-fex.com');
	});

	it('throws as domain does not exist', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = COMMERCIAL;
		expect(() => getATLContextUrl('not-supported domain' as DomainKey)).toThrow();
	});
});

describe('getATLContextUrl()', () => {
	it('returns url', () => {
		globalThis.ATL_CONTEXT_DOMAIN = ATL_CONTEXT_DOMAIN;
		expect(getATLContextUrl('admin')).toBe('http://admin.atlassian.com');
	});

	it('returns url if ATL_CONTEXT_DOMAIN is not set', () => {
		globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY = COMMERCIAL;
		expect(getATLContextUrl('admin')).toBe('http://admin.atlassian.com');
	});
});

describe('configure()', () => {
	it('throws if there is no data', () => {
		expect(() => configure({} as DomainConfig)).toThrow();
	});

	it('takes the data, and stores it for later use', () => {
		configure(ATL_CONTEXT_DOMAIN);

		expect(globalThis.ATL_CONTEXT_DOMAIN).toBe(ATL_CONTEXT_DOMAIN);
	});
});

describe('_getEnvironmentFromDomain', () => {
	const expected = [
		['atlassian-fex.com', 'stg', 'fedramp-fedex'],
		['stg.atlassian-us-gov-mod.com', 'stg', 'fedramp-moderate'],
		['stg.atlassian-us-gov-mod.net', 'stg', 'fedramp-moderate'],
		['atlassian-us-gov-mod.com', 'prod', 'fedramp-moderate'],
		['atlassian-us-gov-mod.net', 'prod', 'fedramp-moderate'],
		['stg.atlassian.com', 'stg', 'commercial'],
		['forge.jira-dev.com', 'stg', 'commercial'],
		['atlassian.com', 'prod', 'commercial'],
		['jira-dev.com', 'stg', 'commercial'],
		['atlassian-stg-fedm.net', 'stg', 'fedramp-moderate'],
	];
	test.each(expected)('given %s, should return %s and %s', (hostname, env, perimeter) => {
		// @ts-ignore Mock window.location in Jest
		delete globalThis.location;
		// @ts-ignore Mock window.location in Jest
		globalThis.location = {
			hostname,
		};
		expect(_getEnvironmentFromDomain()).toEqual([env, perimeter]);
		// @ts-ignore Mock window.location in Jest
		delete globalThis.location;
	});
});
