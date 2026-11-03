/**
 * Types for executing Integrations Service (IS) actions through the Atlassian GraphQL Gateway (AGG)
 * `actions { execute }` mutation.
 *
 * Internal for now. Move these to `@atlaskit/linking-types` (e.g. an `integration-actions` entry)
 * once there is a consumer outside this package.
 */

/** Mirrors AGG `ActionsAuthType`. */
export type IntegrationActionAuthType =
	/** Runs with a user in context. */
	| 'THREE_LEGGED'
	/** Runs without a user in context. */
	| 'TWO_LEGGED';

/** Selects which action IS should run. Mirrors AGG `ActionsExecuteActionFilter`. */
export type IntegrationActionFilter = {
	/** Run the action with this ARI. Don't set `actionId` as well. */
	actionAri?: string;
	/**
	 * Run the action with this ID, e.g. for custom-alias actions with
	 * `actionTypeKey: 'atlassian::custom:action'`. Don't set `actionAri` as well.
	 */
	actionId?: string;
	/** Only run actions that support these auth types. */
	authType?: IntegrationActionAuthType[];
	/** Only run the action that matches this extension ARI. */
	extensionAri?: string;
	/** Only run actions for this first-party integration, e.g. `google-drive` or `github`. */
	integrationKey?: string;
	/** Only run actions for this OAuth client. */
	oauthClientId?: string;
	/** Only run actions for this provider ARI. */
	providerAri?: string;
	/** Only run actions for this provider ID. */
	providerId?: string;
};

/** The resource the action runs against. Mirrors AGG `ActionsExecuteTargetInput`. */
export type IntegrationActionTarget = {
	ari?: string;
	/** Provider-specific IDs that identify the resource. */
	ids?: Record<string, unknown>;
	url?: string;
};

/** Mirrors AGG `ActionsExecuteActionInput`. */
export type IntegrationActionInput = {
	/** Cloud ID of the site to run the action on. */
	cloudId?: string;
	/** Action-specific inputs, e.g. `{ fileId, content }` for adding a Google Docs comment. */
	inputs?: Record<string, unknown>;
	/** Runtime metadata from the caller, kept separate from the action inputs. */
	meta?: Record<string, unknown>;
	target?: IntegrationActionTarget;
};

export type ExecuteIntegrationActionRequest = {
	actionInput: IntegrationActionInput;
	/**
	 * Standard action type key, or `atlassian::custom:action` for custom-alias actions
	 * (set `filter.actionId` as well).
	 */
	actionTypeKey?: string;
	filter: IntegrationActionFilter;
	workspace?: string;
};

export type ExecuteIntegrationActionResponse<TOutputs = unknown> = {
	/** Outputs from the app that ran the action. The shape depends on the action. */
	outputs: TOutputs;
	/** Status IS reports for the action (HTTP-like, e.g. 200). */
	status?: number;
};

/** A GraphQL error from AGG, in the top-level `errors` array. */
export type IntegrationActionGraphQLError = {
	extensions?: Record<string, unknown>;
	message: string;
	path?: (string | number)[];
};

/**
 * An error IS reports in `data.actions.execute.outputs.errors`.
 * These come back with HTTP 200 and no GraphQL `errors`.
 */
export type IntegrationActionOperationError = {
	extensions?: {
		[key: string]: unknown;
		/** URL where the user can connect, or reconnect, their 3P account. */
		authUrl?: string;
		errorCategory?: string;
		/** e.g. `USER_CONSENT_REQUIRED` */
		errorType?: string;
		retryable?: boolean;
	};
	message: string;
	statusCode?: number;
};

export type IntegrationActionErrorKind =
	/** The user must connect, or reconnect, their 3P account. See `authUrl`. */
	| 'consent-required'
	/** IS ran the action and it failed. */
	| 'operation'
	/** AGG returned GraphQL errors, or the response was malformed. */
	| 'graphql'
	/** The request failed: non-2xx response, network error, or non-JSON body. */
	| 'http';

/** Raw AGG response body for the execute mutation. */
export type ExecuteIntegrationActionGraphQLResponse = {
	data?: {
		actions?: {
			execute?: {
				outputs?: unknown;
				status?: number;
			} | null;
		} | null;
	} | null;
	errors?: IntegrationActionGraphQLError[];
};
