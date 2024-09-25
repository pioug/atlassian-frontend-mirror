import { type StatsigOptions } from 'statsig-js-lite';

/**
 * Types that will temporarily stay in this package. These types will be moved to feature-gate-js-client in a major version bump and used there instead.
 */

type FeatureGateOptions = StatsigOptions;

export interface ClientOptions
	extends Omit<
		FeatureGateOptions,
		'environment' | 'initializeValues' | 'sdkKey' | 'updateUserCompletionCallback'
	> {
	environment: FeatureGateEnvironment;
	targetApp: string;
	updateUserCompletionCallback?: UpdateUserCompletionCallback;
	// To uncomment when moved to feature-gate-js-client
	// analyticsWebClient?: Promise<AnalyticsWebClient>;
	perimeter?: PerimeterType;
}

export type UpdateUserCompletionCallback = (success: boolean, message: string | null) => void;

export enum FeatureGateEnvironment {
	Development = 'development',
	Staging = 'staging',
	Production = 'production',
}

export enum PerimeterType {
	COMMERCIAL = 'commercial',
	FEDRAMP_MODERATE = 'fedramp-moderate',
}

export type Identifiers = {
	activationId?: string;
	analyticsAnonymousId?: string;
	atlassianAccountId?: string;
	atlassianOrgId?: string;
	bitbucketConnectAppId?: string;
	bitbucketRepositoryId?: string;
	bitbucketWorkspaceId?: string;
	gsacIssueId?: string;
	intercomConversationId?: string;
	marketplaceAnonymousId?: string;
	marketplacePartnerId?: string;
	msTeamsTenantId?: string;
	productIntegrationsVendorId?: string;
	randomizationId?: string;
	tenantId?: string;
	transactionAccountId?: string;
	trelloUserId?: string;
	trelloWorkspaceId?: string;
};

export type CustomAttributes = {
	[key: string]: string | number | boolean | Array<string>;
};

export type InitializeValues = {
	experimentValues: Record<string, unknown>;
	customAttributesFromFetch: CustomAttributes | undefined;
};

export interface FrontendExperimentsResult extends InitializeValues {
	clientSdkKey?: string;
}

export interface Provider {
	setApplyUpdateCallback?: (
		applyUpdate: (experimentsResult: FrontendExperimentsResult) => void,
	) => void;
	getExperimentValues: (
		clientVersion: string,
		clientOptions: ClientOptions,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	) => Promise<FrontendExperimentsResult>;
	getClientSdkKey: (clientVersion: string, clientOptions: ClientOptions) => Promise<string>;
	getApiKey?: () => string;
}
