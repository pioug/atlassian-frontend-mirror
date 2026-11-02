import { FlagClient } from '@atlaskit/flag-client/client';
import type {
	BulkEvaluationPayload,
	BulkEvaluationResult,
	EnvironmentType,
	EvaluationOptions,
	FlagClientOptions,
	FlagResult,
	FlagUser,
	PayloadProvider,
} from '@atlaskit/flag-client/types';

import { toFlagUser } from './toFlagUser';
import {
	type BaseClientOptions,
	type CustomAttributes,
	FeatureGateEnvironment,
	type FfpInitializeValues,
	type Identifiers,
	PerimeterType,
} from './types';

export type FfpAdapterOptions = Pick<
	BaseClientOptions,
	'environment' | 'targetApp' | 'perimeter' | 'disableAllLogging'
>;

/** A config-shaped view of an FFP flag, matching what Statsig serves for a dynamic config. */
export interface FfpConfigValue {
	readonly value: Record<string, unknown>;
	readonly ruleId: string;
}

/**
 * Returned by a typed read only when the Feature Flag Platform client falls back to the safe
 * default (flag absent, type mismatch, unusable value, or `useCodeDefault`). Identity comparison
 * against it lets the wrapper apply the caller's own default instead.
 */
const NOT_SERVED: unique symbol = Symbol('ffp-not-served');

