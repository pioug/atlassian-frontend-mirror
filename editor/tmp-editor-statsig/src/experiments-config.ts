/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

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
	// Added 2024-10-01
	comment_on_bodied_extensions: {
		productKeys: {
			confluence: 'platform_editor_comment_on_bodied_extensions',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
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
	'platform_editor_ai-prompts-placeholder': {
		productKeys: {
			confluence: 'platform_editor_ai-prompts-placeholder',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// added 2024-11-06
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nested_tables/setup
	'nested-tables-in-tables': {
		productKeys: {
			confluence: 'platform_editor_nested_tables',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// added 2024-11-06
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_mentions_support/setup
	platform_editor_ai_mentions_support: {
		productKeys: {
			confluence: 'platform_editor_ai_mentions_support',
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
	// Added 2024-11-13
	issue_view_action_items: {
		productKeys: {
			jira: 'issue_view_action_items',
		},
		param: 'isActionItemsEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-11-18
	contextual_formatting_toolbar: {
		productKeys: {
			confluence: 'platform_editor_contextual_formatting_toolbar_exp',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-11-19
	platform_editor_ai_1p_smart_link_unfurl_in_prompt: {
		productKeys: {
			confluence: 'platform_editor_ai_1p_smart_link_unfurl_in_prompt',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-11-21
	platform_editor_ai_draft_with_ai: {
		productKeys: {
			confluence: 'platform_editor_ai_draft_with_ai',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-11-26
	platform_editor_ai_unsplash_page_header: {
		productKeys: {
			confluence: 'platform_editor_ai_unsplash_page_header',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	expand_selection_range_to_include_inline_node: {
		productKeys: {
			confluence: 'expand_selection_range_to_include_inline_node',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2024-12-05
	platform_editor_blockquote_in_text_formatting_menu: {
		productKeys: {
			confluence: 'platform_editor_blockquote_in_text_formatting_menu',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
} satisfies Record<string, EditorExperimentConfigValue>;
