import type {
	IntegrationActionErrorKind,
	IntegrationActionGraphQLError,
	IntegrationActionOperationError,
} from './types';

export type IntegrationActionErrorOptions = {
	authUrl?: string;
	errorType?: string;
	graphQLErrors?: IntegrationActionGraphQLError[];
	operationErrors?: IntegrationActionOperationError[];
	/** The underlying error, e.g. the network `TypeError` for a failed fetch. */
	originalError?: unknown;
	retryable?: boolean;
	statusCode?: number;
};

/** Thrown by `executeAction` when an action can't be run or fails. */
export class IntegrationActionError extends Error {
	readonly kind: IntegrationActionErrorKind;
	/** Set when `kind` is `consent-required`: where the user can connect their 3P account. */
	readonly authUrl?: string;
	readonly errorType?: string;
	readonly retryable?: boolean;
	/** HTTP status, or the status IS reported for the action. */
	readonly statusCode?: number;
	readonly graphQLErrors?: IntegrationActionGraphQLError[];
	readonly operationErrors?: IntegrationActionOperationError[];
	/** The underlying error, when the request itself failed. */
	readonly originalError?: unknown;

	constructor(
		kind: IntegrationActionErrorKind,
		message: string,
		options: IntegrationActionErrorOptions = {},
	) {
		super(message);
		this.name = 'IntegrationActionError';
		this.kind = kind;
		this.authUrl = options.authUrl;
		this.errorType = options.errorType;
		this.retryable = options.retryable;
		this.statusCode = options.statusCode;
		this.graphQLErrors = options.graphQLErrors;
		this.operationErrors = options.operationErrors;
		this.originalError = options.originalError;
	}
}
