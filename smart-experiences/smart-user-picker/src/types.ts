import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import {
	type DefaultValue,
	type ExternalUser,
	type OptionData,
	type Team,
	type User,
	type UserPickerProps,
} from '@atlaskit/user-picker';

export interface Context {
	containerId?: string;
	contextType: string;
	objectId?: string;
	sessionId?: string;
	principalId?: string;
	childObjectId?: string;
	productKey: string;
	siteId: string;
	organizationId?: string;
	productAttributes?: ProductAttributes;
}

export interface RecommendationRequest {
	baseUrl?: string;
	context: Context;
	maxNumberOfResults: number;
	query?: string;
	searchQueryFilter?: string;
	includeUsers?: boolean;
	includeGroups?: boolean;
	includeTeams?: boolean;
	includeNonLicensedUsers?: boolean;
	searchEmail?: boolean;
}

type OnError = (error: any, request: RecommendationRequest) => Promise<OptionData[]> | void;
type OnValueError = (error: any, defaultValue: DefaultValue) => Promise<OptionData[]> | void;
type OnEmpty = (query: string) => Promise<OptionData[]>;
type TransformOptions = (options: OptionData[], query?: string) => Promise<OptionData[]>;

export interface State {
	users: OptionData[];
	loading: boolean;
	closed: boolean;
	query: string;
	sessionId?: string;
	defaultValue?: DefaultValue;
	bootstrapOptions: OptionData[];
}

export type ProductAttributes = BitbucketAttributes | ConfluenceAttributes;

export type FilterOptions = (options: OptionData[], query: string) => OptionData[];

export interface BitbucketAttributes {
	/**
	 * Identifies whether this is a public repository or not.
	 */
	isPublicRepo?: boolean;
	/**
	 * A list of bitbucket workspace Ids used within container result set and noted in analytics.
	 */
	workspaceIds?: string[];
	/**
	 * The users current email domain which may be used to boost the results for relevant users.
	 */
	emailDomain?: string;
}

export interface ConfluenceAttributes {
	/**
	 * Identifies whether this user is part of a Confluence site that is entitled for guests
	 */
	isEntitledConfluenceExternalCollaborator?: boolean;
}

export enum EntityType {
	USER = 'USER',
	TEAM = 'TEAM',
	GROUP = 'GROUP',
}

export enum UserEntityType {
	DEFAULT = 'DEFAULT',
	APP = 'APP',
	CUSTOMER = 'CUSTOMER',
	SYSTEM = 'SYSTEM',
}

export interface RecommendationItem {
	id: string;
	name?: string;
	email?: string;
	entityType: EntityType;
	userType?: UserEntityType;
	avatarUrl: string;
	description?: string;
	teamAri?: string;
	displayName?: string;
	nonLicensedUser?: boolean;
}

export interface RecommendationResponse {
	errors?: any[];
	recommendedUsers: RecommendationItem[];
}

export type OverrideByline = (option: User | ExternalUser | Team) => string;

