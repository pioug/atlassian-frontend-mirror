/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { createBooleanExperiment, createMultivariateExperiment } from './experiment-builders';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Need value import for typeof
import { isBoolean } from './type-guards';
import type { ExperimentConfigValue, ProductKeys } from './types';

type IsBooleanType = typeof isBoolean;

export type EditorExperimentsConfig = typeof editorExperimentsConfig;

/**
 * Extract valid expected values.
 * - For multivariate experiments: returns union of valid string values (inferred from defaultValue type)
 * - For boolean experiments: returns only 'true' literal (cannot use 'false' as expected value)
 */
export type ExperimentExpectedValue<ExperimentName extends keyof EditorExperimentsConfig> =
	EditorExperimentsConfig[ExperimentName]['defaultValue'] extends boolean
		? true // Boolean: only 'true' is allowed as expected value
		: EditorExperimentsConfig[ExperimentName]['defaultValue']; // Multivariate: use the default value type

/**
 * Extract valid default values.
 * - For boolean experiments: returns only 'false' literal (cannot use 'true' as default value)
 * - For multivariate experiments: returns the default value type (one of the string values)
 */
export type ExperimentDefaultValue<ExperimentName extends keyof EditorExperimentsConfig> =
	EditorExperimentsConfig[ExperimentName]['defaultValue'] extends boolean
		? false // Boolean: only 'false' is allowed as default value
		: EditorExperimentsConfig[ExperimentName]['defaultValue']; // Multivariate: use the default value type

/**
 * When adding a new experiment, you need to add it here.
 * Please follow the pattern established in the examples and any
 * existing experiments.
 */
