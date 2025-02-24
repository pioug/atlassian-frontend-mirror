import {
	_DJB2,
	_makeDynamicConfig,
	_makeExperiment,
	_makeFeatureGate,
	_makeLayer,
} from '@statsig/client-core';

import { LOCAL_STORAGE_KEY, PersistentOverrideAdapter } from '../PersistentOverrideAdapter';

describe('PersistentOverrideAdapter', () => {
	const user = { userID: 'a-user' };
	const gate = _makeFeatureGate('a_gate', { reason: '' }, null);
	const dynamicConfig = _makeDynamicConfig('a_config', { reason: '' }, null);
	const experiment = _makeExperiment('an_experiment', { reason: '' }, null);
	const layer = _makeLayer('a_layer', { reason: '' }, null);

	afterEach(() => {
		window.localStorage.removeItem(LOCAL_STORAGE_KEY);
	});

	it('returns overidden gates', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
	});

	it('stores overrides in local storage', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeTruthy();

		const secondProvider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		secondProvider.initFromStoredOverrides();
		const secondOverridden = secondProvider.getGateOverride(gate, user);
		expect(secondOverridden?.value).toBe(true);
	});

	it('returns overidden gates', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeTruthy();
	});

	it('returns overidden dynamic configs', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		const overridden = provider.getDynamicConfigOverride(dynamicConfig, user);
		expect(overridden?.value).toEqual({ dc: 'value' });
		expect(overridden?.get('dc')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns overidden experiment', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		const overridden = provider.getExperimentOverride(experiment, user);
		expect(overridden?.value).toEqual({ exp: 'value' });
		expect(overridden?.get('exp')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns overidden layer', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideLayer(layer.name, { layer_key: 'value' });
		const overridden = provider.getLayerOverride(layer, user);
		expect(overridden?.__value).toEqual({ layer_key: 'value' });
		expect(overridden?.get('layer_key')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns null for unrecognized overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.removeAllOverrides();

		const overriddenGate = provider.getGateOverride(gate, user);

		const overriddenDynamicConfig = provider.getDynamicConfigOverride(dynamicConfig, user);

		const overriddenExperiment = provider.getExperimentOverride(experiment, user);

		const overriddenLayer = provider.getLayerOverride(layer, user);

		expect(overriddenGate).toBeNull();
		expect(overriddenDynamicConfig).toBeNull();
		expect(overriddenExperiment).toBeNull();
		expect(overriddenLayer).toBeNull();
	});

	it('returns all overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate(gate.name, true);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		provider.overrideLayer(layer.name, { layer_key: 'value' });

		expect(provider.getOverrides()).toEqual({
			gates: { a_gate: true },
			configs: {
				a_config: { dc: 'value' },
				an_experiment: { exp: 'value' },
			},
			layers: {
				a_layer: { layer_key: 'value' },
			},
		});
	});

	it('removes all overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate(gate.name, true);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		provider.overrideLayer(layer.name, { layer_key: 'value' });
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeTruthy();

		provider.removeAllOverrides();

		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(null);
	});

	it('removes single gate overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate('gate_a', true);
		provider.overrideGate('gate_b', true);

		provider.removeGateOverride('gate_a');

		expect(provider.getOverrides().gates).toEqual({
			gate_b: true,
		});
	});

	it('removes single dynamic config overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideDynamicConfig('config_a', { a: 1 });
		provider.overrideDynamicConfig('config_b', { b: 2 });

		provider.removeDynamicConfigOverride('config_a');

		expect(provider.getOverrides().configs).toEqual({
			config_b: { b: 2 },
		});
	});

	it('removes single experiment overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideExperiment('experiment_a', { a: 1 });
		provider.overrideExperiment('experiment_b', { b: 2 });

		provider.removeExperimentOverride('experiment_a');

		expect(provider.getOverrides().configs).toEqual({
			experiment_b: { b: 2 },
		});
	});

	it('removes single layer overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideLayer('layer_a', { a: 1 });
		provider.overrideLayer('layer_b', { b: 2 });

		provider.removeLayerOverride('layer_a');

		expect(provider.getOverrides().layers).toEqual({
			layer_b: { b: 2 },
		});
	});

	it('should populate all of the fields if the provided object is empty', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.setOverrides({});
		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should populate the "configs" field if it is missing from the provided overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.setOverrides({
			gates: {},
			layers: {},
		});
		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should populate the "gates" field if it is missing from the provided overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.setOverrides({
			configs: {},
			layers: {},
		});
		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should populate the "layers" field if it is missing from the provided overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.setOverrides({
			gates: {},
			configs: {},
		});
		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should not return hashes when getting all overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate('gate1', true);
		provider.overrideLayer('layer1', { param: true });
		provider.overrideDynamicConfig('config1', { field: true });
		expect(provider.getOverrides()).toEqual({
			gates: {
				gate1: true,
			},
			configs: {
				config1: {
					field: true,
				},
			},
			layers: {
				layer1: {
					param: true,
				},
			},
		});
	});

	it('should inject hashes when setting all overrides', () => {
		const provider = new PersistentOverrideAdapter(LOCAL_STORAGE_KEY);
		provider.overrideGate('gate1', true);
		provider.overrideLayer('layer1', { param: true });
		provider.overrideDynamicConfig('config1', { field: true });
		expect(provider['_overrides']).toEqual({
			gates: {
				gate1: true,
				'98127046': true,
			},
			configs: {
				config1: {
					field: true,
				},
				'951117103': {
					field: true,
				},
			},
			layers: {
				layer1: {
					param: true,
				},
				'3185235200': {
					param: true,
				},
			},
		});
	});
});
