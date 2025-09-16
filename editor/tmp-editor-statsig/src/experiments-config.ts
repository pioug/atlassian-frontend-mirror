/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { createBooleanExperiment, createMultivariateExperiment } from './experiment-builders';
import type { ExperimentConfigValue } from './types';

export type EditorExperimentsConfig = typeof editorExperimentsConfig;

/**
 * When adding a new experiment, you need to add it here.
 * Please follow the pattern established in the examples and any
 * existing experiments.
 */
export const editorExperimentsConfig = {
	// Added 2025-05-27
	platform_editor_reduce_noisy_steps_ncs: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_reduce_noisy_steps_ncs',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_memoized_node_check: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_memoized_node_check',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_media_card_vc_wrapper_attribute: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_card_vc_wrapper_attribute',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-24
	editor_prevent_numbered_column_too_big_jira_1: createBooleanExperiment({
		productKeys: {
			jira: 'editor_prevent_numbered_column_too_big_jira_1',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-02
	platform_editor_block_control_optimise_render: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_block_control_optimise_render',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
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

	// Added 2025-05-28
	platform_editor_controls_performance_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_controls_performance_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-26
	platform_editor_prevent_toolbar_layout_shifts: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_prevent_toolbar_layout_shifts',
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
	platform_editor_toolbar_aifc_fix_editor_view: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_fix_editor_view',
			jira: 'platform_editor_toolbar_aifc_fix_editor_view',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-01-13
	platform_editor_element_drag_and_drop_multiselect: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_element_drag_and_drop_multiselect',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-01-19
	platform_editor_ai_edit_response_in_preview: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_edit_response_in_preview',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_toolbar_aifc_toolbar_analytic: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_toolbar_analytic',
			jira: 'platform_editor_toolbar_aifc_toolbar_analytic',
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
	// Added 2025-08-01
	platform_editor_controls_block_controls_state_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_controls_block_controls_state_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-02
	platform_editor_smart_link_cmd_ctrl_click: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_smart_link_cmd_ctrl_click',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-09-03
	platform_editor_hydratable_ui: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_hydratable_ui',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-05-26
	platform_editor_stop_width_reflows: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_stop_width_reflows',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-11
	platform_editor_core_static_emotion_non_central: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_core_static_emotion_non_central',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-10
	platform_editor_no_cursor_on_edit_page_init: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_no_cursor_on_edit_page_init',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-14
	platform_editor_debounce_portal_provider: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_debounce_portal_provider',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-14
	platform_editor_jira_advanced_code_blocks: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_jira_advanced_code_blocks',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-08 - Jira work sync description comment summary
	'jira-work-sync-desc-comment-summary': createBooleanExperiment({
		productKeys: {
			jira: 'jira-work-sync-desc-comment-summary',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-05-21
	platform_editor_nodevisibility: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_nodevisibility',
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
	// Added 2025-05-28
	platform_editor_toolbar_rerender_optimization_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_rerender_optimization_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-05
	platform_editor_block_controls_perf_optimization: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_block_controls_perf_optimization',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-16
	platform_editor_enable_single_player_step_merging: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_enable_single_player_step_merging',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-02
	platform_editor_code_block_fold_gutter: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_code_block_fold_gutter',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-18
	platform_editor_ai_iw_adf_streaming: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_iw_adf_streaming',
		},
		param: 'cohort',
		values: ['control', 'adf_gemini25flash', 'adf_gpt41mini'],
		defaultValue: 'control',
	}),
	// Added 2025-06-18
	platform_editor_ai_ct_sg_adf_streaming: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_ct_sg_adf_streaming',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-20
	platform_editor_ai_non_iw_adf_streaming: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_non_iw_adf_streaming',
		},
		param: 'cohort',
		values: ['control', 'adf_gemini25flash', 'adf_gpt41mini'],
		defaultValue: 'control',
	}),
	// Added 2025-07-07
	platform_editor_ai_remove_trivial_prompts_cc: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_remove_trivial_prompts_cc',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	//Added 2025-07-25
	platform_editor_extension_styles: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_extension_styles',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-20
	confluence_whiteboards_quick_insert_aa: createMultivariateExperiment({
		productKeys: {
			confluence: 'confluence_whiteboards_quick_insert_aa',
		},
		param: 'cohort',
		values: ['control', 'test_blank', 'test_diagram'],
		defaultValue: 'control',
	}),
	// Added 2025-06-24
	platform_editor_find_and_replace_improvements: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_find_and_replace_improvements',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-24
	confluence_whiteboards_quick_insert: createMultivariateExperiment({
		productKeys: {
			confluence: 'confluence_whiteboards_quick_insert',
		},
		param: 'cohort',
		values: ['control', 'test_blank', 'test_diagram'],
		defaultValue: 'control',
	}),
	// added out of order to avoid known conflict that will occur otherwise
	// Added 2025-07-11
	cc_editor_ufo_hold_table_till_resize_complete: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_ufo_hold_table_till_resize_complete',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-06-26
	platform_editor_feedback_mandatory_rating: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_feedback_mandatory_rating',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-30
	platform_editor_drag_handle_aria_label: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_drag_handle_aria_label',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-07
	platform_editor_toggle_expand_on_match_found: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toggle_expand_on_match_found',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_smart_card_otp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_smart_card_otp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-15
	platform_editor_preview_panel_responsiveness: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_preview_panel_responsiveness',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-18
	platform_editor_preview_panel_linking_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_preview_panel_linking_exp_conf',
			jira: 'platform_editor_preview_panel_linking_exp_jira',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-17
	platform_hover_card_preview_panel: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_hover_card_preview_panel',
			jira: 'platform_hover_card_preview_panel',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// Added 2025--8-05
	platform_editor_block_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_block_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-23
	platform_editor_renderer_breakout_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_renderer_breakout_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-24
	editor_enghealth_hyperlink_toolbar_aria_values: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_enghealth_hyperlink_toolbar_aria_values',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-011
	cc_editor_interactions_trigger_traceufointeraction: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_editor_interactions_trigger_traceufointeraction',
		},
		param: 'cohort',
		values: ['control', 'all_events', 'only_mousedown_event'],
		defaultValue: 'control',
	}),
	// Added 2025-07-14
	platform_editor_add_orange_highlight_color: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_add_orange_highlight_color',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	//Added 2025-07-16
	platform_editor_toolbar_aifc: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_toolbar_aifc_jira',
			confluence: 'platform_editor_toolbar_aifc_confluence',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-04
	editor_refactor_backspace_task_and_decisions: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_refactor_backspace_task_and_decisions',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	//Added 2025-07-16
	platform_editor_toolbar_aifc_patch_3: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_toolbar_aifc_patch_3',
			confluence: 'platform_editor_toolbar_aifc_patch_3',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	//Added 2025-09-09
	platform_editor_toolbar_aifc_patch_4: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_toolbar_aifc_patch_4',
			confluence: 'platform_editor_toolbar_aifc_patch_4',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	//Added 2025-08-13
	platform_editor_ai_aifc: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_ai_aifc_jira',
			confluence: 'platform_editor_ai_aifc_confluence',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-29
	platform_editor_toolbar_aifc_selection_extension: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_selection_extension',
			jira: 'platform_editor_toolbar_aifc_selection_extension',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-04
	platform_editor_floating_toolbar_button_aria_label: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_floating_toolbar_button_aria_label',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-24
	platform_editor_enghealth_table_plugin_lable_rule: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_enghealth_table_plugin_lable_rule',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-28
	platform_editor_create_link_on_blur: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_create_link_on_blur',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-29
	cc_comments_include_path_for_renderer_emojis: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_comments_include_path_for_renderer_emojis',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-31
	platform_editor_breakout_interaction_rerender: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_breakout_interaction_rerender',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-27
	platform_editor_toolbar_aifc_responsive: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_responsive',
			jira: 'platform_editor_toolbar_aifc_responsive',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-30
	platform_editor_pasting_nested_table_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_pasting_nested_table_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 20205-07-28
	platform_editor_fix_quick_insert_consistency_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_quick_insert_consistency_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-31
	platform_editor_fix_a11y_aria_posinset_0: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_a11y_aria_posinset_0',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-30
	platform_editor_blocktaskitem_node_tenantid: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_blocktaskitem_node_tenantid',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-08
	platform_editor_blocktaskitem_patch_1: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_blocktaskitem_patch_1',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-06
	cc_editor_limited_mode: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_limited_mode',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-05
	platform_editor_native_anchor_support: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_native_anchor_support',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-05
	platform_editor_tables_scaling_css: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_tables_scaling_css',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-28
	editor_enable_image_alignment_in_expand: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_enable_image_alignment_in_expand',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-05
	platform_editor_august_a11y: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_august_a11y',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-10
	platform_synced_block: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_synced_block',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-06
	cc_improve_writing_on_paste: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_improve_writing_on_paste',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-18
	platform_editor_locale_datepicker: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_locale_datepicker',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-18
	platform_editor_find_replace_a11y_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_find_replace_a11y_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-19
	platform_editor_breakout_resizing_vc90_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_breakout_resizing_vc90_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-29
	platform_editor_toolbar_aifc_exp_code_toggle: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_exp_code_toggle',
			jira: 'platform_editor_toolbar_aifc_exp_code_toggle',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-27
	platform_editor_toolbar_support_custom_components: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_support_custom_components',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-21
	platform_editor_paste_rich_text_bugfix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_paste_rich_text_bugfix',
			jira: 'platform_editor_paste_rich_text_bugfix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-25
	platform_editor_toolbar_aifc_template_editor: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_template_editor',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-26
	platform_editor_toolbar_migrate_loom: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_migrate_loom',
			jira: 'platform_editor_toolbar_migrate_loom',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-16
	platform_editor_prevent_taskitem_remount: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_prevent_taskitem_remount',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-08-26
	platform_editor_toolbar_aifc_patch_1: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_patch_1',
			jira: 'platform_editor_toolbar_aifc_patch_1',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-08
	platform_editor_table_container_width_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_container_width_fix',
			jira: 'platform_editor_table_container_width_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-01
	cc_editor_ai_content_mode: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_editor_ai_content_mode',
		},
		param: 'variant',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// Added 2025-09-01
	platform_editor_toolbar_aifc_patch_2: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_patch_2',
			jira: 'platform_editor_toolbar_aifc_patch_2',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-08
	platform_editor_editor_width_analytics: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_editor_width_analytics',
			jira: 'platform_editor_editor_width_analytics',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-02
	platform_editor_ttvc_nodes_in_viewport: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ttvc_nodes_in_viewport',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-10
	platform_editor_fix_button_name_violation_in_table: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_button_name_violation_in_table',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-11
	platform_editor_quick_insert_image_wrap_right_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_quick_insert_image_wrap_right_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-11
	platform_editor_block_menu_layout_format: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_block_menu_layout_format',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-11
	platform_editor_block_menu_expand_format: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_block_menu_expand_format',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-05
	platform_editor_aifc_selection_toolbar_responsive: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_aifc_selection_toolbar_responsive',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 03-09-2025
	cc_editor_interactivity_monitoring: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_interactivity_monitoring',
			jira: 'cc_editor_interactivity_monitoring',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-11
	platform_editor_add_aria_checked_to_inline_img_btn: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_add_aria_checked_to_inline_image_btn',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-09
	platform_editor_layout_node_view_early_exit: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_layout_node_view_early_exit',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 10-09-2025
	platform_editor_toolbar_task_list_menu_item: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_task_list_menu_item',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-15
	platform_editor_toolbar_aifc_patch_5: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_patch_5',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
} satisfies Record<string, ExperimentConfigValue>;
