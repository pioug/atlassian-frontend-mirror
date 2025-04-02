/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { isBoolean, oneOf } from './type-guards';
import { ExperimentConfigValue } from './types';

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
	// Added 2024-08-30
	'nested-dnd': {
		productKeys: {
			confluence: 'platform_editor_element_drag_and_drop_nested',
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
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nest_nested_expand_in_expand/setup
	'nested-expand-in-expand': {
		productKeys: {
			confluence: 'platform_editor_nest_nested_expand_in_expand',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
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
	// Added 2025-3-15
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_single_column_layout/setup
	single_column_layouts: {
		productKeys: {
			confluence: 'platform_editor_single_column_layout',
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
	// Added 2025-01-09
	platform_editor_advanced_code_blocks: {
		productKeys: {
			confluence: 'platform_editor_advanced_code_blocks',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2025-01-13
	platform_editor_element_drag_and_drop_multiselect: {
		productKeys: {
			confluence: 'platform_editor_element_drag_and_drop_multiselect',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2025-01-16
	live_pages_graceful_edit: {
		productKeys: {
			confluence: 'live_pages_graceful_edit',
		},
		param: 'cohort',
		typeGuard: oneOf([
			'control',
			'text-click-delayed',
			'text-click-no-delay',
			'initially-hide-toolbar',
		]),
		defaultValue: 'control' as
			| 'control'
			| 'text-click-delayed'
			| 'text-click-no-delay'
			| 'initially-hide-toolbar',
	},
	// Added 2025-01-19
	platform_editor_ai_edit_response_in_preview: {
		productKeys: {
			confluence: 'platform_editor_ai_edit_response_in_preview',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2025-02-10
	platform_editor_controls: {
		productKeys: {
			confluence: 'platform_editor_controls',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'variant1']),
		defaultValue: 'control' as 'control' | 'variant1',
	},
	// Added 2025-02-18
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nested_non_bodied_macros/setup
	platform_editor_nested_non_bodied_macros: {
		productKeys: {
			confluence: 'platform_editor_nested_non_bodied_macros',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 2025-02-24
	editor_ai_inline_suggestion_date: {
		productKeys: {
			confluence: 'editor_ai_inline_suggestion_date',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 28-02-2025
	platform_editor_insertion: {
		productKeys: {
			confluence: 'platform_editor_insertion',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'variant1']),
		defaultValue: 'control' as 'control' | 'variant1',
	},
	// Added 2025-02-25
	platform_editor_inline_node_virtualization: {
		productKeys: {
			confluence: 'platform_editor_inline_node_virtualization',
		},
		param: 'variant',
		typeGuard: oneOf(['off', 'fallback-small', 'fallback-large']),
		defaultValue: 'off' as 'off' | 'fallback-small' | 'fallback-large',
	},
	// Added 2025-04-01
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_vanilla_dom/setup
	platform_editor_vanilla_dom: {
		productKeys: {
			confluence: 'platform_editor_vanilla_dom',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
	// Added 2025-03-13
	editor_text_highlight_orange_to_yellow: {
		productKeys: {
			confluence: 'editor_text_highlight_orange_to_yellow',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'test']),
		defaultValue: 'control' as 'control' | 'test',
	},
	// Added 2025-03-28
	platform_editor_ai_proactive_ai_nudge_score: {
		productKeys: {
			confluence: 'platform_editor_ai_proactive_ai_nudge_score',
		},
		param: 'cohort',
		typeGuard: oneOf(['control', 'variant1']),
		defaultValue: 'control' as 'control' | 'variant1',
	},
	// Added 2025-03-26
	platform_editor_markdown_next_media_plugin_exp: {
		productKeys: {
			confluence: 'platform_editor_markdown_next_media_plugin_exp',
		},
		param: 'isEnabled',
		typeGuard: isBoolean,
		defaultValue: false as boolean,
	},
} satisfies Record<string, ExperimentConfigValue>;
