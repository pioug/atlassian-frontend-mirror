import { isBoolean, oneOf } from './type-guards';

export type EditorExperimentsConfig = typeof editorExperimentsConfig;

type EditorExperimentConfigValue = {
	productKeys?: {
		confluence?: string;
		jira?: string;
		test?: string;
	};
	param: string;
	typeGuard: (value: unknown) => boolean;
	defaultValue: boolean | string;
};

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
	// Added 2024-08-27
	'dnd-input-performance-optimisation': {
		productKeys: {
			confluence: 'platform_editor_dnd_input_performance_optimisation',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-08-28
	'element-level-templates': {
		productKeys: {
			confluence: 'platform_editor_element_level_templates',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-08-29
	'add-media-from-url': {
		productKeys: {
			confluence: 'platform_editor_add_media_from_url',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-08-30
	'nested-dnd': {
		productKeys: {
			confluence: 'platform_editor_element_drag_and_drop_nested',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Add 2024-08-27
	'table-nested-dnd': {
		productKeys: {
			confluence: 'platform_editor_elements_dnd_nested_table',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-08-29
	'insert-menu-in-right-rail': {
		productKeys: {
			confluence: 'platform_editor_insert_menu_in_right_rail',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-02
	platform_editor_empty_line_prompt: {
		productKeys: {
			confluence: 'platform_editor_empty_line_prompt',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-05
	support_table_in_comment: {
		productKeys: {
			confluence: 'platform_editor_support_table_in_comment_exp',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-07
	platform_editor_exp_lazy_node_views: {
		productKeys: {
			confluence: 'platform_editor_exp_lazy_node_views',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Add 2024-09-16
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_ai_button_block_elements/setup
	platform_editor_ai_ai_button_block_elements: {
		productKeys: {
			confluence: 'platform_editor_ai_ai_button_block_elements',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 2024-09-18
	platform_renderer_table_sticky_scrollbar: {
		productKeys: {
			confluence: 'platform_renderer_table_sticky_scrollbar',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-18
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nest_media_and_codeblock_in_quotes/setup
	'nest-media-and-codeblock-in-quote': {
		productKeys: {
			confluence: 'platform_editor_nest_media_and_codeblock_in_quotes',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-18
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nest_nested_expand_in_expand/setup
	'nested-expand-in-expand': {
		productKeys: {
			confluence: 'platform_editor_nest_nested_expand_in_expand',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-24
	platform_editor_ai_command_palette_post_ga: {
		productKeys: {
			confluence: 'platform_editor_ai_command_palette_post_ga',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},

	platform_editor_table_use_shared_state_hook: {
		productKeys: {
			confluence: 'platform_editor_table_use_shared_state_hook',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-09-23
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/editor_ai_-_multi_prompts/setup
	'editor_ai_-_multi_prompts': {
		productKeys: {
			confluence: 'editor_ai_-_multi_prompts',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 2024-10-02
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_additional_editor_prompts/setup
	platform_editor_ai_additional_editor_prompts: {
		productKeys: {
			confluence: 'platform_editor_ai_additional_editor_prompts',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 2024-10-01
	comment_on_bodied_extensions: {
		productKeys: {
			confluence: 'platform_editor_comment_on_bodied_extensions',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-10-01
	platform_editor_ai_floating_toolbar_v2: {
		productKeys: {
			confluence: 'platform_editor_ai_floating_toolbar_v2',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'leading', 'trailing']),
		defaultValue: 'control' as 'control' | 'leading' | 'trailing',
	},
	// Added 2024-10-06
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_element_dnd_apply_optimisation
	'optimised-apply-dnd': {
		productKeys: {
			confluence: 'platform_editor_element_dnd_apply_optimisation',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-10-16
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_1p_placeholder_hints/setup
	platform_editor_ai_1p_placeholder_hints: {
		productKeys: {
			confluence: 'platform_editor_ai_1p_placeholder_hints',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'example-placeholders', 'tip-placeholders']),
		defaultValue: 'control' as 'control' | 'example-placeholders' | 'tip-placeholders',
	},
	// Added 2024-10-14
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_advanced_layouts/setup
	advanced_layouts: {
		productKeys: {
			confluence: 'platform_editor_advanced_layouts',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-10-21
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_live_pages_ai_definitions/setup
	platform_editor_live_pages_ai_definitions: {
		productKeys: {
			confluence: 'platform_editor_live_pages_ai_definitions',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 2024-10-08
	support_table_in_comment_jira: {
		productKeys: {
			jira: 'platform_editor_support_table_in_comment_jira',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-10-25
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_comment_on_inline_node_spotlight/setup
	comment_on_inline_node_spotlight: {
		productKeys: {
			confluence: 'platform_editor_comment_on_inline_node_spotlight',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 28-10-2024
	'editor_ai_-_proactive_ai_model_variations': {
		productKeys: {
			confluence: 'editor_ai_-_proactive_ai_model_variations',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'skip_grammar']),
		defaultValue: 'control' as 'control' | 'skip_grammar',
	},
	// Added 2024-10-31
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_refine_response_button/setup
	platform_editor_ai_refine_response_button: {
		productKeys: {
			confluence: 'platform_editor_ai_refine_response_button',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	'editor_ai_-_proactive_ai_spelling_and_grammar': {
		productKeys: {
			confluence: 'editor_ai_-_proactive_ai_spelling_and_grammar',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'default-off', 'default-on']),
		defaultValue: 'control' as 'control' | 'default-off' | 'default-on',
	},
	'platform_editor_ai-prompts-placeholder': {
		productKeys: {
			confluence: 'platform_editor_ai-prompts-placeholder',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	'editor_ai_-_gpt4_experiment': {
		productKeys: {
			confluence: 'editor_ai_-_gpt4_experiment',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'einstein']),
		defaultValue: 'control' as 'control' | 'einstein',
	},
	// Added 2024-11-06
	platform_editor_ai_facepile: {
		productKeys: {
			confluence: 'platform_editor_ai_facepile',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-11-06
	platform_editor_ai_change_tone_floating_toolbar: {
		productKeys: {
			confluence: 'platform_editor_ai_change_tone_floating_toolbar',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
} satisfies Record<string, EditorExperimentConfigValue>;
