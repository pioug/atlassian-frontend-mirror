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

const djb2MapKey = (hash: string, kind: keyof LocalOverrides) => kind + ':' + hash;

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
	private _djb2Map: Map<string, LocalOverrides[keyof LocalOverrides][string]>;

	constructor(localStorageKey: string) {
		this._overrides = makeEmptyStore();
		this._djb2Map = new Map();
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
		const storedOverrides = this.mergeOverrides(
			this._overrides,
			this.parseStoredOverrides(LEGACY_LOCAL_STORAGE_KEY),
			this.parseStoredOverrides(this._localStorageKey),
		);

		// Clear data from legacy local storage key now we've read from it.
		// This prevents things being stuck in there that are always read but never written to.
		try {
			window.localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
		} catch {
			// ignored - window is not defined in non-browser environments, and we don't save things there
			// (things like SSR, etc)
		}

		// In version 4.24.0 we introduced hashes in this override adapter, but had a bug which would cause
		// multiple hashes to continue being created. This code here removes these hashes since we've moved
		// to using a more reliable and easier to maintain map in `_djb2Map`.
		for (const container of Object.values(storedOverrides)) {
			const allKeys = new Set(Object.keys(container));
			for (const name of allKeys) {
				const hash = _DJB2(name);
				if (allKeys.has(hash)) {
					delete container[hash];
				}
			}
		}

		this.applyOverrides(storedOverrides);
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
		return this.mergeOverrides(this._overrides);
	}

	protected applyOverrides(overrides: Partial<LocalOverrides>) {
		const newOverrides = { ...makeEmptyStore(), ...overrides };

		this._djb2Map.clear();
		for (const [containerName, container] of Object.entries(newOverrides)) {
			for (const [name, value] of Object.entries(container)) {
				this._djb2Map.set(djb2MapKey(_DJB2(name), containerName as keyof LocalOverrides), value);
			}
		}

		this._overrides = newOverrides;
	}

	setOverrides(overrides: Partial<LocalOverrides>) {
		this.applyOverrides(overrides);
		this.saveOverrides();
	}

	overrideGate(name: string, value: boolean): void {
		this._overrides.gates[name] = value;
		this._djb2Map.set(djb2MapKey(_DJB2(name), 'gates'), value);
		this.saveOverrides();
	}

	removeGateOverride(name: string): void {
		delete this._overrides.gates[name];
		this._djb2Map.delete(djb2MapKey(_DJB2(name), 'gates'));
		this.saveOverrides();
	}

	getGateOverride(current: FeatureGate, _user: StatsigUser): FeatureGate | null {
		const overridden =
			this._overrides.gates[current.name] ?? this._djb2Map.get(djb2MapKey(current.name, 'gates'));
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
		this._djb2Map.set(djb2MapKey(_DJB2(name), 'configs'), value);
		this.saveOverrides();
	}

	removeDynamicConfigOverride(name: string): void {
		delete this._overrides.configs[name];
		this._djb2Map.delete(djb2MapKey(_DJB2(name), 'configs'));
		this.saveOverrides();
	}

	getDynamicConfigOverride(current: DynamicConfig, _user: StatsigUser): DynamicConfig | null {
		return this._getConfigOverride(current, this._overrides.configs);
	}

	overrideExperiment(name: string, value: Record<string, unknown>): void {
		this._overrides.configs[name] = value;
		this._djb2Map.set(djb2MapKey(_DJB2(name), 'configs'), value);
		this.saveOverrides();
	}

	removeExperimentOverride(name: string): void {
		delete this._overrides.configs[name];
		this._djb2Map.delete(djb2MapKey(_DJB2(name), 'configs'));
		this.saveOverrides();
	}

	getExperimentOverride(current: Experiment, _user: StatsigUser): Experiment | null {
		return this._getConfigOverride(current, this._overrides.configs);
	}

	overrideLayer(name: string, value: Record<string, unknown>): void {
		this._overrides.layers[name] = value;
		this._djb2Map.set(djb2MapKey(_DJB2(name), 'layers'), value);
		this.saveOverrides();
	}

	removeLayerOverride(name: string): void {
		delete this._overrides.layers[name];
		this._djb2Map.delete(djb2MapKey(_DJB2(name), 'layers'));
		this.saveOverrides();
	}

	removeAllOverrides(): void {
		this._overrides = makeEmptyStore();
		try {
			window.localStorage.removeItem(this._localStorageKey);
		} catch {
			// ignored - window is not defined in non-browser environments, and we don't save things there
			// (things like SSR, etc)
		}
	}

	getLayerOverride(current: Layer, _user: StatsigUser): Layer | null {
		const overridden =
			this._overrides.layers[current.name] ?? this._djb2Map.get(djb2MapKey(current.name, 'layers'));
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
		const overridden =
			lookup[current.name] ?? this._djb2Map.get(djb2MapKey(current.name, 'configs'));
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