const toEnvironmentType = (environment: FeatureGateEnvironment): EnvironmentType => {
	switch (environment) {
		case FeatureGateEnvironment.Development:
			return 'dev';
		case FeatureGateEnvironment.Staging:
			return 'staging';
		default:
			return 'prod';
	}
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * What the client serves for a user FFP serves nothing to: every read returns its default. The
 * payload's request context is the user, so exposures are attributed to them.
 */
const emptyPayload =
	(user: FlagUser): PayloadProvider =>
	(): BulkEvaluationPayload => ({ flags: {}, requestContext: user });

/** Only forward the members the FFP client consumes; the service payload carries extra metadata. */
const toBulkEvaluationPayload = (values: FfpInitializeValues): BulkEvaluationPayload => ({
	// Forward the schema version so the FFP client rejects a wire format it does not support.
	...(values.vs !== undefined && { vs: values.vs }),
	flags: values.flags,
	requestContext: values.requestContext,
	...(values.clientVersion !== undefined && { clientVersion: values.clientVersion }),
});

const toFlagClientOptions = (options: FfpAdapterOptions): FlagClientOptions => {
	// Match the Statsig client: no telemetry egress in FedRAMP or when logging is disabled.
	const loggingDisabled =
		options.perimeter === PerimeterType.FEDRAMP_MODERATE || options.disableAllLogging === true;
	return {
		targetApp: options.targetApp,
		environmentType: toEnvironmentType(options.environment),
		...(loggingDisabled && { exposureLogging: { enabled: false } }),
	};
};

const EMPTY_CONFIG: FfpConfigValue = { value: {}, ruleId: '' };

/**
 * Owns the Feature Flag Platform client used alongside Statsig during migration.
 *
 * The Feature Flag Service partitions flags so each key is served by exactly one platform. The
 * wrapper routes a key here when it is in the latest FFP payload (see {@link has}), and every read
 * then resolves within FFP, using FFP's own defaults; it never falls back to Statsig.
 *
 * One FFP client is created on the first values and reused for every later user and update, because
 * the client registers page lifecycle listeners and timers that it cannot release.
 */
export class FfpClientAdapter {
	private client?: FlagClient;
	private initialized = false;
	private flags?: BulkEvaluationResult;

	/**
	 * Applies the FFP values for a user. Absent values mean FFP serves nothing for this user (for
	 * example the provider is disabled or unavailable), so no key is routed here until the next values
	 * arrive. The client is not created until the first values arrive.
	 */
	apply(
		options: FfpAdapterOptions,
		values: FfpInitializeValues | undefined,
		identifiers: Identifiers,
		customAttributes?: CustomAttributes,
	): void {
		// Never keep serving the previous user's values, whatever happens below.
		this.flags = undefined;
		const user = toFlagUser(identifiers, customAttributes);
		try {
			if (values && this.applyPayload(options, () => toBulkEvaluationPayload(values), user)) {
				this.flags = values.flags;
				return;
			}
			// Callers may read the client directly (see `getClient`), and a failed or skipped replacement
			// would leave it serving the previous user's payload, so give it an empty one for this user.
			if (this.initialized) {
				this.client?.replace(emptyPayload(user), user);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('Failed to apply Feature Flag Platform values', error);
		}
	}

	/** Gives the client a payload and user, returning whether it accepted them. */
	private applyPayload(
		options: FfpAdapterOptions,
		provider: PayloadProvider,
		user: FlagUser,
	): boolean {
		const client = this.getClient(options);
		// `initialize` can be retried after a failure; once it succeeds, later users use `replace`.
		if (this.initialized) {
			return client.replace(provider, user).replaced;
		}
		this.initialized = client.initialize(provider, user).initialized;
		return this.initialized;
	}

	/**
	 * The FFP client, created on first use with the given options and the same instance afterwards.
	 * Until values are applied (and while FFP serves nothing for the user), its reads return the safe
	 * default they are given.
	 */
	getClient(options: FfpAdapterOptions): FlagClient {
		this.client ??= new FlagClient(toFlagClientOptions(options));
		return this.client;
	}

	/** Whether the latest FFP payload contains the given flag key, so FFP answers for it. */
	has(flagKey: string): boolean {
		return this.getFlag(flagKey) !== undefined;
	}

	/**
	 * Gate read. FFP's default is `false`, which covers a key it does not serve and a flag that is not
	 * a boolean (FFP falls back to the default for a type mismatch).
	 */
	checkGate(gateName: string, fireExposure: boolean): boolean {
		if (!this.client || !this.has(gateName)) {
			return false;
		}
		return this.client.getBooleanValue(gateName, false, toEvaluationOptions(fireExposure));
	}

	/**
	 * Config (experiment or dynamic config) read.
	 *
	 * JSON object flags are Statsig experiments and are returned as their parameters. Every other
	 * value is a flattened Statsig dynamic config, so it is returned as `{ value }`. When FFP does not
	 * serve the key or falls back to a code default, the config is empty so the caller's default
	 * applies.
	 */
	getConfig(configName: string, fireExposure: boolean): FfpConfigValue {
		const flag = this.getFlag(configName);
		if (!this.client || !flag) {
			return EMPTY_CONFIG;
		}

		const { value, metadata } = this.readDetails(
			this.client,
			configName,
			flag,
			toEvaluationOptions(fireExposure),
		);
		const ruleId = metadata.ruleId ?? '';
		if (value === NOT_SERVED) {
			return { value: {}, ruleId };
		}
		return { value: isPlainObject(value) ? value : { value }, ruleId };
	}

	/** Logs an exposure for a gate served by FFP. */
	logGateExposure(gateName: string): void {
		this.checkGate(gateName, true);
	}

	/** Logs an exposure for a config served by FFP. */
	logConfigExposure(configName: string): void {
		this.getConfig(configName, true);
	}

	private getFlag(flagKey: string): FlagResult | undefined {
		if (!this.flags || !Object.prototype.hasOwnProperty.call(this.flags, flagKey)) {
			return undefined;
		}
		return this.flags[flagKey];
	}

	private readDetails(
		client: FlagClient,
		flagKey: string,
		flag: FlagResult,
		options: EvaluationOptions,
	): { value: unknown; metadata: { ruleId: string | null } } {
		// The sentinel is returned by identity on every fallback; the casts only satisfy the typed
		// read signatures.
		switch (flag.returnType) {
			case 'BOOLEAN':
				return client.getBooleanDetails(flagKey, NOT_SERVED as unknown as boolean, options);
			case 'STRING':
				return client.getStringDetails(flagKey, NOT_SERVED as unknown as string, options);
			case 'NUMBER':
				return client.getNumberDetails(flagKey, NOT_SERVED as unknown as number, options);
			default:
				return client.getObjectDetails<unknown>(flagKey, NOT_SERVED, options);
		}
	}
}

const toEvaluationOptions = (fireExposure: boolean): EvaluationOptions => ({
	disableExposureLogging: !fireExposure,
});
