import {
	GENERIC_GRAPHQL_ERROR_MESSAGE,
	GENERIC_OPERATION_ERROR_MESSAGE,
	USER_CONSENT_REQUIRED,
} from './constants';
import {
	IntegrationActionError,
	type IntegrationActionErrorOptions,
} from './integration-action-error';
import type {
	ExecuteIntegrationActionGraphQLResponse,
	ExecuteIntegrationActionResponse,
	IntegrationActionGraphQLError,
	IntegrationActionOperationError,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const isSuccessStatus = (status: number) => status >= 200 && status < 300;

const getStringExtension = (
	extensions: Record<string, unknown> | undefined,
	key: string,
): string | undefined => {
	const value = extensions?.[key];
	return typeof value === 'string' && value !== '' ? value : undefined;
};

/**
 * Returns `authUrl` from the extensions only if it's an absolute `https:` URL, so a malformed or
 * unsafe value (e.g. `javascript:`) is never handed to the UI to open.
 */
const getAuthUrl = (extensions: Record<string, unknown> | undefined): string | undefined => {
	const value = getStringExtension(extensions, 'authUrl');
	if (!value) {
		return undefined;
	}
	try {
		return new URL(value).protocol === 'https:' ? value : undefined;
	} catch {
		return undefined;
	}
};

/** Normalises an entry of `outputs.errors`, which IS doesn't guarantee is well-formed. */
const toOperationErrorEntry = (error: unknown): IntegrationActionOperationError => {
	if (typeof error === 'string') {
		return { message: error || GENERIC_OPERATION_ERROR_MESSAGE };
	}
	if (!isRecord(error)) {
		return { message: GENERIC_OPERATION_ERROR_MESSAGE };
	}
	return {
		message:
			typeof error.message === 'string' && error.message !== ''
				? error.message
				: GENERIC_OPERATION_ERROR_MESSAGE,
		// Values are read with runtime checks below, so the cast doesn't trust their types.
		...(isRecord(error.extensions)
			? { extensions: error.extensions as IntegrationActionOperationError['extensions'] }
			: {}),
		...(typeof error.statusCode === 'number' ? { statusCode: error.statusCode } : {}),
	};
};

/** Normalises an entry of the GraphQL `errors` array, which may be malformed. */
const toGraphQLErrorEntry = (error: unknown): IntegrationActionGraphQLError => {
	if (!isRecord(error)) {
		return { message: typeof error === 'string' && error ? error : GENERIC_GRAPHQL_ERROR_MESSAGE };
	}
	return {
		message:
			typeof error.message === 'string' && error.message !== ''
				? error.message
				: GENERIC_GRAPHQL_ERROR_MESSAGE,
		...(isRecord(error.extensions) ? { extensions: error.extensions } : {}),
		...(Array.isArray(error.path) ? { path: error.path as (string | number)[] } : {}),
	};
};

/** A non-empty `outputs.errors` always means the action failed, even if the entries are malformed. */
const getOperationErrors = (outputs: unknown): IntegrationActionOperationError[] | undefined => {
	const errors = isRecord(outputs) ? outputs.errors : undefined;
	if (!Array.isArray(errors) || errors.length === 0) {
		return undefined;
	}
	return errors.map(toOperationErrorEntry);
};

const toOperationError = (
	operationErrors: IntegrationActionOperationError[],
	status?: number,
): IntegrationActionError => {
	const consentError = operationErrors.find(
		(error) =>
			getStringExtension(error.extensions, 'errorType') === USER_CONSENT_REQUIRED ||
			!!getAuthUrl(error.extensions),
	);
	const error = consentError ?? operationErrors[0];
	const authUrl = getAuthUrl(consentError?.extensions);
	const retryable = error.extensions?.retryable;
	const options: IntegrationActionErrorOptions = {
		authUrl,
		errorType: getStringExtension(error.extensions, 'errorType'),
		retryable: typeof retryable === 'boolean' ? retryable : undefined,
		statusCode: error.statusCode ?? status,
		operationErrors,
	};

	if (consentError && authUrl) {
		return new IntegrationActionError('consent-required', error.message, options);
	}
	return new IntegrationActionError('operation', error.message, options);
};

const toGraphQLError = (
	graphQLErrors: IntegrationActionGraphQLError[],
	statusCode?: number,
): IntegrationActionError => {
	const authUrl = graphQLErrors
		.map((error) => getAuthUrl(error.extensions))
		.find((url): url is string => !!url);
	const errorType = graphQLErrors
		.map(
			(error) =>
				getStringExtension(error.extensions, 'errorType') ??
				getStringExtension(error.extensions, 'classification'),
		)
		.find((type): type is string => !!type);
	const message = graphQLErrors.map((error) => error.message).join('; ');
	const options: IntegrationActionErrorOptions = {
		authUrl,
		errorType,
		statusCode,
		graphQLErrors,
	};

	if (authUrl) {
		return new IntegrationActionError('consent-required', message, options);
	}
	return new IntegrationActionError('graphql', message, options);
};

/**
 * Turns an AGG response body into the action response, or throws an `IntegrationActionError`.
 *
 * Errors are checked in this order:
 * 1. IS operation errors in `outputs.errors` (consent required, or the action failed).
 * 2. GraphQL `errors`, even with a partial `execute` result. The mutation only selects
 *    `actions.execute`, so any GraphQL error relates to the action.
 * 3. A missing `execute` result.
 * 4. A non-2xx `status` from IS.
 */
export const parseExecuteIntegrationActionResponse = <TOutputs = unknown>(
	body: ExecuteIntegrationActionGraphQLResponse | undefined,
	httpStatus?: number,
): ExecuteIntegrationActionResponse<TOutputs> => {
	const execute = body?.data?.actions?.execute;
	const graphQLErrors =
		Array.isArray(body?.errors) && body.errors.length
			? (body.errors as unknown[]).map(toGraphQLErrorEntry)
			: undefined;
	const operationErrors = getOperationErrors(execute?.outputs);

	if (operationErrors?.length) {
		throw toOperationError(operationErrors, execute?.status);
	}

	if (graphQLErrors) {
		throw toGraphQLError(graphQLErrors, httpStatus);
	}

	if (!execute) {
		throw new IntegrationActionError('graphql', 'No action result returned', {
			statusCode: httpStatus,
		});
	}

	if (typeof execute.status === 'number' && !isSuccessStatus(execute.status)) {
		throw new IntegrationActionError('operation', `Action failed with status ${execute.status}`, {
			statusCode: execute.status,
		});
	}

	return {
		status: execute.status,
		outputs: execute.outputs as TOutputs,
	};
};
