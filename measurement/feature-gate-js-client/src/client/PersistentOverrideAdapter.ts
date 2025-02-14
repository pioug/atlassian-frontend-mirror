import {
	_DJB2,
	_makeTypedGet,
	type DynamicConfig,
	type Experiment,
	type FeatureGate,
	type Layer,
	type OverrideAdapter,
	type StatsigUser,
} from '@statsig/client-core';

const LOCAL_OVERRIDE_REASON = 'LocalOverride:Recognized';
export const LOCAL_STORAGE_KEY = 'STATSIG_OVERRIDES';

export type LocalOverrides = {
	gates: Record<string, boolean>;
	configs: Record<string, Record<string, unknown>>;
	layers: LocalOverrides['configs'];
};

const makeEmptyStore = (): LocalOverrides => ({
	gates: {},
	configs: {},
	layers: {},
});

/**
 * Custom implementation of `@statsig/js-local-overrides` package with support for local storage
 * so we can keep the existing behavior where overrides are cached locally. Also designed for
 * compatibility with the old override system (eg. no `experiments` field, `configs` is used
 * instead).
 *
 * [Reference](https://github.com/statsig-io/js-client-monorepo/blob/main/packages/js-local-overrides/src/LocalOverrideAdapter.ts)
 */
export class PersistentOverrideAdapter implements OverrideAdapter {
	private _overrides: LocalOverrides;

	constructor() {
		this._overrides = makeEmptyStore();
	}

	initFromStoredOverrides() {
		try {
			const json = window.localStorage.getItem(LOCAL_STORAGE_KEY);
			if (!json) {
				return makeEmptyStore();
			}

			this._overrides = JSON.parse(json);
		} catch {
			this._overrides = makeEmptyStore();
		}
	}

	saveOverrides() {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._overrides));
	}

	getOverrides() {
		return this._overrides;
	}

	setOverrides(overrides: Partial<LocalOverrides>) {
		this._overrides = { ...makeEmptyStore(), ...overrides };
		this.saveOverrides();
	}

	overrideGate(name: string, value: boolean): void {
		this._overrides.gates[name] = value;
		this._overrides.gates[_DJB2(name)] = value;
		this.saveOverrides();
	}

	removeGateOverride(name: string): void {
		delete this._overrides.gates[name];
		delete this._overrides.gates[_DJB2(name)];
		this.saveOverrides();
	}

	getGateOverride(current: FeatureGate, _user: StatsigUser): FeatureGate | null {
		const overridden =
			this._overrides.gates[current.name] ?? this._overrides.gates[_DJB2(current.name)];
		if (overridden == null) {
			return null;
		}

		return {
			...current,
			value: overridden,
			details: { ...current.details, reason: LOCAL_OVERRIDE_REASON },
		};
	}

	overrideDynamicConfig(name: string, value: Record<string, unknown>): void {
		this._overrides.configs[name] = value;
		this._overrides.configs[_DJB2(name)] = value;
		this.saveOverrides();
	}

	removeDynamicConfigOverride(name: string): void {
		delete this._overrides.configs[name];
		delete this._overrides.configs[_DJB2(name)];
		this.saveOverrides();
	}

	getDynamicConfigOverride(current: DynamicConfig, _user: StatsigUser): DynamicConfig | null {
		return this._getConfigOverride(current, this._overrides.configs);
	}

	overrideExperiment(name: string, value: Record<string, unknown>): void {
		this._overrides.configs[name] = value;
		this._overrides.configs[_DJB2(name)] = value;
		this.saveOverrides();
	}

	removeExperimentOverride(name: string): void {
		delete this._overrides.configs[name];
		delete this._overrides.configs[_DJB2(name)];
		this.saveOverrides();
	}

	getExperimentOverride(current: Experiment, _user: StatsigUser): Experiment | null {
		return this._getConfigOverride(current, this._overrides.configs);
	}

	overrideLayer(name: string, value: Record<string, unknown>): void {
		this._overrides.layers[name] = value;
		this._overrides.layers[_DJB2(name)] = value;
		this.saveOverrides();
	}

	removeLayerOverride(name: string): void {
		delete this._overrides.layers[name];
		delete this._overrides.layers[_DJB2(name)];
		this.saveOverrides();
	}

	getAllOverrides(): LocalOverrides {
		return JSON.parse(JSON.stringify(this._overrides)) as LocalOverrides;
	}

	removeAllOverrides(): void {
		this._overrides = makeEmptyStore();
		window.localStorage.removeItem(LOCAL_STORAGE_KEY);
	}

	getLayerOverride(current: Layer, _user: StatsigUser): Layer | null {
		const overridden =
			this._overrides.layers[current.name] ?? this._overrides.layers[_DJB2(current.name)];
		if (overridden == null) {
			return null;
		}

		return {
			...current,
			__value: overridden,
			get: _makeTypedGet(current.name, overridden),
			details: { ...current.details, reason: LOCAL_OVERRIDE_REASON },
		};
	}

	private _getConfigOverride<T extends Experiment | DynamicConfig>(
		current: T,
		lookup: Record<string, Record<string, unknown>>,
	): T | null {
		const overridden = lookup[current.name] ?? lookup[_DJB2(current.name)];
		if (overridden == null) {
			return null;
		}

		return {
			...current,
			value: overridden,
			get: _makeTypedGet(current.name, overridden),
			details: { ...current.details, reason: LOCAL_OVERRIDE_REASON },
		};
	}
}
