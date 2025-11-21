import type { StatsigClient } from '@statsig/js-client';

import { migrateEvaluationDetails, migrateSecondaryExposures } from '../utils';

import type { EvaluationDetails } from './types';

export type LogParameterFunction = (layer: Layer, parameterName: string) => void;

// Reference: https://github.com/statsig-io/js-lite/blob/main/src/Layer.ts
export class Layer {
	static fromLayer(layer: ReturnType<StatsigClient['getLayer']>) {
		const value = new Layer(
			layer.name,
			layer.__value,
			layer.ruleID,
			migrateEvaluationDetails(layer.details),
			(_layer, parameterName) => layer.get(parameterName),
			migrateSecondaryExposures(layer.__evaluation?.secondary_exposures ?? []),
			migrateSecondaryExposures(layer.__evaluation?.undelegated_secondary_exposures ?? []),
			layer.__evaluation?.allocated_experiment_name,
			layer.__evaluation?.explicit_parameters,
		);
		return value;
	}

	readonly _name: string;
	readonly _value: Record<string, any>;
	readonly _ruleID: string;
	/** @deprecated - do not use, this is still exported for backwards compatibility but will be removed in the next major version  */
	readonly _secondaryExposures: Record<string, string>[];
	/** @deprecated - do not use, this is still exported for backwards compatibility but will be removed in the next major version  */
	readonly _undelegatedSecondaryExposures: Record<string, string>[];
	readonly _allocatedExperimentName: string;
	readonly _explicitParameters: string[];
	readonly _evaluationDetails: EvaluationDetails;
	readonly _logParameterFunction: LogParameterFunction | null;

	private constructor(
		name: string,
		layerValue: Record<string, any>,
		ruleID: string,
		evaluationDetails: EvaluationDetails,
		logParameterFunction: LogParameterFunction | null = null,
		secondaryExposures: Record<string, string>[] = [],
		undelegatedSecondaryExposures: Record<string, string>[] = [],
		allocatedExperimentName: string = '',
		explicitParameters: string[] = [],
	) {
		this._logParameterFunction = logParameterFunction;
		this._name = name;
		this._value = JSON.parse(JSON.stringify(layerValue ?? {}));
		this._ruleID = ruleID ?? '';
		this._evaluationDetails = evaluationDetails;
		this._secondaryExposures = secondaryExposures;
		this._undelegatedSecondaryExposures = undelegatedSecondaryExposures;
		this._allocatedExperimentName = allocatedExperimentName;
		this._explicitParameters = explicitParameters;
	}

	public get<T>(key: string, defaultValue: T, typeGuard?: (value: unknown) => value is T): T {
		const val = this._value[key];

		if (val == null) {
			return defaultValue;
		}

		const logAndReturn = () => {
			this._logLayerParameterExposure(key);
			return val as unknown as T;
		};

		if (typeGuard) {
			return typeGuard(val) ? logAndReturn() : defaultValue;
		}

		if (defaultValue == null) {
			return logAndReturn();
		}

		if (typeof val === typeof defaultValue && Array.isArray(defaultValue) === Array.isArray(val)) {
			return logAndReturn();
		}

		return defaultValue;
	}

	public getValue(
		key: string,
		defaultValue?: any | null,
	): boolean | number | string | object | Array<any> | null {
		// eslint-disable-next-line eqeqeq
		if (defaultValue == undefined) {
			defaultValue = null;
		}

		const val = this._value[key];
		if (val != null) {
			this._logLayerParameterExposure(key);
		}

		return val ?? defaultValue;
	}

	private _logLayerParameterExposure(parameterName: string) {
		this._logParameterFunction?.(this, parameterName);
	}
}
