import type { Experiment } from '@statsig/js-client';

import { migrateEvaluationDetails, migrateSecondaryExposures } from '../utils';

import type { EvaluationDetails } from './types';

export type OnDefaultValueFallback = (
	config: DynamicConfig,
	parameter: string,
	defaultValueType: string,
	valueType: string,
) => void;

// Reference: https://github.com/statsig-io/js-lite/blob/main/src/DynamicConfig.ts
export class DynamicConfig {
	static fromExperiment(experiment: Experiment): DynamicConfig {
		const config = new DynamicConfig(
			experiment.name,
			experiment.value,
			experiment.ruleID,
			migrateEvaluationDetails(experiment.details),
			migrateSecondaryExposures(experiment.__evaluation?.secondary_exposures ?? []),
			experiment.groupName ?? undefined,
		);
		config.experiment = experiment;
		return config;
	}

	public value: Record<string, any>;

	readonly _name: string;
	readonly _ruleID: string;
	/** @deprecated - do not use, this is still exported for backwards compatibility but will be removed in the next major version  */
	readonly _secondaryExposures: Record<string, string>[];
	readonly _allocatedExperimentName: string;
	readonly _evaluationDetails: EvaluationDetails;
	readonly _onDefaultValueFallback: OnDefaultValueFallback | null;

	private experiment?: Experiment;

	constructor(
		configName: string,
		configValue: Record<string, any>,
		ruleID: string,
		evaluationDetails: EvaluationDetails,
		secondaryExposures: Record<string, string>[] = [],
		allocatedExperimentName: string = '',
		onDefaultValueFallback: OnDefaultValueFallback | null = null,
	) {
		this.value = configValue;
		this._name = configName;
		this._ruleID = ruleID;
		this._secondaryExposures = secondaryExposures;
		this._allocatedExperimentName = allocatedExperimentName;
		this._evaluationDetails = evaluationDetails;
		this._onDefaultValueFallback = onDefaultValueFallback;
	}

	public get<T>(key: string, defaultValue: T, typeGuard?: (value: unknown) => value is T): T {
		const val = this.getValue(key, defaultValue);

		if (val == null) {
			return defaultValue;
		}

		const expectedType = Array.isArray(defaultValue) ? 'array' : typeof defaultValue;
		const actualType = Array.isArray(val) ? 'array' : typeof val;

		if (typeGuard) {
			if (typeGuard(val)) {
				this.fireExposure(key);
				return val;
			}

			this._onDefaultValueFallback?.(this, key, expectedType, actualType);
			return defaultValue;
		}

		if (defaultValue == null || expectedType === actualType) {
			this.fireExposure(key);
			return val as unknown as T;
		}

		this._onDefaultValueFallback?.(this, key, expectedType, actualType);
		return defaultValue;
	}

	public getValue(
		key?: string,
		defaultValue?: any | null,
	): boolean | number | string | object | Array<any> | null {
		if (key == null) {
			return this.value;
		}
		if (defaultValue == null) {
			defaultValue = null;
		}
		if (this.value[key] == null) {
			return defaultValue;
		}
		this.fireExposure(key);
		return this.value[key];
	}

	private fireExposure(key: string) {
		// Call the wrapped experiment's get method to fire exposure
		if (this.experiment) {
			this.experiment.get(key);
		}
	}
}
