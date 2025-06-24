import EventEmitter2Default, { EventEmitter2 as EventEmitter2NamedImport } from 'eventemitter2';

/**
 * Mapping this import to ensure it works both as a default and named import, else this breaks:
 * Example error:
 * `npm-modules:https://esm.sh/@atlaskit/feature-gate-js-client@5.3.1/es2022/feature-gate-js-client.mjs:3:584: ERROR: No matching export in "npm-modules:https://esm.sh/eventemitter2@%5E4.1.0?target=es2022" for import "EventEmitter2"`
 * This is happening when consumed via v0, Figma Make, etc.
 *
 * This is not the only package this happens with, but this package is included with every other package
 * in the monorepo, so it's the priority to experiment and fix.
 *
 * @see https://github.com/EventEmitter2/EventEmitter2/issues/281#issuecomment-1829801065
 *
 * The default export appears to be the preference, however the named import is provided for backwards-compatibility
 * and we still use the `EventEmitter2NamedImport` because that's what the types pick up as well.
 */
const EventEmitter2: typeof EventEmitter2NamedImport =
	EventEmitter2NamedImport || EventEmitter2Default;

import { type CheckGateOptions, type GetExperimentValueOptions } from '../client/types';

export const ALL_FEATURE_VALUES = '@all-features';

export default class Subscriptions {
	private emitter: EventEmitter2NamedImport;
	private eventToValue: Map<(value: any) => any, any> = new Map();

	constructor() {
		this.emitter = new EventEmitter2();
	}

	onGateUpdated(
		gateName: string,
		callback: (value: boolean) => void,
		checkGate: (gateName: string, options: CheckGateOptions) => boolean,
		options: CheckGateOptions,
	): () => void {
		const value = checkGate(gateName, { ...options, fireGateExposure: false });
		if (this.eventToValue.get(callback) === undefined) {
			this.eventToValue.set(callback, value);
		}

		const wrapCallback = (): void => {
			const value = checkGate(gateName, { ...options, fireGateExposure: false });
			const existingValue = this.eventToValue.get(callback);
			if (existingValue !== value) {
				this.eventToValue.set(callback, value);
				callback(value);
			}
		};
		this.emitter.on(gateName, wrapCallback);
		return (): void => {
			this.emitter.off(gateName, wrapCallback);
		};
	}

	onExperimentValueUpdated<T>(
		experimentName: string,
		parameterName: string,
		defaultValue: T,
		callback: (value: T) => void,
		getExperimentValue: (
			experimentName: string,
			parameterName: string,
			defaultValue: T,
			options: GetExperimentValueOptions<T>,
		) => T,
		options: GetExperimentValueOptions<T>,
	): () => void {
		const experimentEventName = `${experimentName}.${parameterName}`;

		const value = getExperimentValue(experimentName, parameterName, defaultValue, {
			...options,
			fireExperimentExposure: false,
		});
		if (this.eventToValue.get(callback) === undefined) {
			this.eventToValue.set(callback, value);
		}

		const wrapCallback = (): void => {
			const value = getExperimentValue(experimentName, parameterName, defaultValue, {
				...options,
				fireExperimentExposure: false,
			});
			const existingValue = this.eventToValue.get(callback);
			if (existingValue !== value) {
				this.eventToValue.set(callback, value);
				callback(value);
			}
		};

		this.emitter.on(experimentEventName, wrapCallback);
		return (): void => {
			this.emitter.off(experimentEventName, wrapCallback);
		};
	}

	onAnyUpdated(callback: () => void): () => void {
		this.emitter.on(ALL_FEATURE_VALUES, callback);
		return (): void => {
			this.emitter.off(ALL_FEATURE_VALUES, callback);
		};
	}

	anyUpdated(): void {
		this.emitter.emit(ALL_FEATURE_VALUES);

		this.emitter
			.eventNames()
			.filter((name) => name !== ALL_FEATURE_VALUES)
			.forEach((event) => {
				this.emitter.emit(event);
			});
	}
}
