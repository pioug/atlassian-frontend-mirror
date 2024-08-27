function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

function oneOf<T extends string>(values: T[]): (value: unknown) => value is T {
	return (value: unknown): value is T => {
		return values.includes(value as T);
	};
}

export type EditorExperimentsConfig = typeof editorExperimentsConfig;

/**
 * When adding a new experiment, you need to add it here.
 * Please follow the pattern established in the examples and any
 * existing experiments.
 */
export const editorExperimentsConfig = {
	// Added 2024-08-08
	'example-boolean': {
		productKeys: {
			confluence: 'confluence_editor_experiment_test_new_package_boolean',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		// Note -- you need to set the type to boolean for the default value
		defaultValue: false as boolean,
	},
	// Added 2024-08-08
	'example-multivariate': {
		productKeys: {
			confluence: 'confluence_editor_experiment_test_new_package_multivariate',
		},
		param: 'variant',
		typeGuard: oneOf(['one', 'two', 'three']),
		// Note -- you need to specify the type of the default value as the union of all possible values
		// This is used to provide type safety on consumption
		defaultValue: 'one' as 'one' | 'two' | 'three',
	},
	// Added 2024-08-08
	'test-new-experiments-package': {
		productKeys: {
			confluence: 'confluence_editor_experiment_test_new_package',
			jira: 'jira_editor_experiment_test_new_package',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Add 2024-08-14
	'basic-text-transformations': {
		productKeys: {
			confluence: 'platform_editor_basic_text_transformations',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-08-23
	'platform-editor-ai-condensed-floating-toobar': {
		productKeys: {
			confluence: 'platform_editor_ai_condensed_floating_toobar',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-08-27
	'dnd-input-performance-optimisation': {
		productKeys: {
			confluence: 'platform_editor_dnd_input_performance_optimisation',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
};
