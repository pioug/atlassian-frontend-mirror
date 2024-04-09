import { StatsigOptions } from 'statsig-js-lite';

/**
 * The identifiers for the user. Options are restricted to the set that is currently supported.
 */
export type Identifiers = {
  activationId?: string;
  analyticsAnonymousId?: string;
  atlassianAccountId?: string;
  atlassianOrgId?: string;
  gsacIssueId?: string;
  intercomConversationId?: string;
  marketplaceAnonymousId?: string;
  marketplacePartnerId?: string;
  msTeamsTenantId?: string;
  randomizationId?: string;
  tenantId?: string;
  transactionAccountId?: string;
  trelloUserId?: string;
  trelloWorkspaceId?: string;
};

export type UpdateUserCompletionCallback = (
  success: boolean,
  message: string | null,
) => void;

type FeatureGateOptions = StatsigOptions;

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
 * Base client options.
 * @interface BaseClientOptions
 * @property {FeatureGateEnvironment} environment - The environment for the client.
 * @property {string} targetApp - The target app for the client.
 * @property {AnalyticsWebClient} analyticsWebClient - The analytics web client.
 * @property {PerimeterType} perimeter - The perimeter for the client.
 */
interface BaseClientOptions
  extends Omit<
    FeatureGateOptions,
    | 'environment'
    | 'initializeValues'
    | 'sdkKey'
    | 'updateUserCompletionCallback'
  > {
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

export enum PerimeterType {
  COMMERCIAL = 'commercial',
  FEDRAMP_MODERATE = 'fedramp-moderate',
}

export type GetExperimentOptions = {
  fireExperimentExposure?: boolean;
};

export type GetExperimentValueOptions<T> = GetExperimentOptions & {
  typeGuard?: (value: unknown) => value is T;
};

export type InitializeValues = {
  experimentValues: Record<string, unknown>;
  customAttributesFromFetch: CustomAttributes | undefined;
};
