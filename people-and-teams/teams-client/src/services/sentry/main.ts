// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import type { Breadcrumb, Scope } from '@sentry/browser';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Severity, SeverityLevel } from '@sentry/types';

import { type CreateErrorHandler, type SentryTags } from './types';
import { getSentryClient } from './utils/sentry-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Context = any & {
	/**
	 * Any tags to be added to the event.
	 */
	tags?: SentryTags;

	packageName?: string;
	packageVersion?: string;
};

function decorateScope(scope: Scope, context: Context): Scope {
	const { tags, ...otherContext } = context;

	if (tags) {
		scope.setTags(tags);
	}

	if (Object.keys(otherContext).length) {
		scope.setExtras(otherContext);
	}

	return scope;
}

export async function logException(
	ex: Error | unknown,
	name: string,
	context: Context = {},
): Promise<void> {
	try {
		const sentryClient = await getSentryClient();
		if (!sentryClient || typeof sentryClient.captureException !== 'function') {
			return;
		}
		sentryClient.withScope((scope) => {
			decorateScope(scope, context);
			scope.setTag('name', name);
			scope.setTag('packageName', context.packageName ?? 'unknown');
			scope.setTag('packageVersion', context.packageVersion ?? 'unknown');
			sentryClient!.captureException(ex, scope);
		});
	} catch {
		// silence sentry exceptions
	}
}

async function logMessage(severity: SeverityLevel, message: string, context: Context = {}) {
	const sentryClient = await getSentryClient();
	if (!sentryClient || typeof sentryClient.captureException !== 'function') {
		return;
	}

	sentryClient.withScope((scope) => {
		decorateScope(scope, context);
		// The Severity enum is being replaced by SeverityLevel type in v7 anyway
		// @ts-ignore - TypeScript 5.9.2 upgrade
		scope.setLevel(severity as Severity);
		scope.setTag('packageName', context.packageName ?? 'unknown');
		scope.setTag('packageVersion', context.packageVersion ?? 'unknown');
		sentryClient!.captureMessage(message, scope);
	});
}

export function logErrorMessage(message: string, context: Context = {}): void {
	logMessage('error', message, context).catch(() => {});
}

export function logInfoMessage(message: string, context: Context = {}): void {
	logMessage('info', message, context).catch(() => {});
}

export const createErrorHandler: CreateErrorHandler = (details) => {
	return (error, message, tags = {}) => {
		logException(error, message, {
			tags: {
				...details,
				...tags,
			},
		});
	};
};

export const logExceptionWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof logException>): void => {
		// Intentionally not awaiting the promise here as we don't need the result
		logException(args[0], args[1], {
			...args[2],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
	};

export const logErrorMessageWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof logErrorMessage>): void => {
		// Intentionally not awaiting the promise here as we don't need the result
		logErrorMessage(args[0], {
			...args[1],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
	};

export const logInfoMessageWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof logInfoMessage>): void => {
		// Intentionally not awaiting the promise here as we don't need the result
		logInfoMessage(args[0], {
			...args[1],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});
	};

export const createErrorHandlerWithPackageContext =
	(packageContext: { packageName: string; packageVersion: string }) =>
	(...args: Parameters<typeof createErrorHandler>) =>
		createErrorHandler({
			...args[0],
			packageName: packageContext.packageName,
			packageVersion: packageContext.packageVersion,
		});

export async function addBreadcrumb(crumb: string | Breadcrumb): Promise<void> {
	const sentryClient = await getSentryClient();

	sentryClient!.withScope((scope) => {
		// @ts-ignore - TypeScript 5.9.2 upgrade
		scope.addBreadcrumb(typeof crumb === 'string' ? { message: crumb } : crumb);
	});
}
