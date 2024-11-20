import type { UserSearchProductAttributes, UserSearchQuery } from '@atlaskit/smart-common';

export type UseUserRecommendationsProps = {
	/**
	 * Base url override for downstream APIs.
	 * Note: there is a trend for browsers blocking cookies for cross-site resources.
	 * This prop is added for legacy reasons and will likely be removed in the future.
	 * https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
	 */
	baseUrl?: string;
	/**
	 * Context information for analytics. Eg: if the hook was consumed inside a ticket's comment, the childObjectId would be
	 *  the ID of the comment and the ticket would be the objectId. Optional, but please provide if available.
	 */
	childObjectId?: string;
	/**
	 * The container Id to identify context. e.g. Jira: projectId. Confluence: spaceId. Bitbucket: repositoryId.
	 */
	containerId?: string;
	/**
	 * Time to debounce the suggestions fetching (in milliseconds). Defaults to 150ms.
	 */
	debounceTimeMs?: number;
	/**
	 * Identifier for informing the server on what experience the hook is powering.
	 * The server uses the fieldId to determine which model to utilize when
	 * generating suggestions.
	 * All fieldId's will be bucketed into a model that provides generic smart results,
	 * except "assignee", "mentions" which are specifically trained for Jira Assignee and
	 * @Mentions. For specifically trained models, please contact #search-plex.
	 */
	fieldId: string;
	/**
	 * Whether to include users in the result set  (@default: true).
	 */
	includeUsers?: boolean;
	/**
	 * Whether to include groups in the resultset (@default: false).
	 */
	includeGroups?: boolean;
	/**
	 * Whether to include teams in the resultset  (@default: false).
	 */
	includeTeams?: boolean;
	/**
	 *  (@default: 25)
	 */
	maxNumberOfResults?: number;
	/**
	 * An identifier of the closest context object, e.g. issueId, pageId, pullRequestId.
	 * Used for analytics. Optional, but please include if available.
	 */
	objectId?: string;
	/**
	 * Preload the list of suggested users with an empty-query ('') search as soon as
	 * the hook is used.
	 * WARNING: please consider carefully before deciding to preload your suggestions
	 * as this will increase the load on the recommendations services (has caused HOTs).
	 * Please give #search-plex a ballpark on the expected request volume.
	 * (@default: false)
	 */
	preload?: boolean;
	/**
	 * AAID of the user interacting with the component.
	 * If not provided, server will extract principalId from the context header, assuming that the user is logged in
	 * when making the request. (@default: “context”)
	 */
	principalId?: string;
	/**
	 * Product-specific Attributes - you should pass in the attribute type that matches your current SupportedProduct.
	 * Currently we support additional attributes (BitbucketAttributes) for bitbucket and (ConfluenceAttributes) for Confluence.
	 */
	productAttributes?: UserSearchProductAttributes;
	/**
	 * Product identifier. If you are an NPF, please ensure your product has been onboarded with
	 * Cross-product user-search @see https://developer.atlassian.com/cloud/cross-product-user-search/
	 * If you are still waiting for CPUS, you can use the `people` productKey in the interim.
	 */
	productKey: string;
	/**
	 * Pass-through for CPUS. Refer to @see https://developer.atlassian.com/cloud/cross-product-user-search/rest/api-group-search/#api-group-search
	 * for detailed docs on parameters.
	 */
	cpusSearchQuery?: UserSearchQuery;
	/**
	 * Identifier for the product's tenant, also known as siteId or cloudId.
	 * If product is not tenanted, the convention is to provide the productKey
	 * as the tenantId (e.g. "bitbucket") but this may vary across products.
	 * Check with #search-plex.
	 */
	tenantId: string;
};
