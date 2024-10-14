import { EventEmitter2 } from 'eventemitter2';

import { type CheckGateOptions, type GetExperimentValueOptions } from '../client/types';

export const ALL_FEATURE_VALUES = '@all-features';

export default class Subscriptions {
	private emitter: EventEmitter2;
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
