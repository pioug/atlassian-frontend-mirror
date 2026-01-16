import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	type DatasourceResolveResponse,
	type JsonLdDatasourceResponse,
} from '@atlaskit/link-client-extension';
import { type CardStore, type CardType } from '@atlaskit/linking-common';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { extractVisitUrl } from '../extractors/common/primitives/extractVisitUrl';
import { type DestinationProduct, type DestinationSubproduct } from '../utils/analytics/types';

export const getByDefinitionId = (definitionId: string | undefined, store: CardStore): string[] => {
	const urls = Object.keys(store);
	return urls.filter((url) => {
		const { details } = store[url];
		return details && details.meta.definitionId === definitionId;
	});
};

export const getClickUrl = (url: string, jsonLd?: JsonLd.Response): string => {
	if (jsonLd && jsonLd.data) {
		const visitUrl = extractVisitUrl(jsonLd.data as JsonLd.Data.BaseData);
		if (visitUrl) {
			return visitUrl;
		}
	}
	return url;
};

export const getDefinitionId = (details?: JsonLd.Response): string | undefined =>
	details?.meta?.definitionId;

export const getExtensionKey = (details?: JsonLd.Response): string | undefined =>
	details?.meta?.key;

export const getObjectAri = (details?: JsonLd.Response): string | undefined =>
	(details?.data && 'atlassian:ari' in details.data && details.data['atlassian:ari']) || undefined;

export const getThirdPartyARI = (details?: SmartLinkResponse): string | undefined => {
	if (fg('platform_smartlink_3pclick_analytics')) {
		if (
			details?.entityData &&
			'thirdPartyAri' in details.entityData &&
			details.entityData.thirdPartyAri
		) {
			return details.entityData.thirdPartyAri;
		}

		if (
			details?.data &&
			'atlassian:ari' in details.data &&
			typeof details.data['atlassian:ari'] === 'string'
		) {
			const ari = details.data['atlassian:ari'];
			if (ari.includes('ari:third-party')) {
				return ari;
			}
		}
	}
	return undefined;
};

export const getFirstPartyIdentifier = (): string | undefined => {
	if (!fg('platform_smartlink_3pclick_analytics')) {
		return undefined;
	}

	const product = getProductFromWindowURL();
	const currentURL = window.location.href;

	if (product === 'confluence') {
		if (currentURL.includes('content.id')) {
			const contentId = extractContentIdFromURL(currentURL);
			if (contentId) {
				return `ConfluenceContentId:${contentId}`;
			}
		}
		const pageId = extractPageIdFromURL(currentURL);
		if (pageId) {
			return `ConfluencePageId:${pageId}`;
		}
	} else if (product === 'jira') {
		const issueKey = extractJiraIssueIdFromURL(currentURL);
		if (issueKey) {
			return `JiraIssueKey:${issueKey}`;
		}
	}
	return undefined;
};

export const getObjectName = (details?: JsonLd.Response): string | undefined =>
	(details?.data && 'name' in details.data && details.data.name) || undefined;

export const getObjectIconUrl = (details?: JsonLd.Response): string | undefined => {
	if (details?.data && 'icon' in details.data && details.data.icon) {
		if (
			typeof details.data.icon === 'object' &&
			'url' in details.data.icon &&
			details.data.icon.url &&
			typeof details.data.icon.url === 'string'
		) {
			return details.data.icon.url;
		}
	}
	return undefined;
};

export const getResourceType = (details?: JsonLd.Response): string | undefined =>
	details?.meta?.resourceType;

export const getProduct = (details?: JsonLd.Response): DestinationProduct | string | undefined =>
	details?.meta?.product;

export const getSubproduct = (
	details?: JsonLd.Response,
): DestinationSubproduct | string | undefined => details?.meta?.subproduct;

export const getServices = (details?: JsonLd.Response) => (details && details.meta.auth) || [];

export const hasResolved = (details?: JsonLd.Response) =>
	details && isAccessible(details) && isVisible(details);

export const isAccessible = ({ meta: { access } }: JsonLd.Response): boolean => access === 'granted';

export const isVisible = ({ meta: { visibility } }: JsonLd.Response): boolean =>
	visibility === 'restricted' || visibility === 'public';

export const getStatusDetails = (details?: JsonLd.Response): string | undefined => {
	return details?.meta?.requestAccess?.accessType;
};

export const isFinalState = (status: CardType): boolean => {
	return ['unauthorized', 'forbidden', 'errored', 'resolved', 'not_found'].indexOf(status) > -1;
};

