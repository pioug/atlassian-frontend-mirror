import { logException } from '../sentry';
import { type ClientContext, type ClientContextProps } from '../types';

type NestedContext = {
	[key: string]: string | number | boolean | NestedContext;
};

export type LogExceptionFN = (
	ex: unknown | Error,
	name: string,
	context?: NestedContext & { tags?: Record<string, string> },
) => void;

export type ClientConfig = {
	logException: LogExceptionFN;
};

type CacheRecord<T> = {
	data: T;
	expiration: number;
};

export class BaseClient {
	private config: ClientConfig;
	private context: ClientContext;

	private cache: Record<string, CacheRecord<unknown>> = {};

	constructor(config: ClientConfig) {
		this.config = config;
		this.context = {
			cloudId: 'None',
		};
	}
	setContext(context: ClientContextProps) {
		this.context = {
			...context,
			cloudId: context.cloudId || 'None',
		};
	}

	getContext() {
		return this.context;
	}

	/**
	 *
	 * @param localValue is used for backwards compatibility
	 * @returns
	 */
	getOrgId(localValue?: string) {
		const orgId = localValue || this.getContext().orgId;
		if (!orgId) {
			const err = new Error('No orgId set');
			this.logException(err, 'No orgId set');
			throw err;
		}
		return orgId;
	}
	/**
	 *
	 * @param localValue is used for backwards compatibility
	 * @returns
	 */
	getCloudId(localValue?: string) {
		return localValue || this.getContext().cloudId;
	}

	logException = (
		ex: unknown | Error,
		name: string,
		context?: NestedContext & { tags?: Record<string, string> },
	) => {
		logException(ex, name, context);
		this.config.logException(ex, name, context);
	};

	private keyWithContext(key: string) {
		return `${this.getContext().cloudId}-${this.getContext().orgId ?? 'no-org-id'}-${this.getContext().userId ?? 'no-user-id'}-${key}`;
	}

	// Default expiration is 5 minutes
	cacheValue<T>(key: string, value: T, expiryMs: number = 1000 * 60 * 5) {
		this.cache[this.keyWithContext(key)] = {
			data: value,
			expiration: Date.now() + expiryMs,
		};
	}

	getCachedValue<T>(key: string) {
		const record = this.cache[this.keyWithContext(key)];
		if (record && record.expiration > Date.now()) {
			return record.data as T;
		}
		return undefined;
	}
}
