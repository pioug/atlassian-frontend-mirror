import { _overrides, setupEditorExperiments } from '../setup';

jest.mock('../experiments-config', () => {
	const { isBoolean, oneOf } = jest.requireActual('../type-guards');
	return {
		editorExperimentsConfig: {
			'example-boolean': {
				productKeys: {
					confluence: 'confluence_boolean_example',
				},
				param: 'isEnabled',
				typeGuard: isBoolean,
				defaultValue: false,
			},
			'example-boolean-2': {
				productKeys: {
					confluence: 'confluence_boolean_example_2',
				},
				param: 'isEnabled',
				typeGuard: isBoolean,
				defaultValue: false,
			},
			'example-multivariate': {
				productKeys: {
					confluence: 'confluence_multivariate_example',
				},
				param: 'variation',
				typeGuard: oneOf(['one', 'two', 'three']),
				defaultValue: 'default value' as const,
			},
			'example-multivariate-2': {
				productKeys: {
					confluence: 'confluence_multivariate_example',
				},
				param: 'variation',
				typeGuard: oneOf(['one', 'two', 'three']),
				defaultValue: 'default value' as const,
			},
		},
	};
});

jest.mock('../exp-test-overrides', () => {
	return {
		testMultivariateOverrides: {
			'example-multivariate': 'two',
		},
		// Purposefully doesn't have override for `example-boolean`
		testBooleanOverrides: {
			'example-boolean-2': 'blah',
		},
	};
});

describe('test setup', () => {
	afterEach(() => {
		// Reset override
		// @ts-ignore
		setupEditorExperiments(undefined, {});
	});
	it('should default to true for boolean experiments with NO overrides', () => {
		// Test setup should override with default boolean of true
		setupEditorExperiments('test');
		expect(_overrides).toEqual(expect.objectContaining({ 'example-boolean': true }));
	});

	it('should use file level if no function level overrides', () => {
		// Should use file level instead
		setupEditorExperiments('test', {});
		expect(_overrides).toEqual(expect.objectContaining({ 'example-boolean-2': 'blah' }));
	});

	it('should override all with function level overrides', () => {
		// @ts-expect-error - doesn't exist in main set
		setupEditorExperiments('test', { 'example-boolean-2': false });
		expect(_overrides).toEqual(expect.objectContaining({ 'example-boolean-2': false }));
	});

	it('should use file level for multivariate experiments', () => {
		// Test setup should override with default boolean of true
		setupEditorExperiments('test');
		expect(_overrides).toEqual(expect.objectContaining({ 'example-multivariate': 'two' }));
	});

	it('should override file level for function level for multivariate experiments', () => {
		// Test setup should override with default boolean of true
		setupEditorExperiments('test', { 'example-multivariate': 'three' });
		expect(_overrides).toEqual(expect.objectContaining({ 'example-multivariate': 'three' }));
	});

	it('should use default value if no overrides at all', () => {
		// Test setup should override with default boolean of true
		setupEditorExperiments('test', {});
		expect(_overrides).toEqual(
			expect.objectContaining({ 'example-multivariate-2': 'default value' }),
		);
	});

	it('should use function level override for second multivariate', () => {
		// Test setup should override with default boolean of true
		// @ts-expect-error
		setupEditorExperiments('test', { 'example-multivariate-2': 'one' });
		expect(_overrides).toEqual(expect.objectContaining({ 'example-multivariate-2': 'one' }));
	});

	it('should default to false in production setup without test overrides', () => {
		// Production setup should not override with default boolean of true
		setupEditorExperiments('confluence');
		expect(_overrides).toEqual({});
	});
});