export const getDatasources = (
	details?: JsonLdDatasourceResponse,
): DatasourceResolveResponse[] | undefined => details?.datasources;

export const getCanBeDatasource = (details?: JsonLdDatasourceResponse): boolean => {
	const datasources = getDatasources(details);
	return !!datasources && datasources.length > 0;
};

export const hasAuthScopeOverrides = (details?: JsonLd.Response): boolean =>
	!!details?.meta.hasScopeOverrides;

// Helper function to extract page ID from standard Confluence page URLs
const extractPageIdFromURL = (url: string): string | undefined => {
	try {
		const urlObj = new URL(url);

		// Following this pattern for confluence URL -> /wiki/spaces/{space}/pages/{pageId}/{title}
		const pagesMatch = urlObj.pathname.match(/\/wiki\/spaces\/[^\/]+\/pages\/(\d+)(?:\/|$)/);
		if (pagesMatch && pagesMatch[1]) {
			return pagesMatch[1];
		}

		// Following this pattern for confluence URL -> /wiki/pages/viewpage.action?pageId={pageId}
		const pageIdParam = urlObj.searchParams.get('pageId');
		if (pageIdParam) {
			return pageIdParam;
		}

		// Following this pattern for confluence URL -> /wiki/display/{space}/{pageId}
		const displayMatch = urlObj.pathname.match(/\/wiki\/display\/[^\/]+\/(\d+)/);
		if (displayMatch && displayMatch[1]) {
			return displayMatch[1];
		}
	} catch {
		return undefined;
	}

	return undefined;
};

const extractContentIdFromURL = (url: string): string | undefined => {
	try {
		const urlObj = new URL(url);

		// Pattern: ?content.id={contentId} (for app connector URLs and plugin servlet URLs)
		const contentId = urlObj.searchParams.get('content.id');
		if (contentId) {
			return contentId;
		}

		// Also support URLs where content.id is in the query string but not parsed by URL (edge case)
		// e.g., /wiki/plugins/servlet/ac/com.atlassian.perspectiveretros/perspective-retros?content.id=5662725850
		const match = url.match(/[?&]content\.id=(\d+)/);
		if (match && match[1]) {
			return match[1];
		}
	} catch {
		return undefined;
	}

	return undefined;
};

const extractJiraIssueIdFromURL = (url: string): string | undefined => {
	try {
		const urlObj = new URL(url);

		// Support any case for Jira keys (e.g., AI3W-864, ai3w-864, Ai3W-864)
		const browseMatch = urlObj.pathname.match(/\/browse\/([A-Za-z0-9]+-\d+)/);
		if (browseMatch && browseMatch[1]) {
			return browseMatch[1];
		}

		// /jira/browse/{issueKey}
		const jiraBrowseMatch = urlObj.pathname.match(/\/jira\/browse\/([A-Za-z0-9]+-\d+)/);
		if (jiraBrowseMatch && jiraBrowseMatch[1]) {
			return jiraBrowseMatch[1];
		}

		// Query parameter ?selectedIssue={issueKey}
		const selectedIssue = urlObj.searchParams.get('selectedIssue');
		if (selectedIssue && /^[A-Za-z0-9]+-\d+$/.test(selectedIssue)) {
			return selectedIssue;
		}

		// Query parameter ?issueKey={issueKey}
		const issueKeyParam = urlObj.searchParams.get('issueKey');
		if (issueKeyParam && /^[A-Za-z0-9]+-\d+$/.test(issueKeyParam)) {
			return issueKeyParam;
		}
	} catch {
		return undefined;
	}

	return undefined;
};

const getProductFromWindowURL = (): string | undefined => {
	try {
		const currentUrl = window.location.href;
		const urlObj = new URL(currentUrl);
		const hostname = urlObj.hostname.toLowerCase();
		const pathname = urlObj.pathname.toLowerCase();

		// Check for Confluence patterns
		if (
			hostname.includes('confluence') ||
			pathname.includes('/wiki/') ||
			pathname.includes('/display/') ||
			pathname.includes('/spaces/')
		) {
			return 'confluence';
		}

		// Check for Jira patterns
		if (
			hostname.includes('jira') ||
			pathname.includes('/browse/') ||
			pathname.includes('/projects/') ||
			pathname.includes('/secure/')
		) {
			return 'jira';
		}
	} catch {
		return undefined;
	}

	return undefined;
};
