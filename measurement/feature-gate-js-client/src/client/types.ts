import type { StatsigOptions as NewStatsigOptions } from '@statsig/js-client';

import type { StatsigOptions } from './compat/types';

/**
 * The identifiers for the user. Options are restricted to the set that is currently supported.
 */
export type Identifiers = {
	activationId?: string;
	analyticsAnonymousId?: string;
	atlassianAccountId?: string;
	atlassianOrgId?: string;
	bitbucketConnectAppId?: string;
	bitbucketRepositoryId?: string;
	bitbucketWorkspaceId?: string;
	emailUuid?: string;
	gsacIssueId?: string;
	intercomConversationId?: string;
	loomAnonymousId?: string;
	loomUserId?: string;
	loomWorkspaceId?: string;
	marketplaceAnonymousId?: string;
	marketplacePartnerId?: string;
	miscellaneousId?: string;
	msTeamsTenantId?: string;
	productIntegrationsVendorId?: string;
	randomizationId?: string;
	tenantId?: string;
	transactionAccountId?: string;
	trelloUserId?: string;
	trelloWorkspaceId?: string;
};

export type UpdateUserCompletionCallback = (success: boolean, message: string | null) => void;

export type FeatureGateOptions = Omit<
	StatsigOptions,
	'environment' | 'initializeValues' | 'sdkKey' | 'updateUserCompletionCallback'
>;

export type NewFeatureGateOptions = Omit<
	NewStatsigOptions,
	'environment' | 'initializeValues' | 'sdkKey' | 'updateUserCompletionCallback'
>;

type OperationalEventPayload = {
	action: string;
	actionSubject: string;
	actionSubjectId?: string;
	attributes?: Record<string, unknown>;
	tags?: string[];
	source: string;
};

export interface AnalyticsWebClient {
	sendOperationalEvent(event: OperationalEventPayload, callback?: any): void;
}

/**
 * Base client options. Does not include any options specific to providers
 * @interface BaseClientOptions
 * @property {FeatureGateEnvironment} environment - The environment for the client.
 * @property {string} targetApp - The target app for the client.
 * @property {AnalyticsWebClient} analyticsWebClient - The analytics web client.
 * @property {PerimeterType} perimeter - The perimeter for the client.
 */
export interface BaseClientOptions extends FeatureGateOptions {
	environment: FeatureGateEnvironment;
	targetApp: string;
	updateUserCompletionCallback?: UpdateUserCompletionCallback;
	analyticsWebClient?: Promise<AnalyticsWebClient>;
	perimeter?: PerimeterType;
}

/**
 * The options for the client.
 * @interface ClientOptions
 * @extends {BaseClientOptions}
 * @property {string} apiKey - The API key for the client.
 * @property {fetchTimeoutMs} fetchTimeoutMs - The timeout for the fetch request in milliseconds. Defaults to 5000.
 * @property {boolean} useGatewayURL - Whether to use the gateway URL. Defaults to false.
 */
export interface ClientOptions extends BaseClientOptions {
	apiKey: string;
	fetchTimeoutMs?: number;
	useGatewayURL?: boolean;
}

export interface FromValuesClientOptions extends BaseClientOptions {
	sdkKey?: string;
}

export type OptionsWithDefaults<T extends BaseClientOptions> = T & Required<Pick<T, 'perimeter'>>;

export interface FrontendExperimentsResult extends InitializeValues {
	clientSdkKey?: string;
}

/**
 * The custom attributes for the user.
 */
export type CustomAttributes = {
	[key: string]: string | number | boolean | Array<string>;
};

export enum FeatureGateEnvironment {
	Development = 'development',
	Staging = 'staging',
	Production = 'production',
}

// If adding new values here, please check FeatureGates.getDefaultPerimeter to make sure it still returns something sensible.
export enum PerimeterType {
	COMMERCIAL = 'commercial',
	FEDRAMP_MODERATE = 'fedramp-moderate',
}

export interface CheckGateOptions {
	/**
	 * Whether or not to fire the exposure event for the gate. Defaults to true.
	 * To log an exposure event manually at a later time, use {@link FeatureGates.manuallyLogGateExposure}
	 * (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 */
	fireGateExposure?: boolean;
}

export interface GetExperimentOptions {
	/**
	 * Whether or not to fire the exposure event for the experiment. Defaults to true. To log an
	 * exposure event manually at a later time, use {@link FeatureGates.manuallyLogExperimentExposure}
	 * (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 */
	fireExperimentExposure?: boolean;
}

export type GetExperimentValueOptions<T> = GetExperimentOptions & {
	/**
	 * A function that asserts that the return value has the expected type. If this function returns
	 * false, then the default value will be returned instead. This can be set to protect your code
	 * from unexpected values being set remotely. By default, this will be done by asserting that the
	 * default value and value are the same primitive type.
	 */
	typeGuard?: (value: unknown) => value is T;
};

export interface GetLayerOptions {
	/**
	 * Whether or not to fire the exposure event for the layer. Defaults to true. To log an exposure
	 * event manually at a later time, use {@link FeatureGates.manuallyLogLayerExposure}
	 * (see [Statsig docs about manually logging exposures](https://docs.statsig.com/client/jsClientSDK#manual-exposures-)).
	 */
	fireLayerExposure?: boolean;
}

export type GetLayerValueOptions<T> = GetLayerOptions & {
	/**
	 * A function that asserts that the return value has the expected type. If this function returns
	 * false, then the default value will be returned instead. This can be set to protect your code
	 * from unexpected values being set remotely. By default, this will be done by asserting that the
	 * default value and value are the same primitive type.
	 */
	typeGuard?: (value: unknown) => value is T;
};

export interface InitializeValues {
	experimentValues: Record<string, unknown>;
	customAttributesFromFetch: CustomAttributes | undefined;
}

export interface FrontendExperimentsResult extends InitializeValues {
	clientSdkKey?: string;
}

export interface Provider {
	setClientVersion: (clientVersion: string) => void;
	setProfile: (
		clientOptions: OptionsWithDefaults<BaseClientOptions>,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	) => Promise<void>;
	setApplyUpdateCallback?: (
		applyUpdate: (experimentsResult: FrontendExperimentsResult) => void,
	) => void;
	getExperimentValues: () => Promise<FrontendExperimentsResult>;
	getClientSdkKey: () => Promise<string>;
	getApiKey?: () => string;
}

export const NON_BOOLEAN_VALUE = 'non_boolean';

export type FeatureFlagValue =
	| boolean
	| string
	| number
	| Record<any, any>
	| typeof NON_BOOLEAN_VALUE;

// Type magic to get the JSDoc comments from the Client class methods to appear on the static
// methods in FeatureGates where the property name and function type are identical
export type WithDocComments<Target, TypeWithDocComments> = PickFrom<
	Target,
	TypeWithDocComments,
	OverlappingProperties<TypeWithDocComments, Target>
>;
type PickFrom<A, B, K extends keyof A & keyof B> = Omit<A, K> & Pick<B, K>;
type OverlappingProperties<A, B> = {
	[K in keyof A]: K extends keyof B ? (IsSame<A[K], B[K]> extends true ? K : never) : never;
}[keyof A];
type IsSame<A, B> = A extends B ? (B extends A ? true : false) : false;
