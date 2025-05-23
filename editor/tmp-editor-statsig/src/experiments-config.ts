/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { ExperimentConfigValue } from './types';
import { createBooleanExperiment, createMultivariateExperiment } from './experiment-builders';

export type EditorExperimentsConfig = typeof editorExperimentsConfig;

/**
 * When adding a new experiment, you need to add it here.
 * Please follow the pattern established in the examples and any
 * existing experiments.
 */
export const editorExperimentsConfig = {
	// Added 2024-08-08
	'example-boolean': createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_editor_experiment_test_new_package_boolean',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-08-08
	'example-multivariate': createMultivariateExperiment({
		productKeys: {
			confluence: 'confluence_editor_experiment_test_new_package_multivariate',
		},
		param: 'variant',
		values: ['one', 'two', 'three'],
		defaultValue: 'one',
	}),
	// Added 2024-08-08
	'test-new-experiments-package': createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_editor_experiment_test_new_package',
			jira: 'jira_editor_experiment_test_new_package',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-09-05
	support_table_in_comment: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_support_table_in_comment_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-09-07
	platform_editor_exp_lazy_node_views: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_exp_lazy_node_views',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-09-18
	platform_renderer_table_sticky_scrollbar: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_renderer_table_sticky_scrollbar',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-10-01
	comment_on_bodied_extensions: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_comment_on_bodied_extensions',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-10-14
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_advanced_layouts/setup
	advanced_layouts: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_advanced_layouts',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-3-15
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_single_column_layout/setup
	single_column_layouts: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_single_column_layout',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-10-08
	support_table_in_comment_jira: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_support_table_in_comment_jira',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	'platform_editor_ai-prompts-placeholder': createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_ai-prompts-placeholder',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// added 2024-11-06
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nested_tables/setup
	'nested-tables-in-tables': createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_nested_tables',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-11-26
	platform_editor_ai_unsplash_page_header: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_unsplash_page_header',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2024-12-05
	platform_editor_blockquote_in_text_formatting_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_blockquote_in_text_formatting_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-01-09
	platform_editor_advanced_code_blocks: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_advanced_code_blocks',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-01-13
	platform_editor_element_drag_and_drop_multiselect: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_element_drag_and_drop_multiselect',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-01-16
	live_pages_graceful_edit: createMultivariateExperiment({
		productKeys: {
			confluence: 'live_pages_graceful_edit',
		},
		param: 'cohort',
		values: ['control', 'text-click-delayed', 'text-click-no-delay', 'initially-hide-toolbar'],
		defaultValue: 'control',
	}),
	// Added 2025-01-19
	platform_editor_ai_edit_response_in_preview: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_edit_response_in_preview',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-02-10
	platform_editor_controls: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_controls',
		},
		param: 'cohort',
		values: ['control', 'variant1'],
		defaultValue: 'control',
	}),
	// Added 28-02-2025
	platform_editor_insertion: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_insertion',
		},
		param: 'cohort',
		values: ['control', 'variant1'],
		defaultValue: 'control',
	}),
	// Added 2025-04-01
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_vanilla_dom/setup
	platform_editor_vanilla_dom: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_vanilla_dom',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-03-13
	editor_text_highlight_orange_to_yellow: createMultivariateExperiment({
		productKeys: {
			confluence: 'editor_text_highlight_orange_to_yellow',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// Added 2025-03-28
	platform_editor_ai_proactive_ai_nudge_parameters: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_proactive_ai_nudge_parameters',
		},
		param: 'cohort',
		values: ['control', 'variant1'],
		defaultValue: 'control',
	}),
	// Added 2025-04-14
	// https://switcheroo.atlassian.com/ui/gates/b159b45a-86d9-4f4b-b482-f9aca5b615d6/key/platform_editor_offline_editing_web
	platform_editor_offline_editing_web: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_offline_editing_web',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-04-14
	editor_ai_inline_suggestion_date_v2: createMultivariateExperiment({
		productKeys: {
			confluence: 'editor_ai_inline_suggestion_date_v2',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// Added 2025-04-17
	platform_editor_tables_drag_and_drop: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_tables_drag_and_drop',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-04-17
	platform_editor_tables_table_selector: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_tables_table_selector',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-04-23
	platform_editor_usesharedpluginstateselector: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_usesharedpluginstateselector',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-04-23
	platform_renderer_fix_analytics_memo_callback: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_renderer_fix_analytics_memo_callback',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-05
	editor_ai_contextual_selection_toolbar_button: createMultivariateExperiment({
		productKeys: {
			confluence: 'editor_ai_contextual_selection_toolbar_button',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// Added 2025-05-08
	editor_ai_converge_free_gen_on_rovo: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_ai_converge_free_gen_on_rovo',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-07
	editor_ai_cmd_palette_remove_retry: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_ai_cmd_palette_remove_retry',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-08
	platform_editor_core_static_emotion: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_core_static_emotion',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-13
	editor_ai_comment_freegen_rovo: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_ai_comment_freegen_rovo',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-15
	confluence_p2m_style_recalc_and_expand_joint_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_p2m_style_recalc_and_expand_joint_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-15
	platform_editor_breakout_resizing: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_breakout_resizing',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-07
	platform_editor_ai_quickstart_command: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_quickstart_command',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
} satisfies Record<string, ExperimentConfigValue>;
