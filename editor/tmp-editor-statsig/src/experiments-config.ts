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
	// Added 2026-03-04
	cwr_blank_object_experiment: {
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
	// Added 2026-04-08
	cc_integrations_editor_open_link_click_analytics: {
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
	// Added 2026-03-26
	cc_editor_fix_insm_inp_buffer: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-18
	editor_a11y_7152_profile_card_tab_order: {
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
	// Added 2026-03-25
	'editor_a11y__enghealth-46814_fy26': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-20
	editor_a11y_decision_aria_label: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-09
	platform_editor_react19_migration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 03-09-2025
	cc_editor_interactivity_monitoring: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-19
	cc_editor_limited_mode_expanded: {
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
	// Added 05-03-2026
	platform_editor_ai_headingautocomplete: {
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
	platform_editor_flex_based_centering: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-09
	platform_editor_render_bodied_extension_as_inline: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-03
	platform_editor_ai_quick_prompt_iw_cc: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-25
	platform_editor_ai_escape_early_for_unhealthy_node: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-11
	platform_editor_prosemirror_rendered_data: {
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
	platform_editor_unify_native_dnd_selectors: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Addded 2026-02-11
	ai_speech_to_text_in_editor: {
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
	'cc_perf-insights-cards_extension_a11y_list': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	ccpi_fix_broken_uploaded_img: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-05
	'editor-a11y-fy26-keyboard-move-row-column': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-28
	editor_enable_image_alignment_in_expand: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-24
	platform_editor_paste_actions_menu: {
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
	// Added 2026-02-16
	platform_editor_remove_important_in_render_ext: {
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
	// Added 2026-01-15
	confluence_max_width_breakout_extension_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	confluence_remix_icon_right_side: {
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
	// Added 2026-03-05
	platform_editor_abort_ufo_on_user_interaction: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-19
	platform_editor_a11y_eslint_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-01-19
	platform_editor_ai_edit_response_in_preview: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
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
	// Added 2026-02-03
	platform_editor_aifc_fix_button_viewed_analytics: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
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
	// Added 2026-02-25
	platform_editor_expand_paste_in_comment_editor: {
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
	platform_editor_clean_up_widget_mark_logic: {
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
	platform_editor_toolbar_hide_overflow_menu: {
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
	// Added 2026-03-05 - gates DOM mutation observer for experience tracking (toolbar + block menu)
	platform_editor_experience_tracking_observer: {
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
	// Added 2026-02-18
	platform_editor_table_a11y_eslint_fix: {
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
	// Added 2025-08-04
	platform_editor_floating_toolbar_button_aria_label: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-09-03
	platform_editor_hydratable_ui: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-02
	platform_editor_inline_card_dispatch_guard: {
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
	// Added 2026-03-05
	platform_editor_appearance_shared_state: {
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
	platform_editor_primary_toolbar_early_exit: {
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
	// Added 2026-04-02
	platform_editor_ai_aifc_listitem_indentation_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-31
	platform_editor_lovability_distribute_column_fix: {
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
	// Added 2026-03-24
	platform_editor_media_vc_fixes_patch1: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-11
	platform_editor_native_embeds: {
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
	// Added 2025-06-10
	platform_editor_no_cursor_on_edit_page_init: {
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
	// Added 2026-02-16
	platform_editor_disable_lcm_copy_button: {
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
	// Added 2026-01-27
	platform_editor_table_excerpts_fix: {
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
	//Added 2025-07-16
	platform_editor_toolbar_aifc: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-12
	platform_editor_toolbar_submenu_open_click: {
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
	// Added 2026-03-16
	platform_editor_table_display_mode_in_to_dom: {
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
	// Added 2026-03-23
	platform_editor_table_ref_optimisation: {
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
	// Added 2026-03-17 - Experiment to display Rovo Chat actions on Google Smart Link's HoverCard on
	// Confluence main page renderer. Boolean experiment: use getExperimentValue(..., "isEnabled", false).
	// https://switcheroo.atlassian.com/ui/gates/c6e2cac7-a7c6-47d4-ac53-ebed74cac406/key/platform_sl_3p_auth_rovo_action
	platform_sl_3p_auth_rovo_action: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-27 — Pre-auth inline smart link: improved unauthorised hover card (boolean: isEnabled)
	platform_sl_3p_preauth_better_hovercard: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-08-10
	platform_synced_block: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-05
	platform_synced_block_use_new_source_nodeview: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-05
	platform_synced_block_patch_6: {
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
	// Added 2025-01-23
	platform_editor_to_use_pmr_for_collab_edit_none_ic: {
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
	platform_editor_toolbar_delay_render_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-02
	platform_editor_ai_disable_bridge_without_ai: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_toolbar_aifc_use_editor_typography: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-17
	platform_editor_aifc_sync_block_stream_fix: {
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
	// Added 2026-01-21
	platform_editor_copy_link_a11y_inconsistency_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-08
	platform_editor_focus_on_chromeless_editor: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-16
	platform_editor_ai_edit_unsupported_content: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-19
	platform_editor_copy_paste_issue_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-27 - AI create-page expand collapse fix
	platform_editor_aifc_expand_collapses_oncreate_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-22
	platform_editor_ai_loading_responsive_width: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-22
	platform_editor_nested_drag_handle_icon: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-23
	collab_bypass_out_of_sync_period_experiment: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-16
	platform_editor_ignore_metadata_connection_errors: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-29
	platform_editor_renderer_toolbar_updates: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_comment_rovoinlinechat_improvement: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_fix_cross_origin_editor_focus: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-16
	platform_editor_ai_fix_insert_after_selection: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-07
	platform_editor_ai_move_node: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	confluence_ttvc_inline_extensions: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-03
	platform_editor_enghealth_a11y_jan_fixes: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-04
	platform_editor_emoji_tooltips_on_hover: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-16-05
	platform_editor_outdated_browser_update: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-05
	cc_fd_db_top_editor_toolbar: {
		defaultValue: 'control' | 'new-description' | 'orig-description';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'new-description' | 'orig-description';
		values: ('control' | 'new-description' | 'orig-description')[];
	};
	// Added 2026-04-02 - CFFD-2139
	cc_fd_cwr_quick_insert: {
		defaultValue: 'control' | 'slot-four' | 'slot-two';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'slot-four' | 'slot-two';
		values: ('control' | 'slot-four' | 'slot-two')[];
	};
	// Added 2026-04-08
	cc_fd_wb_jira_quick_insert_experiment: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-05 - A11Y-10416
	editor_a11y_role_textbox: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-01-28
	platform_editor_smartlink_local_cache: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-05
	platform_editor_toolbar_split_button_ui: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-06
	platform_rovo_inline_chat_missing_analytics_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-12
	platform_editor_bodiedextension_layoutshift_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-16
	platform_safari_cursor_typeahead_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-19
	platform_editor_comment_editor_border_radius: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-26
	platform_editor_fix_comment_border: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-01
	platform_editor_layout_column_resize_handle: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-26
	platform_editor_perf_lint_cleanup: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-30
	platform_editor_spotlight_migration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-17
	confluence_frontend_fix_date_hydration_error: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-18
	platform_editor_fix_advanced_codeblocks_crlf_patch: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-23
	'cc-maui-experiment': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-06
	'cc-maui-experiment-phase-2': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-05
	'cc-mui-slides-experiment': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-27
	confluence_frontend_cwr_outcome_type_picker: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-01
	confluence_fe_cwr_outcome_picker_prompt_autoselect: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-12
	platform_editor_a11y_escape_link_dialog: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-20
	platform_editor_flexible_list_indentation: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-24
	platform_editor_flexible_list_schema: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	platform_editor_vc90_transition_table_border: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	platform_editor_vc90_transition_expand_icon: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	platform_editor_vc90_transition_panel_icon: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	platform_editor_vc90_transition_mentions: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-24
	platform_editor_emoji_default_scale: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-26
	platform_editor_toolbar_update_jira_config: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-25
	platform_editor_a11y_typeahead_tab_keypress: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-27
	platform_editor_early_exit_return_draft: {
		// Added 2026-03-02
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_discarded_unified_analytic_events: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-03
	platform_editor_ai_update_actioned_event_timeout: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	platform_editor_ai_blockmenu_integration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_ai_aifc_space_shortcut_patch: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-05
	platform_editor_media_reliability_observability: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-24
	platform_editor_media_external_badge_bbc_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	platform_editor_rovobutton_smartlink_toolbar_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-02
	platform_editor_ai_smartlink_toolbar_v2_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-11
	platform_editor_renderer_error_boundary_stable_key: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-30
	platform_editor_a11y_scrollable_region: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-10
	platform_editor_renderer_shadow_observer_cleanup: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-04
	confluence_fe_renderer_inline_node_mark_color_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-10
	platform_editor_insert_location_check: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-05
	platform_editor_table_resizer_extended_zone: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-10
	platform_editor_fix_editor_unhandled_type_errors: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-05
	cc_drag_and_drop_smart_link_from_content_to_tree: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-19
	platform_editor_fix_table_row_drag_drop_target: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-11
	platform_editor_remove_grid_init_reflow: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-07
	platform_editor_table_remove_last_cell_decoration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_small_font_size: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-10
	platform_editor_diff_plugin_extended: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-10
	platform_editor_fix_media_toolbar_border_dropdown: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-24
	platform_editor_fix_media_picker_hidden: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-10
	platform_editor_analyse_table_with_merged_cells: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-20
	cc_editor_ttvc_media_hold_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-06
	platform_editor_single_player_expand: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_rovo_inline_chat_aria_label: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-11
	platform_editor_are_nodes_equal_ignore_mark_order: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-09
	platform_editor_remove_collab_step_metrics: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-13
	platform_editor_editor_centre_content_on_find: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_chromeless_expand_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-23
	platform_editor_inline_media_copy_paste_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-13
	platform_editor_misaligned_ai_screens_firefox_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-11
	platform_editor_disable_last_node_para: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-19
	platform_editor_toolbar_two_stage_hydration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-30
	platform_editor_stricter_panelcolor_typecheck: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-15
	platform_editor_sync_block_ssr_config: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-18
	platform_editor_selection_toolbar_block_handle: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-06
	confluence_fe_create_page_suggestion: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-02-04
	platform_editor_user_highlight_contrast: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-25
	platform_editor_improve_preset_builder_logging: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-27
	platform_editor_preserve_node_identity: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-23
	confluence_toc_nav_a11y: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-30
	platform_editor_ai_xstate_migration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-03-31
	platform_editor_dnd_accessibility_fixes_expand: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-07
	platform_editor_lovability_select_all_shortcut: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-01
	platform_editor_hydration_skip_react_portal: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-08
	platform_editor_drag_handle_keyboard_a11y: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-09
	show_mentions_in_suggest_reply: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
} = {
	// new format to avoid collisions with other users when updating the file

	// Editor Platform experiments
	// lwoollard experiments

	// Added 2026-02-11
	ai_speech_to_text_in_editor: createBooleanExperiment({
		productKeys: {
			confluence: 'ai_speech_to_text_in_editor',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
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
	// Added 2026-03-25
	'editor_a11y__enghealth-46814_fy26': createBooleanExperiment({
		productKeys: {
			confluence: 'editor_a11y__enghealth-46814_fy26',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-20
	editor_a11y_decision_aria_label: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_a11y_decision_aria_label',
			jira: 'editor_a11y_decision_aria_label',
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
	// Added 05-03-2026
	platform_editor_ai_headingautocomplete: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_headingautocomplete',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-16
	platform_editor_remove_important_in_render_ext: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remove_important_in_render_ext',
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
	// Added 2026-01-15
	confluence_max_width_breakout_extension_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_max_width_breakout_extension_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	confluence_remix_icon_right_side: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_remix_icon_right_side',
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
	// Added 2026-03-26
	cc_editor_fix_insm_inp_buffer: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_fix_insm_inp_buffer',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	cwr_blank_object_experiment: createBooleanExperiment({
		productKeys: {
			confluence: 'cwr_blank_object_experiment',
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
	// Added 2026-04-08
	cc_integrations_editor_open_link_click_analytics: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_integrations_editor_open_link_click_analytics',
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

	// Added 2025-11-12
	platform_editor_media_vc_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_vc_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-03-24
	platform_editor_media_vc_fixes_patch1: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_vc_fixes_patch1',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-03-06
	platform_editor_media_reliability_observability: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_reliability_observability',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-03-24
	platform_editor_media_external_badge_bbc_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_external_badge_bbc_fix',
			bitbucket: 'platform_editor_media_external_badge_bbc_fix',
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
	// Added 2026-03-09
	platform_editor_react19_migration: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_react19_migration',
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
	// Added 2026-01-05
	'company_hub_carousel_thumbnails-refactor': createBooleanExperiment({
		productKeys: {
			confluence: 'company_hub_carousel_thumbnails-refactor',
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
	// Added 2026-03-05 - gates DOM mutation observer for experience tracking (toolbar + block menu)
	platform_editor_experience_tracking_observer: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_experience_tracking_observer',
			jira: 'platform_editor_experience_tracking_observer',
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
	// Added 2024-11-26
	platform_editor_ai_unsplash_page_header: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_unsplash_page_header',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-24
	platform_editor_paste_actions_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_paste_actions_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-03
	platform_editor_aifc_fix_button_viewed_analytics: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_aifc_fix_button_viewed_analytics',
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
	// Added 2025-02-10
	platform_editor_controls: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_controls',
			jira: 'platform_editor_controls_jira',
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
	// Added 2026-03-02
	platform_editor_inline_card_dispatch_guard: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_inline_card_dispatch_guard',
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
	platform_editor_table_display_mode_in_to_dom: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_display_mode_in_to_dom',
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
	// Added 2025-06-10
	platform_editor_no_cursor_on_edit_page_init: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_no_cursor_on_edit_page_init',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_clean_up_widget_mark_logic: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_clean_up_widget_mark_logic',
			jira: 'platform_editor_clean_up_widget_mark_logic',
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
	// Added 2026-03-10
	platform_editor_renderer_shadow_observer_cleanup: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_renderer_shadow_observer_cleanup',
			confluence: 'platform_editor_renderer_shadow_observer_cleanup',
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
	// Added 2026-02-17
	platform_editor_aifc_sync_block_stream_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_aifc_sync_block_stream_fix',
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
	platform_editor_toolbar_hide_overflow_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_hide_overflow_menu',
			jira: 'platform_editor_toolbar_hide_overflow_menu',
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
	// Added 2025-06-24
	platform_editor_find_and_replace_improvements: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_find_and_replace_improvements',
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
	// Added 2026-01-05
	platform_editor_table_update_table_ref: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_update_table_ref',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-27
	platform_editor_table_excerpts_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_excerpts_fix',
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
			jira: 'platform_editor_block_menu_jira',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-07-23
	//Added 2025-07-16
	platform_editor_toolbar_aifc: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_confluence',
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
	//Added 2025-11-19
	platform_editor_pasting_text_in_panel: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_pasting_text_in_panel',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-19
	platform_editor_comment_editor_border_radius: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_comment_editor_border_radius',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-26
	platform_editor_perf_lint_cleanup: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_perf_lint_cleanup',
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
	// Added 2026-01-19
	cc_editor_limited_mode_expanded: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_limited_mode_expanded',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-11
	platform_editor_native_embeds: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_native_embeds',
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
	// Added 2026-03-05
	'cc_perf-insights-cards_extension_a11y_list': createBooleanExperiment({
		productKeys: {
			confluence: 'cc_perf-insights-cards_extension_a11y_list',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-12
	ccpi_fix_broken_uploaded_img: createBooleanExperiment({
		productKeys: {
			confluence: 'ccpi_fix_broken_uploaded_img',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-05
	'editor-a11y-fy26-keyboard-move-row-column': createBooleanExperiment({
		productKeys: {
			confluence: 'editor-a11y-fy26-keyboard-move-row-column',
			jira: 'editor-a11y-fy26-keyboard-move-row-column',
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
	// Added 2026-03-05
	platform_synced_block_use_new_source_nodeview: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_synced_block_use_new_source_nodeview',
			jira: 'platform_synced_block_use_new_source_nodeview',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-05
	platform_synced_block_patch_6: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_synced_block_patch_6',
			jira: 'platform_synced_block_patch_6',
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
	// Added 2026-01-09
	platform_editor_render_bodied_extension_as_inline: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_render_bodied_extension_as_inline',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-03
	platform_editor_ai_quick_prompt_iw_cc: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_quick_prompt_iw_cc',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-25
	platform_editor_ai_escape_early_for_unhealthy_node: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_escape_early_for_unhealthy_node',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-12-04
	confluence_compact_text_format: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_compact_text_format',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_unify_native_dnd_selectors: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_unify_native_dnd_selectors',
			jira: 'platform_editor_unify_native_dnd_selectors',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-05
	platform_editor_abort_ufo_on_user_interaction: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_abort_ufo_on_user_interaction',
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
	// Added 2025-09-23
	cc_editor_ttvc_release_bundle_one: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_ttvc_release_bundle_one',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-10-01
	// Added 2025-10-13
	platform_editor_media_error_analytics: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_error_analytics',
		},
		param: 'isEnabled',
		defaultValue: false,
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
	// Added 2026-02-16
	platform_editor_disable_lcm_copy_button: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_disable_lcm_copy_button',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-28-01
	platform_editor_primary_toolbar_early_exit: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_primary_toolbar_early_exit',
			jira: 'platform_editor_primary_toolbar_early_exit',
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

	platform_editor_flex_based_centering: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_flex_based_centering',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-02-18
	editor_a11y_7152_profile_card_tab_order: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_a11y_7152_profile_card_tab_order',
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
	// Added 2026-03-17 - 3P auth Rovo actions on smart link hover card (boolean: isEnabled)
	platform_sl_3p_auth_rovo_action: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_auth_rovo_action',
			jira: 'platform_sl_3p_auth_rovo_action',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-27 — Pre-auth unauthorised inline hover card UX
	platform_sl_3p_preauth_better_hovercard: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_preauth_better_hovercard',
			jira: 'platform_sl_3p_preauth_better_hovercard',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-01-23
	platform_editor_to_use_pmr_for_collab_edit_none_ic: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_to_use_pmr_for_collab_edit_none_ic',
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
	// Added 2025-12-08
	platform_editor_add_image_editing: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_add_image_editing',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_toolbar_aifc_use_editor_typography: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_aifc_use_editor_typography',
			jira: 'platform_editor_toolbar_aifc_use_editor_typography',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_toolbar_submenu_open_click: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_submenu_open_click',
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
	// Added 2025-12-22
	platform_editor_sample_renderer_rendered_event: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_sample_renderer_rendered_event',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025-01-21
	platform_editor_copy_link_a11y_inconsistency_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_copy_link_a11y_inconsistency_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-25
	platform_editor_expand_paste_in_comment_editor: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_expand_paste_in_comment_editor',
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
	// Added 2026-02-16
	platform_editor_ai_fix_insert_after_selection: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_fix_insert_after_selection',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-07
	platform_editor_ai_move_node: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_move_node',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-08
	platform_editor_focus_on_chromeless_editor: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_focus_on_chromeless_editor',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-02
	platform_editor_ai_disable_bridge_without_ai: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_disable_bridge_without_ai',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-16
	platform_editor_ai_edit_unsupported_content: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_edit_unsupported_content',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-19
	platform_editor_copy_paste_issue_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_copy_paste_issue_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-27 - AI create-page expand collapse fix
	platform_editor_aifc_expand_collapses_oncreate_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_aifc_expand_collapses_oncreate_fix',
			jira: 'platform_editor_aifc_expand_collapses_oncreate_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-22
	platform_editor_ai_loading_responsive_width: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_loading_responsive_width',
			jira: 'platform_editor_ai_loading_responsive_width',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-22
	platform_editor_nested_drag_handle_icon: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_nested_drag_handle_icon',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-23
	collab_bypass_out_of_sync_period_experiment: createBooleanExperiment({
		productKeys: {
			confluence: 'collab_bypass_out_of_sync_period_experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-16
	platform_editor_ignore_metadata_connection_errors: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_collab_provider_suppress_metadata_errors',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-18
	platform_editor_table_a11y_eslint_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_a11y_eslint_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-29
	platform_editor_renderer_toolbar_updates: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_renderer_toolbar_updates',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-30
	platform_editor_fix_cross_origin_editor_focus: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_cross_origin_editor_focus',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_comment_rovoinlinechat_improvement: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_comment_rovoinlinechat_improvement',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	confluence_ttvc_inline_extensions: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_ttvc_inline_extensions',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-03
	platform_editor_enghealth_a11y_jan_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_enghealth_a11y_jan_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-04
	platform_editor_emoji_tooltips_on_hover: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_emoji_tooltips_on_hover',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-16-05
	platform_editor_outdated_browser_update: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_outdated_browser_update',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-05
	cc_fd_db_top_editor_toolbar: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_fd_db_top_editor_toolbar',
		},
		param: 'cohort',
		values: ['control', 'new-description', 'orig-description'],
		defaultValue: 'control',
	}),
	// Added 2026-04-02 - CFFD-2139
	cc_fd_cwr_quick_insert: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_fd_cwr_quick_insert',
		},
		param: 'cohort',
		values: ['control', 'slot-four', 'slot-two'],
		defaultValue: 'control',
	}),
	// Added 2026-02-05 - A11Y-10416
	editor_a11y_role_textbox: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_a11y_role_textbox',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-01-28
	platform_editor_smartlink_local_cache: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_smartlink_local_cache',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-05
	platform_editor_toolbar_split_button_ui: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_split_button_ui',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-06
	platform_rovo_inline_chat_missing_analytics_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_rovo_inline_chat_missing_analytics_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-12
	platform_editor_bodiedextension_layoutshift_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_bodiedextension_layoutshift_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-16
	platform_safari_cursor_typeahead_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_safari_cursor_typeahead_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-17
	confluence_frontend_fix_date_hydration_error: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_frontend_fix_date_hydration_error',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-19
	platform_editor_a11y_eslint_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_a11y_eslint_fix',
			jira: 'platform_editor_a11y_eslint_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_fix_advanced_codeblocks_crlf_patch: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_advanced_codeblocks_crlf_patch',
			jira: 'platform_editor_fix_advanced_codeblocks_crlf_patch',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-23
	'cc-maui-experiment': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-maui-experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-06
	'cc-maui-experiment-phase-2': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-maui-experiment-phase-2',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-05
	'cc-mui-slides-experiment': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-mui-slides-experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-27
	confluence_frontend_cwr_outcome_type_picker: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_frontend_cwr_outcome_type_picker',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-01
	confluence_fe_cwr_outcome_picker_prompt_autoselect: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_fe_cwr_outcome_picker_prompt_autoselect',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-12
	platform_editor_a11y_escape_link_dialog: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_a11y_escape_link_dialog',
			jira: 'platform_editor_a11y_escape_link_dialog',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	platform_editor_vc90_transition_table_border: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_vc90_transition_table_border',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	platform_editor_vc90_transition_expand_icon: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_vc90_transition_expand_icon',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	platform_editor_vc90_transition_panel_icon: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_vc90_transition_panel_icon',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	platform_editor_vc90_transition_mentions: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_vc90_transition_mentions',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-11
	platform_editor_prosemirror_rendered_data: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_prosemirror_rendered_data',
			jira: 'platform_editor_prosemirror_rendered_data',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-19
	platform_editor_flexible_list_indentation: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_flexible_list_indentation',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-24
	platform_editor_flexible_list_schema: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_flexible_list_schema',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-24
	platform_editor_emoji_default_scale: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_emoji_default_scale',
			jira: 'platform_editor_emoji_default_scale',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-26
	platform_editor_toolbar_update_jira_config: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_toolbar_update_jira_config',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-25
	platform_editor_a11y_typeahead_tab_keypress: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_a11y_typeahead_tab_keypress',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-27
	platform_editor_early_exit_return_draft: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_early_exit_return_draft',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-03
	platform_editor_ai_update_actioned_event_timeout: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_update_actioned_event_timeout',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-02
	platform_editor_discarded_unified_analytic_events: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_discarded_unified_analytic_events',
			jira: 'platform_editor_discarded_unified_analytic_events',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-05
	platform_editor_appearance_shared_state: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_appearance_shared_state',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	platform_editor_ai_blockmenu_integration: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_blockmenu_integration',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added for space shortcut plugin: when on, space shortcut is not added if AI opt-in is not enabled
	platform_editor_ai_aifc_space_shortcut_patch: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_aifc_space_shortcut_patch',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	platform_editor_rovobutton_smartlink_toolbar_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_rovobutton_smartlink_toolbar_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-02
	platform_editor_ai_smartlink_toolbar_v2_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_smartlink_toolbar_v2_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-30
	platform_editor_a11y_scrollable_region: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_a11y_scrollable_region',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-11
	platform_editor_renderer_error_boundary_stable_key: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_renderer_error_boundary_stable_key',
			confluence: 'platform_editor_renderer_error_boundary_stable_key',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-04
	confluence_fe_renderer_inline_node_mark_color_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_fe_renderer_inline_node_mark_color_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-10
	platform_editor_fix_editor_unhandled_type_errors: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_editor_unhandled_type_errors',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-05
	platform_editor_table_resizer_extended_zone: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_resizer_extended_zone',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-10
	platform_editor_insert_location_check: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_insert_location_check',
			confluence: 'platform_editor_insert_location_check',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-05
	cc_drag_and_drop_smart_link_from_content_to_tree: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_drag_and_drop_smart_link_from_content_to_tree',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-19
	platform_editor_fix_table_row_drag_drop_target: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_table_row_drag_drop_target',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-11
	platform_editor_remove_grid_init_reflow: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remove_grid_init_reflow',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-07
	platform_editor_table_remove_last_cell_decoration: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_remove_last_cell_decoration',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_small_font_size: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_small_font_size',
			jira: 'platform_editor_small_font_size',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-10
	platform_editor_diff_plugin_extended: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_diff_plugin_extended',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-10
	platform_editor_fix_media_toolbar_border_dropdown: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_media_toolbar_border_dropdown',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-24
	platform_editor_fix_media_picker_hidden: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_media_picker_hidden',
			jira: 'platform_editor_fix_media_picker_hidden',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-10
	platform_editor_analyse_table_with_merged_cells: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_analyse_table_with_merged_cells',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	cc_editor_ttvc_media_hold_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_editor_ttvc_media_hold_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-06
	platform_editor_single_player_expand: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_single_player_expand',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-01
	platform_editor_rovo_inline_chat_aria_label: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_rovo_inline_chat_aria_label',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-11
	platform_editor_are_nodes_equal_ignore_mark_order: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_are_nodes_equal_ignore_mark_order',
			jira: 'platform_editor_are_nodes_equal_ignore_mark_order',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-11
	platform_editor_disable_last_node_para: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_disable_last_node_para',
			jira: 'platform_editor_disable_last_node_para',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-09
	platform_editor_remove_collab_step_metrics: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remove_collab_step_metrics',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-13
	platform_editor_editor_centre_content_on_find: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_editor_centre_content_on_find',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-24
	platform_editor_table_ref_optimisation: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_ref_optimisation',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-20
	platform_editor_chromeless_expand_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_chromeless_expand_fix',
			jira: 'platform_editor_chromeless_expand_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-23
	platform_editor_inline_media_copy_paste_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_inline_media_copy_paste_fix',
			jira: 'platform_editor_inline_media_copy_paste_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-13
	platform_editor_misaligned_ai_screens_firefox_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_misaligned_ai_screens_firefox_fix',
			jira: 'platform_editor_misaligned_ai_screens_firefox_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-19
	platform_editor_toolbar_two_stage_hydration: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_two_stage_hydration',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-15
	platform_editor_stricter_panelcolor_typecheck: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_stricter_panelcolor_typecheck',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-15
	platform_editor_sync_block_ssr_config: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_sync_block_ssr_config',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-06
	confluence_fe_create_page_suggestion: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_fe_create_page_suggestion',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-18
	platform_editor_selection_toolbar_block_handle: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_selection_toolbar_block_handle',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-27
	platform_editor_preserve_node_identity: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_preserve_node_identity',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-23
	confluence_toc_nav_a11y: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_toc_nav_a11y',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-004
	platform_editor_user_highlight_contrast: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_user_highlight_contrast',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-25
	platform_editor_improve_preset_builder_logging: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_improve_preset_builder_logging',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-26
	platform_editor_fix_comment_border: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_comment_border',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-30
	platform_editor_spotlight_migration: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_spotlight_migration',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-30
	platform_editor_ai_xstate_migration: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_xstate_migration',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-31
	platform_editor_dnd_accessibility_fixes_expand: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_dnd_accessibility_fixes_expand',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-01
	platform_editor_layout_column_resize_handle: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_layout_column_resize_handle',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-31
	platform_editor_lovability_distribute_column_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_distribute_column_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-02
	platform_editor_ai_aifc_listitem_indentation_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_aifc_listitem_indentation_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-08
	cc_fd_wb_jira_quick_insert_experiment: createBooleanExperiment({
		productKeys: {
			jira: 'cc_fd_wb_jira_quick_insert_experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-07
	platform_editor_lovability_select_all_shortcut: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_select_all_shortcut',
			jira: 'platform_editor_lovability_select_all_shortcut',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-01
	platform_editor_hydration_skip_react_portal: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_hydration_skip_react_portal',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-08
	platform_editor_drag_handle_keyboard_a11y: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_drag_handle_keyboard_a11y',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-01
	show_mentions_in_suggest_reply: createBooleanExperiment({
		productKeys: {
			jira: 'show_mentions_in_suggest_reply',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
} satisfies Record<string, ExperimentConfigValue>;