export interface SmartProps {
	/**
	 * The base URL of the site eg: hello.atlassian.net
	 */
	baseUrl?: string;
	/**
	 * Hydrated user suggestions to show when the query is blank. If not provided, smart user picker
	 *  will still provide a smart-ranked list of suggestions for blank queries. Please refer to @atlaskit/user-picker
	 *  for OptionData type.
	 */
	bootstrapOptions?: OptionData[];
	/**
	 * Context information for analytics. Eg: if a user picker was put inside a comment, the childObjectId would be
	 *  the ID of the comment. Optional, but please provide if available.
	 */
	childObjectId?: string;
	/**
	 * The container Id to identify context.
	 *
	 * e.g. Jira: projectId. Confluence: spaceId. Bitbucket: repositoryId.
	 */
	containerId?: string;
	/**
	 * Time to debounce the suggestions fetching (in milliseconds). Defaults to 150ms.
	 */
	debounceTime?: number;
	/**
	 * Function to transform options suggested by the server before showing to the user. Can be used to filter out suggestions.
	 * The results of filterOptions are the results displayed in the suggestions UI.
	 */
	filterOptions?: FilterOptions;
	/**
	 * Whether to include groups in the resultset. Only supported for Confluence. @default false
	 */
	includeGroups?: boolean;
	/**
	 * Whether to include teams in the resultset. @default false
	 */
	includeTeams?: boolean;
	/**
	 * Whether to include users in the resultset. @default true
	 */
	includeUsers?: boolean;
	/**
	 * Whether to include non licensed users in the resultset. @default false
	 */
	includeNonLicensedUsers?: boolean;
	/**
	 * An identifier of the closest context object, e.g. issueId, pageId, pullRequestId.
	 * Used for analytics. Optional, but please include if available.
	 */
	objectId?: string;
	/**
	 * Custom handler to give opportunity for caller to return list of options when server returns empty list.
	 * this is called if server returns empty list. This will NOT be called if props.filterOptions returns empty list.
	 */
	onEmpty?: OnEmpty;
	/**
	 * Error handler for when the server fails to suggest users and returns with an error response.
	 * `error`: the error.
	 * `RecommendationRequest`: the original recommendationRequest containing the query and other search parameters.
	 * This may be used to provide a fail over search direct to the product backend.
	 * Helper fail over clients exist under /helpers.
	 * Note that OnError results are filtered.
	 */
	onError?: OnError;
	/**
	 * Error handler used to provide OptionData[] values when the server fails to hydrate the `defaultValue` prop's values.
	 */
	onValueError?: OnValueError;
	/**
	 * Function to generate the byline of each option. The server response is
	 * provided as an argument to the function.
	 */
	overrideByline?: OverrideByline;
	/**
	 * When enabled, displays email addresses for users in the byline of each option, if available.
	 * Note - overrideByline will take precedent over displayEmailInByline.
	 * Note - only certain user types will have their email displayed.
	 * @default false
	 */
	displayEmailInByline?: boolean;
	/**
	 * Prefetch the list of suggested assignees before the user picker is focused.
	 * WARNING: please consider carefully before deciding to prefetch your suggestions
	 * as this will increase the load on the recommendations services (has caused HOTs).
	 * Please give #search-plex a ballpark on the expected request volume.
	 */
	prefetch?: boolean;
	/**
	 * Id of the user interacting with the component.
	 * If principalId is not provided, server will extract principalId from the context header, assuming that the user is logged in
	 *  when making the request. @default “context”
	 */
	principalId?: string;
	/**
	 * Product-specific Attributes - you should pass in the attribute type that matches your current SupportedProduct.
	 * Currently we support additional attributes (BitbucketAttributes) for bitbucket and (ConfluenceAttributes) for Confluence.
	 */
	productAttributes?: ProductAttributes;
	/**
	 * Product identifier. If you are an NPF, please ensure your product has been onboarded with
	 *  Cross-product user-search @see https://developer.atlassian.com/cloud/cross-product-user-search/
	 * If you are still waiting for CPUS, you can use the `people` productKey in the interim.
	 */
	productKey: string;
	/**
	 * When enabled, allows searching by email address.
	 * @default false
	 */
	enableEmailSearch?: boolean;
	/**
	 * When both allowEmail and enableEmailSearch are true, this controls whether both email entry
	 * and matched user entries can be selected simultaneously.
	 * If false, only allows email selection when no users are found.
	 * @default true
	 */
	allowEmailSelectionWhenEmailMatched?: boolean;
	/**
	 * Filter to be applied to the eventual query to CPUS for user suggestions.
	 * Example:`account_status:"active" AND (NOT email_domain:"connect.atlassian.com")`
	 *  will remove inactive users from the list of suggestions.
	 */
	searchQueryFilter?: string;
	/**
	 * Identifier for the product's tenant, also known as tenantId or cloudId
	 */
	siteId: string;
	/**
	 * Identifier for the organization in which to search for teams.
	 */
	orgId?: string;
	/**
	 * Optional callback to customize the options shown to the user.
	 * Called after options are loaded.
	 */
	transformOptions?: TransformOptions;
	/**
	 * Optional callback to provide additional user resolvers, such as for fetching and adding users from third party sources
	 */
	userResolvers?: Array<(query: string) => Promise<OptionData[]>>;
	/**
	 * Whether to include teams UI updates in the resultset. @default false
	 */
	includeTeamsUpdates?: boolean;
}

// Override UserPickerProps below with replacement documentation
export interface Props extends SmartProps, UserPickerProps, WithAnalyticsEventsProps {
	/**
	 * The pre-selected values for the smart user picker. Supports only Users and Teams default value hydration.
	 * If the `DefaultValue` contains only an `id` and `type` (it conforms to an `OptionIdentifier`)
	 * then the values will be automatically hydrated.
	 * If the value has a `name` then it is considered hydrated and will be ignored.
	 * Uses Confluence and Jira if called from there, else uses Identity or Legion for teams. If a value could not be found, or there was
	 * a network failure during the hydration, the value will be rendered with the label 'Unknown'. Else, if there were any other error
	 * during default value hydration, no default values will be rendered, use `onValueError` to handle this.
	 * `defaultValue` differs from `value` in that it sets the initial value then leaves the component 'uncontrolled'
	 * whereas setting the `value` prop delegates responsibility for maintaining the value to the caller
	 * (i.e. listen to `onChange`)
	 */
	defaultValue?: DefaultValue;
	/**
	 * Identifier for informing the server on where the user picker has been mounted.
	 * Unlike User Picker, the fieldId in Smart User Picker is mandatory.
	 * The server uses the fieldId to determine which model to utilize when
	 * generating suggestions.
	 * All fieldId's will be bucketed into a model that provides generic smart results,
	 * except "assignee", "mentions" which are specifically trained for Jira Assignee and
	 * @Mentions. For specifically trained models, please contact #search-plex.
	 */
	fieldId: string;
}