export const editorExperimentsConfig: {
	// Added 2024-10-14
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_advanced_layouts/setup
	advanced_layouts: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-01
	cc_editor_ai_content_mode: {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 2025-12-09
	cc_editor_hover_link_overlay_css_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	cc_editor_insm_doc_size_stats: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_blockquote_zero_padding: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-30
	cc_editor_insm_outlier_events: {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 03-09-2025
	cc_editor_interactivity_monitoring: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-06
	cc_editor_limited_mode: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// new format to avoid collisions with other users when updating the file
	// Editor Platform experiments
	// lwoollard experiments
	// Added 22-12-2025
	confluence_load_editor_title_on_transition: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 02-12-2025
	cc_fix_hydration_ttvc: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 03-09-2025
	cc_editor_limited_mode_include_lcm: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-23
	cc_editor_ttvc_release_bundle_one: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-10-01
	comment_on_bodied_extensions: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-29
	company_hub_deprecate_atlaskit_onboarding: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-20
	'company-hub-config-panel-keyboard-nav': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_fix_emoji_paste_html: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Addded 2025-12-04
	confluence_compact_text_format: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-05
	'company_hub_carousel_thumbnails-refactor': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-24
	confluence_whiteboards_quick_insert: {
		defaultValue: 'control' | 'test_blank' | 'test_diagram';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test_blank' | 'test_diagram';
		values: ('control' | 'test_blank' | 'test_diagram')[];
	};
	// Added 2025-10-20
	confluence_whiteboards_quick_insert_localised: {
		defaultValue: 'control' | 'test_blank' | 'test_diagram';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test_blank' | 'test_diagram';
		values: ('control' | 'test_blank' | 'test_diagram')[];
	};
	// Added 2025-10-28
	confluence_whiteboards_quick_insert_localised_aa: {
		defaultValue: 'control' | 'test_diagram';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test_diagram';
		values: ('control' | 'test_diagram')[];
	};
	// Added 2025-08-28
	editor_enable_image_alignment_in_expand: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-24
	editor_enghealth_hyperlink_toolbar_aria_values: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-24
	editor_prevent_numbered_column_too_big_jira_1: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-04
	editor_refactor_backspace_task_and_decisions: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-03
	editor_tinymce_full_width_mode: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-10
	confluence_max_width_content_appearance: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-08-08
	'example-boolean': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	}; // Added 2024-08-08
	'example-multivariate': {
		defaultValue: 'one' | 'two' | 'three';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'one' | 'two' | 'three';
		values: ('one' | 'two' | 'three')[];
	};
	// Added 2025-07-08 - Jira work sync description comment summary
	'jira-work-sync-desc-comment-summary': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// added 2024-11-06
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_nested_tables/setup
	'nested-tables-in-tables': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-11
	platform_editor_add_aria_checked_to_inline_img_btn: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-14
	platform_editor_add_orange_highlight_color: {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 2025-01-19
	platform_editor_ai_edit_response_in_preview: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-18
	platform_editor_ai_iw_adf_streaming: {
		defaultValue: 'control' | 'adf_gemini25flash' | 'adf_gpt41mini';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'adf_gemini25flash' | 'adf_gpt41mini';
		values: ('control' | 'adf_gemini25flash' | 'adf_gpt41mini')[];
	};
	// Added 2025-08-20
	platform_editor_ai_non_iw_adf_streaming: {
		defaultValue: 'control' | 'adf_gemini25flash' | 'adf_gpt41mini';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'adf_gemini25flash' | 'adf_gpt41mini';
		values: ('control' | 'adf_gemini25flash' | 'adf_gpt41mini')[];
	};
	// Added 2025-05-07
	platform_editor_ai_quickstart_command: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-11-26
	platform_editor_ai_unsplash_page_header: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	'platform_editor_ai-prompts-placeholder': {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 2025-11-20
	platform_editor_annotations_sync_on_docchange: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-05
	platform_editor_august_a11y: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-02
	platform_editor_block_control_optimise_render: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-05
	platform_editor_block_controls_perf_optimization: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025--8-05
	platform_editor_block_menu: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-12-05
	platform_editor_blockquote_in_text_formatting_menu: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-30
	platform_editor_blocktaskitem_node_tenantid: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-08
	platform_editor_blocktaskitem_patch_1: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-31
	platform_editor_breakout_interaction_rerender: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-05-15
	platform_editor_breakout_resizing: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-19
	platform_editor_breakout_resizing_vc90_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-02
	platform_editor_code_block_fold_gutter: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-02-10
	platform_editor_controls: {
		defaultValue: 'control' | 'variant1';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'variant1';
		values: ('control' | 'variant1')[];
	};
	// Added 2025-08-01
	platform_editor_controls_block_controls_state_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-14
	platform_editor_debounce_portal_provider: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-04
	platform_editor_disable_lazy_load_media: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-30
	platform_editor_drag_handle_aria_label: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-08
	platform_editor_editor_width_analytics: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-01-13
	platform_editor_element_drag_and_drop_multiselect: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-16
	platform_editor_enable_single_player_step_merging: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-09-07
	platform_editor_exp_lazy_node_views: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	}; // Added 2025-10-10
	platform_editor_experience_tracking: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	//Added 2025-07-25
	platform_editor_extension_styles: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-26
	platform_editor_feedback_mandatory_rating: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-24
	platform_editor_find_and_replace_improvements: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-10
	platform_editor_fix_button_name_violation_in_table: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 20205-07-28
	platform_editor_fix_quick_insert_consistency_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-04
	platform_editor_floating_toolbar_button_aria_label: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-10
	platform_editor_hoverlink_ui_fixes_exp: {
		defaultValue: 'control' | 'css_changes_only' | 'css_js_changes';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'css_changes_only' | 'css_js_changes';
		values: ('control' | 'css_changes_only' | 'css_js_changes')[];
	};
	// Added 2025-09-03
	platform_editor_hydratable_ui: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-18
	platform_editor_locale_datepicker: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-05
	platform_editor_lovability_emoji_scaling: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-29
	platform_editor_lovability_inline_code: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-19
	platform_editor_lovability_navigation_fixes: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-31
	platform_editor_lovability_suppress_toolbar_event: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-24
	platform_editor_lovability_user_intent: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-13
	platform_editor_media_error_analytics: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-12
	platform_editor_media_vc_fixes: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-05
	platform_editor_native_anchor_with_dnd: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_native_expand_button: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-16
	platform_editor_nested_table_refresh_width_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-06-10
	platform_editor_no_cursor_on_edit_page_init: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-01
	platform_editor_no_state_plugin_injection_api: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-04-14
	// https://switcheroo.atlassian.com/ui/gates/b159b45a-86d9-4f4b-b482-f9aca5b615d6/key/platform_editor_offline_editing_web
	platform_editor_offline_editing_web: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	}; //Added 2025-11-19
	platform_editor_pasting_text_in_panel: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-07
	platform_editor_plain_text_support: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-16
	platform_editor_prevent_taskitem_remount: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-05-26
	platform_editor_prevent_toolbar_layout_shifts: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-18
	platform_editor_preview_panel_linking_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-15
	platform_editor_preview_panel_responsiveness: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-11
	platform_editor_quick_insert_image_wrap_right_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-05-27
	platform_editor_reduce_noisy_steps_ncs: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-22
	platform_editor_remove_bidi_char_warning: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-25
	platform_editor_remove_ncsstepmetrics_plugin: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-17
	platform_editor_renderer_extension_width_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-26
	platform_editor_resizer_styles_cleanup: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	editor_fix_embed_width_expand: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_ssr_renderer: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-05-26
	platform_editor_stop_width_reflows: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-27
	platform_editor_table_sticky_header_improvements: {
		defaultValue: 'control' | 'test_with_overflow' | 'test_without_overflow';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (
			value: unknown,
		) => value is 'control' | 'test_with_overflow' | 'test_without_overflow';
		values: ('control' | 'test_with_overflow' | 'test_without_overflow')[];
	};
	// Added 2025-04-17
	platform_editor_tables_drag_and_drop: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-04-17
	platform_editor_tables_table_selector: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-15
	platform_editor_text_highlight_padding: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-07-07
	platform_editor_toggle_expand_on_match_found: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	//Added 2025-07-16
	platform_editor_toolbar_aifc: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	//Added 2025-07-16
	platform_editor_toolbar_aifc_patch_3: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	//Added 2025-09-09
	platform_editor_toolbar_aifc_patch_4: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-26
	platform_editor_toolbar_aifc_patch_6: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-27
	platform_editor_toolbar_aifc_responsive: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-25
	platform_editor_toolbar_aifc_template_editor: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-04-23
	platform_editor_usesharedpluginstateselector: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-05
	platform_editor_table_update_table_ref: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-10
	platform_editor_task_item_styles: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-18
	platform_editor_wait_for_space_after_ascii_emoji: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-08
	platform_editor_add_image_editing: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-08
	platform_editor_table_toolbar_perf_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-17
	platform_hover_card_preview_panel: {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 2025-09-17
	platform_hover_card_preview_panel_modal: {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 2025-10-01
	platform_inline_smartcard_connect_button_exp: {
		defaultValue: 'control' | 'test1' | 'test2';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test1' | 'test2';
		values: ('control' | 'test1' | 'test2')[];
	};
	// Added 2025-04-23
	platform_renderer_fix_analytics_memo_callback: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-09-18
	platform_renderer_table_sticky_scrollbar: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-27
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_sl_3p_unauth_paste_as_block_card/setup
	platform_sl_3p_unauth_paste_as_block_card: {
		defaultValue: 'control' | 'card_by_default_only' | 'card_by_default_and_new_design';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (
			value: unknown,
		) => value is 'control' | 'card_by_default_only' | 'card_by_default_and_new_design';
		values: ('control' | 'card_by_default_only' | 'card_by_default_and_new_design')[];
	};
	// Added 2025-08-10
	platform_synced_block: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-30
	platform_editor_table_sticky_header_patch_9: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-10-10
	platform_use_llm_space_recommendations: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-3-15
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_single_column_layout/setup
	single_column_layouts: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-07
	platform_editor_table_sticky_header_patch_10: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-11-25
	smart_link_confluence_short_link_analytics: {
		defaultValue: 'control' | 'test';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'test';
		values: ('control' | 'test')[];
	};
	// Added 2024-09-05
	support_table_in_comment: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-10-08
	support_table_in_comment_jira: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-03-12
	platform_editor_use_pmr_for_collab_presence_non_ic: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-03-12
	platform_editor_use_pmr_for_collab_presence_in_ic: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2024-08-08
	'test-new-experiments-package': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-08
	platform_editor_reduce_toolbar_vc_impact: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_toolbar_delay_render_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-03-12
	platform_editor_nested_media_selection_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-04
	platform_editor_scroll_gutter_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-15
	platform_editor_ai_exp_inline_date_year_refresh: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-15
	platform_editor_ai_exp_suggestion_date_comma_delim: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_sel_toolbar_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-22
	platform_editor_localid_ime_composition_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-18
	platform_synced_blocks_offline_check_for_block: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-12-22
	platform_editor_sample_renderer_rendered_event: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-12
	platform_editor_table_sticky_header_patch_11: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
} = {
	// new format to avoid collisions with other users when updating the file

	// Editor Platform experiments
	// lwoollard experiments

	// Added 22-12-2025
	confluence_load_editor_title_on_transition: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_load_editor_title_on_transition',
		},
		param: 'contentPlaceholder',
		defaultValue: false,
	}),
	// Added 02-12-2025
	cc_fix_hydration_ttvc: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_fix_hydration_ttvc',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 03-09-2025
	cc_editor_limited_mode_include_lcm: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_limited_mode_include_lcm',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 03-09-2025
	cc_editor_interactivity_monitoring: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_interactivity_monitoring',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-11-03
	editor_tinymce_full_width_mode: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_tinymce_full_width_mode',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-10
	confluence_max_width_content_appearance: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_max_width_content_appearance',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	cc_editor_insm_doc_size_stats: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_insm_doc_size_stats',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-30
	cc_editor_insm_outlier_events: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_editor_insm_outlier_events',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),

	// Added 2025-12-09
	cc_editor_hover_link_overlay_css_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_hover_link_overlay_css_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-7
	platform_editor_table_sticky_header_patch_10: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_sticky_header_patch_10',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-11-17
	platform_editor_renderer_extension_width_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_renderer_extension_width_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-11-26
	platform_editor_resizer_styles_cleanup: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_resizer_styles_cleanup',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-11-12
	platform_editor_media_vc_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_vc_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-11-20
	platform_editor_annotations_sync_on_docchange: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_annotations_sync_on_docchange',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-05-27
	platform_editor_reduce_noisy_steps_ncs: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_reduce_noisy_steps_ncs',
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
	// Added 2025-11-20
	'company-hub-config-panel-keyboard-nav': createBooleanExperiment({
		productKeys: {
			confluence: 'company-hub-config-panel-keyboard-nav',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-05
	'company_hub_carousel_thumbnails-refactor': createBooleanExperiment({
		productKeys: {
			confluence: 'company_hub_carousel_thumbnails-refactor',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	company_hub_deprecate_atlaskit_onboarding: createBooleanExperiment({
		productKeys: {
			confluence: 'company_hub_deprecate_atlaskit_onboarding',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-10
	platform_editor_experience_tracking: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_experience_tracking',
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
	platform_editor_ssr_renderer: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ssr_renderer',
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
	// Added 2025-09-03
	platform_editor_hydratable_ui: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_hydratable_ui',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-10-31
	platform_editor_lovability_suppress_toolbar_event: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_suppress_toolbar_event',
			jira: 'platform_editor_lovability_suppress_toolbar_event',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-12-01
	platform_editor_no_state_plugin_injection_api: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_no_state_plugin_injection_api',
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
	// Added 2025-07-08 - Jira work sync description comment summary
	'jira-work-sync-desc-comment-summary': createBooleanExperiment({
		productKeys: {
			jira: 'jira-work-sync-desc-comment-summary',
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
	// Added 2025-12-17
	editor_fix_embed_width_expand: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_fix_embed_width_expand',
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
	// Added 2025-08-20
	platform_editor_ai_non_iw_adf_streaming: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_non_iw_adf_streaming',
		},
		param: 'cohort',
		values: ['control', 'adf_gemini25flash', 'adf_gpt41mini'],
		defaultValue: 'control',
	}),
	//Added 2025-07-25
	platform_editor_extension_styles: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_extension_styles',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-07-15
	platform_editor_preview_panel_responsiveness: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_preview_panels_exp',
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
	// Added 2025-10-10
	platform_editor_hoverlink_ui_fixes_exp: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_hoverlink_ui_fixes_exp',
		},
		param: 'cohort',
		values: ['control', 'css_changes_only', 'css_js_changes'],
		defaultValue: 'control',
	}),
	// Added 2026-01-05
	platform_editor_table_update_table_ref: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_update_table_ref',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-10
	platform_editor_task_item_styles: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_task_item_styles',
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
	// Added 2025-09-17
	platform_hover_card_preview_panel_modal: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_hover_card_preview_panel_modal',
			jira: 'platform_hover_card_preview_panel_modal',
		},
		param: 'cohort',
		values: ['control', 'test'],
		defaultValue: 'control',
	}),
	// Added 2025-11-25
	smart_link_confluence_short_link_analytics: createMultivariateExperiment({
		productKeys: {
			confluence: 'smart-link-confluence-short-link-analytics',
			jira: 'smart-link-confluence-short-link-analytics',
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
	// Added 2025-07-24
	editor_enghealth_hyperlink_toolbar_aria_values: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_enghealth_hyperlink_toolbar_aria_values',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2025-08-04
	platform_editor_floating_toolbar_button_aria_label: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_floating_toolbar_button_aria_label',
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
	// Added 20205-07-28
	platform_editor_fix_quick_insert_consistency_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_quick_insert_consistency_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	//Added 2025-11-19
	platform_editor_pasting_text_in_panel: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_pasting_text_in_panel',
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
	platform_editor_native_anchor_with_dnd: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_native_anchor_with_dnd',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_native_expand_button: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_native_expand_button',
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
			jira: 'platform_synced_block_jira',
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
	// Added 2025-08-19
	platform_editor_breakout_resizing_vc90_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_breakout_resizing_vc90_fix',
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
	// Added 2025-09-16
	platform_editor_prevent_taskitem_remount: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_prevent_taskitem_remount',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-08
	platform_editor_table_toolbar_perf_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_toolbar_perf_fix',
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
	// Added 2025-12-04
	confluence_compact_text_format: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_compact_text_format',
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
	platform_editor_add_aria_checked_to_inline_img_btn: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_add_aria_checked_to_inline_image_btn',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-16
	platform_editor_nested_table_refresh_width_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_nested_table_refresh_width_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-10
	platform_use_llm_space_recommendations: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_use_llm_space_recommendations',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-15
	platform_editor_text_highlight_padding: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_text_highlight_padding',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-24
	platform_editor_lovability_user_intent: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_user_intent',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-23
	cc_editor_ttvc_release_bundle_one: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_ttvc_release_bundle_one',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-07
	platform_editor_plain_text_support: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_plain_text_support',
			confluence: 'platform_editor_plain_text_support',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-09-26
	platform_editor_toolbar_aifc_patch_6: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_patch_6',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-01
	platform_inline_smartcard_connect_button_exp: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_inline_smartcard_connect_button_exp',
			jira: 'platform_inline_smartcard_connect_button_exp',
		},
		param: 'cohort',
		values: ['control', 'test1', 'test2'],
		defaultValue: 'control',
	}),
	// Added 2025-10-13
	platform_editor_media_error_analytics: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_error_analytics',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-20
	confluence_whiteboards_quick_insert_localised: createMultivariateExperiment({
		productKeys: {
			confluence: 'confluence_whiteboards_quick_insert_localised',
		},
		param: 'cohort',
		values: ['control', 'test_blank', 'test_diagram'],
		defaultValue: 'control',
	}),
	// Added 2025-10-28
	confluence_whiteboards_quick_insert_localised_aa: createMultivariateExperiment({
		productKeys: {
			confluence: 'confluence_whiteboards_quick_insert_localised_aa',
		},
		param: 'cohort',
		values: ['control', 'test_diagram'],
		defaultValue: 'control',
	}),
	// Added 2025-10-22
	platform_editor_remove_bidi_char_warning: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remove_bidi_char_warning',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-27
	platform_editor_table_sticky_header_improvements: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_table_sticky_header_improvements',
		},
		param: 'cohort',
		values: ['control', 'test_with_overflow', 'test_without_overflow'],
		defaultValue: 'control',
	}),
	// Added 2025-11-04
	platform_editor_disable_lazy_load_media: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_disable_lazy_load_media',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-29
	platform_editor_lovability_inline_code: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_inline_code',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-11-05
	platform_editor_lovability_emoji_scaling: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_emoji_scaling',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	platform_editor_fix_emoji_paste_html: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_emoji_paste_html',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-12-18
	platform_editor_blockquote_zero_padding: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_blockquote_zero_padding',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-11-19
	platform_editor_lovability_navigation_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_navigation_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-11-27
	platform_sl_3p_unauth_paste_as_block_card: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_unauth_paste_as_block_card',
			jira: 'platform_sl_3p_unauth_paste_as_block_card',
		},
		values: ['control', 'card_by_default_only', 'card_by_default_and_new_design'],
		param: 'cohort',
		defaultValue: 'control',
	}),
	// Added 2025-11-25
	platform_editor_remove_ncsstepmetrics_plugin: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remove_ncsstepmetrics_plugin',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-11-18
	platform_editor_wait_for_space_after_ascii_emoji: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_wait_for_space_after_ascii_emoji',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-03
	platform_editor_use_pmr_for_collab_presence_non_ic: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_use_pmr_for_collab_presence_non_ic',
			jira: 'platform_editor_use_pmr_for_collab_presence_non_ic',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-03
	platform_editor_use_pmr_for_collab_presence_in_ic: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_use_pmr_for_collab_presence_in_ic',
			jira: 'platform_editor_use_pmr_for_collab_presence_in_ic',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-12
	platform_editor_toolbar_delay_render_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_delay_render_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-03
	platform_editor_nested_media_selection_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_nested_media_selection_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-04
	platform_editor_scroll_gutter_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_scroll_gutter_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-08
	platform_editor_add_image_editing: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_add_image_editing',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2025-12-08
	platform_editor_reduce_toolbar_vc_impact: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_reduce_toolbar_vc_impact',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-15
	platform_editor_ai_exp_inline_date_year_refresh: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_exp_inline_date_year_refresh',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-15
	platform_editor_ai_exp_suggestion_date_comma_delim: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_exp_suggestion_date_comma_delim',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_sel_toolbar_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_sel_toolbar_fix',
			jira: 'platform_editor_sel_toolbar_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-30
	platform_editor_table_sticky_header_patch_9: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_sticky_header_patch_9',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-22
	platform_editor_localid_ime_composition_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_localid_ime_composition_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-18
	platform_synced_blocks_offline_check_for_block: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_synced_blocks_offline_check_for_block',
			jira: 'platform_synced_blocks_offline_check_for_block',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-22
	platform_editor_sample_renderer_rendered_event: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_sample_renderer_rendered_event',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-12
	platform_editor_table_sticky_header_patch_11: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_sticky_header_patch_11',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
} satisfies Record<string, ExperimentConfigValue>;
