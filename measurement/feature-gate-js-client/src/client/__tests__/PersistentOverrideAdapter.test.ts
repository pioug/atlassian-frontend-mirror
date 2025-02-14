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
		const provider = new PersistentOverrideAdapter();
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
	});

	it('stores overrides in local storage', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeTruthy();

		const secondProvider = new PersistentOverrideAdapter();
		secondProvider.initFromStoredOverrides();
		const secondOverridden = secondProvider.getGateOverride(gate, user);
		expect(secondOverridden?.value).toBe(true);
	});

	it('returns overidden gates', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeTruthy();
	});

	it('returns overidden dynamic configs', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		const overridden = provider.getDynamicConfigOverride(dynamicConfig, user);
		expect(overridden?.value).toEqual({ dc: 'value' });
		expect(overridden?.get('dc')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns overidden experiment', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		const overridden = provider.getExperimentOverride(experiment, user);
		expect(overridden?.value).toEqual({ exp: 'value' });
		expect(overridden?.get('exp')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns overidden layer', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideLayer(layer.name, { layer_key: 'value' });
		const overridden = provider.getLayerOverride(layer, user);
		expect(overridden?.__value).toEqual({ layer_key: 'value' });
		expect(overridden?.get('layer_key')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns null for unrecognized overrides', () => {
		const provider = new PersistentOverrideAdapter();
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
		const provider = new PersistentOverrideAdapter();
		provider.overrideGate(gate.name, true);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		provider.overrideLayer(layer.name, { layer_key: 'value' });

		expect(provider.getAllOverrides()).toEqual({
			gates: { a_gate: true, '2867927529': true },
			configs: {
				a_config: { dc: 'value' },
				'2902556896': {
					dc: 'value',
				},
				an_experiment: { exp: 'value' },
				'3921852239': { exp: 'value' },
			},
			layers: {
				a_layer: { layer_key: 'value' },
				'3011030003': { layer_key: 'value' },
			},
		});
	});

	it('removes all overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideGate(gate.name, true);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		provider.overrideLayer(layer.name, { layer_key: 'value' });
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeTruthy();

		provider.removeAllOverrides();

		expect(provider.getAllOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
		expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(null);
	});

	it('removes single gate overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideGate('gate_a', true);
		provider.overrideGate('gate_b', true);

		provider.removeGateOverride('gate_a');

		expect(provider.getAllOverrides().gates).toEqual({
			gate_b: true,
			[_DJB2('gate_b')]: true,
		});
	});

	it('removes single dynamic config overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideDynamicConfig('config_a', { a: 1 });
		provider.overrideDynamicConfig('config_b', { b: 2 });

		provider.removeDynamicConfigOverride('config_a');

		expect(provider.getAllOverrides().configs).toEqual({
			config_b: { b: 2 },
			[_DJB2('config_b')]: { b: 2 },
		});
	});

	it('removes single experiment overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideExperiment('experiment_a', { a: 1 });
		provider.overrideExperiment('experiment_b', { b: 2 });

		provider.removeExperimentOverride('experiment_a');

		expect(provider.getAllOverrides().configs).toEqual({
			experiment_b: { b: 2 },
			[_DJB2('experiment_b')]: { b: 2 },
		});
	});

	it('removes single layer overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.overrideLayer('layer_a', { a: 1 });
		provider.overrideLayer('layer_b', { b: 2 });

		provider.removeLayerOverride('layer_a');

		expect(provider.getAllOverrides().layers).toEqual({
			layer_b: { b: 2 },
			[_DJB2('layer_b')]: { b: 2 },
		});
	});

	it('should populate all of the fields if the provided object is empty', () => {
		const provider = new PersistentOverrideAdapter();
		provider.setOverrides({});
		expect(provider.getAllOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should populate the "configs" field if it is missing from the provided overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.setOverrides({
			gates: {},
			layers: {},
		});
		expect(provider.getAllOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should populate the "gates" field if it is missing from the provided overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.setOverrides({
			configs: {},
			layers: {},
		});
		expect(provider.getAllOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should populate the "layers" field if it is missing from the provided overrides', () => {
		const provider = new PersistentOverrideAdapter();
		provider.setOverrides({
			gates: {},
			configs: {},
		});
		expect(provider.getAllOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});
});
