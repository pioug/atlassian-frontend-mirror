import fs from 'fs';
import path from 'path';

import {
	_DJB2,
	_makeDynamicConfig,
	_makeExperiment,
	_makeFeatureGate,
	_makeLayer,
} from '@statsig/client-core';

import { FilePersistentOverrideAdapter } from '../FilePeristentOverrideAdapter';

// Mock process.emitWarning to prevent warnings during tests
const originalEmitWarning = process.emitWarning;
beforeAll(() => {
	process.emitWarning = jest.fn();
});

afterAll(() => {
	process.emitWarning = originalEmitWarning;
});

describe('FileOverrideAdapter', () => {
	const TEST_FILE_PATH = path.join(__dirname, 'test-overrides.json');
	const user = { userID: 'a-user' };
	const gate = _makeFeatureGate('a_gate', { reason: '' }, null);
	const dynamicConfig = _makeDynamicConfig('a_config', { reason: '' }, null);
	const experiment = _makeExperiment('an_experiment', { reason: '' }, null);
	const layer = _makeLayer('a_layer', { reason: '' }, null);

	// Helper function to safely remove test file or directory
	const safeRemoveTestFile = () => {
		try {
			if (fs.existsSync(TEST_FILE_PATH)) {
				const stats = fs.statSync(TEST_FILE_PATH);
				if (stats.isDirectory()) {
					fs.rmSync(TEST_FILE_PATH, { recursive: true, force: true });
				} else {
					fs.unlinkSync(TEST_FILE_PATH);
				}
			}
		} catch (error) {
			// Silently handle cleanup errors
		}
	};

	beforeEach(() => {
		safeRemoveTestFile();
	});

	afterEach(() => {
		safeRemoveTestFile();
	});

	it('returns overridden gates', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
	});

	it('stores overrides in file system', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.overrideGate(gate.name, true);
		const overridden = provider.getGateOverride(gate, user);
		expect(overridden?.value).toBe(true);
		expect(fs.existsSync(TEST_FILE_PATH)).toBe(true);
		const secondProvider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		secondProvider.initFromStoredOverrides();
		const secondOverridden = secondProvider.getGateOverride(gate, user);
		expect(secondOverridden?.value).toBe(true);
	});

	it('returns overridden dynamic configs', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		const overridden = provider.getDynamicConfigOverride(dynamicConfig, user);
		expect(overridden?.value).toEqual({ dc: 'value' });
		expect(overridden?.get('dc')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns overridden experiment', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		const overridden = provider.getExperimentOverride(experiment, user);
		expect(overridden?.value).toEqual({ exp: 'value' });
		expect(overridden?.get('exp')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns overridden layer', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.overrideLayer(layer.name, { layer_key: 'value' });
		const overridden = provider.getLayerOverride(layer, user);
		expect(overridden?.__value).toEqual({ layer_key: 'value' });
		expect(overridden?.get('layer_key')).toEqual('value');
		expect(overridden?.details.reason).toBe('LocalOverride:Recognized');
	});

	it('returns all overrides', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
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
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.overrideGate(gate.name, true);
		provider.overrideDynamicConfig(dynamicConfig.name, { dc: 'value' });
		provider.overrideExperiment(experiment.name, { exp: 'value' });
		provider.overrideLayer(layer.name, { layer_key: 'value' });
		expect(fs.existsSync(TEST_FILE_PATH)).toBe(true);
		provider.removeAllOverrides();
		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
		expect(fs.existsSync(TEST_FILE_PATH)).toBe(false);
	});

	it('removes single overrides', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		// Test gate removal
		provider.overrideGate('gate_a', true);
		provider.overrideGate('gate_b', true);
		provider.removeGateOverride('gate_a');
		expect(provider.getOverrides().gates).toEqual({ gate_b: true });
		// Test config removal
		provider.overrideDynamicConfig('config_a', { a: 1 });
		provider.overrideDynamicConfig('config_b', { b: 2 });
		provider.removeDynamicConfigOverride('config_a');
		expect(provider.getOverrides().configs).toEqual({
			config_b: { b: 2 },
		});
		// Test experiment removal
		provider.overrideExperiment('exp_a', { a: 1 });
		provider.overrideExperiment('exp_b', { b: 2 });
		provider.removeExperimentOverride('exp_a');
		expect(provider.getOverrides().configs).toEqual({
			config_b: { b: 2 },
			exp_b: { b: 2 },
		});
		// Test layer removal
		provider.overrideLayer('layer_a', { a: 1 });
		provider.overrideLayer('layer_b', { b: 2 });
		provider.removeLayerOverride('layer_a');
		expect(provider.getOverrides().layers).toEqual({
			layer_b: { b: 2 },
		});
	});

	it('should populate all fields if provided object is empty', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.setOverrides({});
		expect(provider.getOverrides()).toEqual({
			gates: {},
			configs: {},
			layers: {},
		});
	});

	it('should support DJB2 hashes when setting overrides', () => {
		const provider = new FilePersistentOverrideAdapter(TEST_FILE_PATH);
		provider.setOverrides({ gates: { foo: true } });
		const result = provider.getGateOverride(
			{
				idType: 'atlassianAccountId',
				name: _DJB2('foo'),
				value: false,
				ruleID: 'asdf',
				details: { reason: 'UNSET' },
				__evaluation: null,
			},
			{},
		);
		expect(result?.value).toBe(true);
	});

	it('should handle file system errors gracefully', () => {
		// Create a directory at the file path to test error handling
		fs.mkdirSync(TEST_FILE_PATH, { recursive: true });

		// Expect an error when trying to use a directory as a file
		expect(() => new FilePersistentOverrideAdapter(TEST_FILE_PATH)).toThrow(
			`Path ${TEST_FILE_PATH} is a directory, but a file is expected`,
		);

		// Cleanup
		fs.rmSync(TEST_FILE_PATH, { recursive: true, force: true });
	});

	it('should create directories if they dont exist', () => {
		const nestedPath = path.join(__dirname, 'nested', 'test-overrides.json');
		const provider = new FilePersistentOverrideAdapter(nestedPath);
		provider.overrideGate('test', true);
		expect(fs.existsSync(nestedPath)).toBe(true);
		// Cleanup
		fs.unlinkSync(nestedPath);
		fs.rmdirSync(path.dirname(nestedPath));
	});
});
