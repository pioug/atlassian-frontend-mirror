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
const LEGACY_LOCAL_STORAGE_KEY = 'STATSIG_JS_LITE_LOCAL_OVERRIDES';

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
	private _localStorageKey: string;

	constructor(localStorageKey: string) {
		this._overrides = makeEmptyStore();
		this._localStorageKey = localStorageKey;
	}

	private parseStoredOverrides(localStorageKey: string): LocalOverrides {
		try {
			const json = window.localStorage.getItem(localStorageKey);
			if (!json) {
				return makeEmptyStore();
			}

			return JSON.parse(json);
		} catch {
			return makeEmptyStore();
		}
	}

	private mergeOverrides(...allOverrides: LocalOverrides[]): LocalOverrides {
		const merged = makeEmptyStore();
		for (const overrides of allOverrides) {
			for (const [name, value] of Object.entries(overrides.gates ?? {})) {
				merged.gates[name] = value;
			}

			for (const [name, value] of Object.entries(overrides.configs ?? {})) {
				merged.configs[name] = value;
			}

			for (const [name, value] of Object.entries(overrides.layers ?? {})) {
				merged.layers[name] = value;
			}
		}

		return merged;
	}

	initFromStoredOverrides() {
		this.setOverrides(
			this.mergeOverrides(
				this._overrides,
				this.parseStoredOverrides(LEGACY_LOCAL_STORAGE_KEY),
				this.parseStoredOverrides(this._localStorageKey),
			),
		);
	}

	saveOverrides() {
		try {
			window.localStorage.setItem(this._localStorageKey, JSON.stringify(this._overrides));
		} catch {
			// ignored - window is not defined in non-browser environments, and we don't save things there
			// (things like SSR, etc)
		}
	}

	getOverrides(): LocalOverrides {
		return Object.fromEntries(
			Object.entries(this._overrides).map(([key, container]) => {
				const record: Record<string, any> = {};
				for (const [name, value] of Object.entries(container)) {
					if (Object.prototype.hasOwnProperty.call(container, _DJB2(name))) {
						record[name] = value;
					}
				}

				return [key, record];
			}),
		) as LocalOverrides;
	}

	setOverrides(overrides: Partial<LocalOverrides>) {
		const newOverrides = { ...makeEmptyStore(), ...overrides };

		for (const container of Object.values(newOverrides)) {
			for (const [name, value] of Object.entries(container)) {
				const hash = _DJB2(name);
				if (!Object.prototype.hasOwnProperty.call(container, hash)) {
					container[hash] = value;
				}
			}
		}

		this._overrides = newOverrides;
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
