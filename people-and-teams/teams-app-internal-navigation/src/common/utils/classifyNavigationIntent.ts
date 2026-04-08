import type { NavigationIntent } from './getNavigationProps';
import { isFedramp, isIsolatedCloud } from './utils';

export interface classifyNavigationIntentInput {
	href: string;
	isPreviewPanelEnabled?: boolean;
}

// List of domains that are considered Atlassian domains - taken from https://support.atlassian.com/organization-administration/docs/ip-addresses-and-domains-for-atlassian-cloud-products/
const ATLASSIAN_DOMAINS = [
	'localhost',
	'127.0.0.1',
	'atlassian.com',
	'atlassian.net',
	'atl-paas.net',
	'ss-inf.net',
	'jira.com',
	'bitbucket.org',
	'trello.com',
	'atlassian-dev.net',
	'atlassian-us-gov-mod.com',
	'atlassian-us-gov-mod.net',
	'atlassian-us-gov.com',
	'atlassian-us-gov.net',
	'atlassian-fex.com',
	'atlassian-fex.net',
	'atlassian-stg-fedm.com',
	'atlassian-stg-fedm.net',
	'atlassian-isolated.net',
];

/** Extra roots for staging links */
const STAGING_SUFFIXES = [
	'staging.atlassian.io',
	'atl-test.space',
	'jira-dev.com',
	'stg-jira.com',
	'staging.paas-inf.net',
];

function matchesDomainList(hostname: string, domains: readonly string[]): boolean {
	const lower = hostname.toLowerCase();
	return domains.some((domain) => lower === domain || lower.endsWith('.' + domain));
}

function isAtlassianDomain(hostname: string): boolean {
	const lower = hostname.toLowerCase();
	return (
		matchesDomainList(hostname, ATLASSIAN_DOMAINS) ||
		matchesDomainList(hostname, STAGING_SUFFIXES) ||
		isFedramp(lower) ||
		isIsolatedCloud(lower)
	);
}

const REFERENCE_DOMAINS = [
	'support.atlassian.com',
	'developer.atlassian.com',
	'community.atlassian.com',
];

function isReferenceDomain(hostname: string): boolean {
	return matchesDomainList(hostname, REFERENCE_DOMAINS);
}

/**
 * Auto-classifies a URL into a {@link NavigationIntent}.
 *
 * Only runs when the consumer has not provided an explicit intent (i.e. intent is `unknown` or omitted).
 */
export function classifyNavigationIntent(href: string): NavigationIntent {
	const IS_ABSOLUTE_LINK_REGEX = /^(?:(http|https):\/\/)/;
	const IS_NON_HTTP_BASED = /^(((mailto|tel|sms|blob):)|(#))/;

	const isAbsolute = IS_ABSOLUTE_LINK_REGEX.test(href);
	const isNonHttpBased = IS_NON_HTTP_BASED.test(href);

	const isRelative = !isAbsolute && !isNonHttpBased;

	if (isRelative) {
		return 'navigation';
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(href);
	} catch {
		return 'unknown';
	}

	if (!isAtlassianDomain(parsedUrl.hostname)) {
		return 'external';
	}

	if (isReferenceDomain(parsedUrl.hostname)) {
		return 'reference';
	}

	if (isAtlassianDomain(parsedUrl.hostname)) {
		return 'navigation';
	}

	return 'unknown';
}
