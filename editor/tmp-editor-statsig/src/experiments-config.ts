/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { createBooleanExperiment, createMultivariateExperiment } from './experiment-builders';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Need value import for typeof
import { isBoolean } from './type-guards';
import type { ExperimentConfigValue, ProductKeys } from './types';

type IsBooleanType = typeof isBoolean;

export type EditorExperimentsConfig = typeof editorExperimentsConfig;

// These experiments have a jira-specific key that differs from the experiment name,
// so they must opt out of product-key routing to avoid sending the wrong key on jira.
export const disallowsProductKeys: (keyof EditorExperimentsConfig)[] = [
	'platform_editor_block_menu',
	'platform_editor_blocks',
	'platform_editor_controls',
	'platform_editor_preview_panel_linking_exp',
	'platform_synced_block',
	'platform_editor_static_css',
	'advanced_layouts',
	'single_column_layouts',
	'platform_editor_preview_panel_responsiveness',
	'platform_editor_toolbar_aifc',
	'comment_on_bodied_extensions',
];

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
	// Added 2026-07-21
	// Agent edit presence — cosmetic skeleton-loader shimmer over agent-authored edits (with a Rovo
	// agent telepointer at the end of the range). `isEnabled` toggles the feature; the dynamic-config
	// params `durationMs` (how long the shimmer stays) and `telepointerDisabled` (hide the trailing
	// telepointer, shown by default) tune it — read via `expVal` with defaults in
	// `editor-plugin-collab-edit/.../agent-shimmer-constants.ts`, so they are safe when unset.
	platform_editor_agent_be_streaming: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-17
	platform_editor_status_popup_suggestions: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-08
	confluence_inline_comments_fix_stale_selection: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-25
	platform_editor_first_node_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-09
	remix_button_right_margin_hover: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
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
	// Added 2026-06-01
	rovo_remix_experience_context: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-05
	'databases-native-embeds-v2': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-21
	cwr_page_tree_auto_finalize: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-28
	'agent-managed_blocks_mvp': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-30
	'agent-managed-blocks-stop-block-template': {
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
	cc_editor_insm_doc_size_stats: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-14
	platform_editor_dom_node_count: {
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
	// Added 2026-07-20
	'editor_a11y__primary-toolbar-aria-label_fy27': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-21
	'editor_a11y__toolbar-item-aria-described-by_fy27': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-19
	'enghealth-53346_fix_redaction_marker_editor': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-01
	platform_editor_ai_normalized_telemetry: {
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
	// Added 2026-05-15
	platform_editor_per_plugin_error_boundary: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// new format to avoid collisions with other users when updating the file
	// Editor Platform experiments
	// lwoollard experiments
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
	// Added 2026-04-30
	platform_editor_code_block_q4_lovability: {
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
	// Added 2026-07-15
	cc_smarts_should_improve_writing_migration: {
		defaultValue: 'control' | 'shadow_compare' | 'live_cc_smarts';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'shadow_compare' | 'live_cc_smarts';
		values: ('control' | 'shadow_compare' | 'live_cc_smarts')[];
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
	// Added 2026-07-06
	confluence_comment_nudgebar_improvement: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-05
	confluence_quick_insert_embeds: {
		defaultValue: 'control' | 'prioritizeLinkInQIM' | 'prioritizeEmbedInQIM';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (
			value: unknown,
		) => value is 'control' | 'prioritizeLinkInQIM' | 'prioritizeEmbedInQIM';
		values: ('control' | 'prioritizeLinkInQIM' | 'prioritizeEmbedInQIM')[];
	};
	platform_editor_layout_keywords: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_editor_ssr_streaming: {
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
	// Added 2025-01-19
	platform_editor_ai_edit_response_in_preview: {
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
	// Added 2026-07-20
	platform_editor_fix_ai_streaming_race: {
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
	// Added 2026-17-03
	platform_editor_media_name_fallback: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-12
	platform_editor_media_name_fallback_viewer_card: {
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
	// Added 2026-06-09
	platform_editor_blocks: {
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
	platform_editor_controls_reliable_anchor: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-12
	platform_editor_confluence_base_preset: {
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
	// Added 2025-06-16
	platform_editor_enable_single_player_step_merging: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-23
	'cc-markdown-mode': {
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
	// Added 2026-06-25
	jira_editor_a11y_toolbar_fixes: {
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
	// Added 2026-07-13
	platform_editor_fix_focus_MediaInsertPicker: {
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
	// Added 2025-10-13
	platform_editor_media_error_analytics: {
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
	// Added 2026-05-26
	platform_editor_agent_mentions: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-09
	platform_editor_reduced_profile_cards: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-25
	platform_editor_plus_menu_aria_label: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-30
	platform_editor_fix_link_paste_menu: {
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
	// Added 2026-07-20
	platform_editor_table_sticky_header_patch_12: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2025-04-17
	platform_editor_tables_drag_and_drop: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-16
	platform_editor_table_col_insert: {
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
	// Added 2026-03-23
	platform_editor_table_ref_optimisation: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-16
	platform_editor_inline_media_replacement: {
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
	// Added 2026-03-27 — Pre-auth inline smart link: improved unauthorised hover card (boolean: isEnabled)
	platform_sl_3p_preauth_better_hovercard: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-21 — Post-auth GDrive Smart Link to Rovo Chat auto-open (boolean: isEnabled)
	platform_sl_3p_post_auth_chat_open_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-11 — Pre-auth inline CTA 'Preview' experiment for unauthorised 3P inline smart links (boolean: isEnabled)
	'rovogrowth-635-pre-auth-cta-preview-exp': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-29 — Social proof inline CTA for unauthorised 3P inline smart links (boolean: isEnabled)
	platform_sl_3p_preauth_social_proof_inline_cta: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-15 — Embed card footer rovo action experiment for resolved 3P smart links in confluence (boolean: isEnabled)
	platform_sl_3p_auth_rovo_embed_footer_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-01 — Social proof experiment for unauthorized 3P block cards (boolean: isEnabled)
	social_proof_3p_unauth_block_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-29 — Inline rovo action experiment for resolved inline smart links (boolean: isEnabled)
	platform_sl_3p_auth_inline_tailored_cta: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-16 — Use link-extractors inline icon extraction for Confluence 1P/3P connection byline (boolean: isEnabled)
	confluence_1p_and_3p_connection_byline_experiment: {
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
	// Added 2026-07-09
	platform_editor_sync_block_activation: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-05
	editor_synced_block_perf: {
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
	// Added 2026-04-30 (QS-9895)
	linking_platform_track_non_primary_3p_clicks: {
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
	// Added 2026-02-17
	platform_editor_aifc_sync_block_stream_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-13
	platform_editor_hide_extension_renderer_support: {
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
	// Added 2026-01-27 - AI create-page expand collapse fix
	platform_editor_aifc_expand_collapses_oncreate_fix: {
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
	// Added 2026-01-29
	platform_editor_renderer_toolbar_updates: {
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
	// Added 2026-02-05
	cc_fd_db_top_editor_toolbar: {
		defaultValue: 'control' | 'new-description' | 'orig-description';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'new-description' | 'orig-description';
		values: ('control' | 'new-description' | 'orig-description')[];
	};
	// Added 2026-04-02
	cc_fd_cwr_quick_insert: {
		defaultValue: 'control' | 'slot-four' | 'slot-two';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'slot-four' | 'slot-two';
		values: ('control' | 'slot-four' | 'slot-two')[];
	};
	// Added 2026-06-30
	cc_fix_editor_context_on_cwr_followups: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-09
	cc_fix_ephemeral_preview_staging_area_registration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
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
	// Added 2026-02-12
	platform_editor_bodiedextension_layoutshift_fix: {
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
	// Added 2026-04-01
	platform_editor_layout_column_resize_handle: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-07
	platform_editor_layout_column_menu: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-15
	platform_editor_layout_column_valign_rendering: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-21
	platform_editor_layout_typeahead_reorder: {
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
	// Added 2026-02-18
	platform_editor_fix_advanced_codeblocks_crlf_patch: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-01
	cc_page_experiences_editor_image_generation: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-13
	'editor-image-generation-styles-and-aspect-ratios': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-23
	confluence_advanced_header_image_generation_exp: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-17
	cc_page_experiences_premium_macros_img_generation: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-02
	aifc_page_create_with_rovo_include_infographics: {
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
	cc_maui_create_keyword: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-13
	confluence_native_tabs_experiment: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-26
	'cc-maui-ai-edit-loading-experiment': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-07
	'cc-maui-overlay-by-localid': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-22
	cc_maui_polish_changes_batch_1: {
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
	// Added 2026-05-11
	cfe_cwr_outcome_picker_respect_site_settings: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-12
	prompt_tile_content_type_localizaiton: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-24
	'cwr-modal-ui-refresh': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-08
	'cc-disambiguation-in-cwr': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-11
	'cwr-reduce-prompt-suggestion-max-chars': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-16
	platform_editor_fix_lagging_embed_resize_handle: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-15
	'cwr-staging-area-close-as-minimize-button': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-08
	cc_cwr_prompt_strength_indicator: {
		defaultValue: 'control' | 'variant1' | 'variant2';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'variant1' | 'variant2';
		values: ('control' | 'variant1' | 'variant2')[];
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
	// Added 2026-06-17
	platform_editor_emoji_hover_show_tooltip: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-11
	platform_teamoji_26_refresh_emoji_picker: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-16
	platform_use_unicode_emojis: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-30
	confluence_ai_generated_emojis: {
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
	// Added 2026-03-04
	platform_editor_ai_blockmenu_integration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-26
	platform_editor_remix_in_block_menu: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-19
	remix_iw_block_menu_table_calc_fix: {
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
	// Added 2026-03-05
	cc_drag_and_drop_smart_link_from_content_to_tree: {
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
	// Added 2026-06-24
	platform_editor_diff_granular_extended: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-20
	platform_editor_table_diff_rounded_corners: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-17
	platform_editor_improve_inline_diffs: {
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
	// Added 2026-03-06
	platform_editor_single_player_expand: {
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
	// Added 2026-06-10
	platform_editor_close_expand_find: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_table_fit_to_content_auto_convert: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_table_fit_to_content_on_demand: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-11
	platform_editor_external_embed_grid_fix: {
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
	// Added 2026-03-25
	platform_editor_improve_preset_builder_logging: {
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
	// Added 2026-04-14
	platform_editor_ai_multi_format_streaming: {
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
	// Added 2026-04-28
	platform_editor_expand_content_a11y: {
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
	// Added 2026-04-10
	platform_editor_static_css: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-01
	platform_editor_core_static_css: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-15
	platform_editor_core_non_ecc_static_css: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-30
	platform_editor_renderer_static_css: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-15
	platform_editor_ai_no_stream_skip_pacer: {
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
	// Added 2026-05-21
	platform_editor_fix_a11y_tab_focus_insertion_menu: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-12
	platform_editor_media_reliability_enhancements: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-23
	platform_editor_table_q4_loveability: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-16
	platform_editor_table_q4_patch_3: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-21
	platform_editor_table_q4_patch_4: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-11
	platform_editor_table_menu_updates: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-06
	confluence_live_doc_table_sort_bugfix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-16
	platform_editor_fix_table_move_shortcut: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	cc_dnd_smart_link_changeboard_platform_css: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-23
	work_item_modernization: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-17
	platform_editor_ai_template_localids: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-20
	platform_editor_ai_tablecell_localids: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-30
	confluence_fe_disable_comment_if_offline_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-30
	platform_editor_use_html_plus_parser: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-22
	platform_editor_korean_characters_split: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-28
	platform_editor_use_markdown_plus_parser: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-24
	platform_editor_ai_fix_error_discard_screen: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-04-30
	platform_editor_insert_menu_ai: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-05
	fix_copy_paste_external_media_renderer_to_editor: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};

	// Added 2026-05-15
	platform_editor_fix_sticky_header_malfunction: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-17
	platform_editor_fix_sticky_header_row: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	platform_editor_paste_actions_menu_v2: {
		defaultValue: 'control' | 'hasSpellingAndGrammar' | 'hasAltAiActions';
		param: string;
		productKeys?: ProductKeys;
		typeGuard: (value: unknown) => value is 'control' | 'hasSpellingAndGrammar' | 'hasAltAiActions';
		values: ('control' | 'hasSpellingAndGrammar' | 'hasAltAiActions')[];
	};
	// Added 2026-05-06
	'jira-smart-replies-v2': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-10
	confluence_editor_paste_3p_link_actions_menu: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-14
	platform_editor_fix_table_sort_with_mark: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-01
	platform_editor_ai_replace_doc: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-20
	platform_editor_default_toolbar_state: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-18
	platform_editor_nest_table_in_panel: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-20
	platform_rovo_support_create_inline_comment: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-19
	platform_editor_ai_improve_formatting_toolbar: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-25
	'a11y-fixes-week4-may-2026': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-26
	'a11y-fixes-week1-june-2026': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-29
	'a11y-fixes-week3-may-2026': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-16
	platform_a11y_fixes_reactions_selector_list: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-16
	platform_a11y_fixes_emoji_picker_list: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-25
	platform_editor_use_html_plus_streaming_parser: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-14
	platform_editor_ai_minion_skip_orchestrator: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-26
	platform_editor_wide_slash_trigger: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-05-11 — [CCI-15904] New AIFC Editor Experience (Full Page Staging + Post Stream Review)
	platform_editor_ai_new_aifc_editor_experience: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-01
	confluence_3p_in_cwr_ghost_icons: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-01
	platform_editor_lovability_text_bg_color: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-25
	platform_editor_fix_selection_text_color_change: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-08
	cc_ai_insert_to_page_rovo_chat_experiment: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-15
	platform_editor_menu_radius_update: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-20
	platform_editor_ssr_toolbar_optimistic: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-12 — CCI-17112 — convo-ai → cc-smarts routing for heading-autocomplete
	cc_smarts_heading_autocomplete_migration: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-26 — HUBS-850 — opt-in CSS var hook for editor block spacing
	platform_editor_extension_block_spacing: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-21
	platform_renderer_collapsible_headings: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-20
	platform_editor_lovability_breakout_resizing_fixes: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-19
	platform_editor_lovability_resize_dividers_panels: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-16
	platform_editor_add_breakout_marks_on_page_load: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-23
	'aifc-confluence-editor-csp-fix': {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-02
	platform_editor_media_download_fallback_name: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-06-29
	platform_editor_lovability_color_schema_change: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-01
	platform_editor_remove_pause_streaming: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
	// Added 2026-07-17
	revert_remix_ephemeral_iframe_sizing_fix: {
		defaultValue: boolean;
		param: string;
		productKeys?: ProductKeys;
		typeGuard: IsBooleanType;
	};
} = {
	// new format to avoid collisions with other users when updating the file

	// Added 2026-07-21
	// `isEnabled` is the gating param; the experiment's dynamic config also carries the numeric
	// `durationMs` shimmer duration, read at runtime via `expVal`.
	platform_editor_agent_be_streaming: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_agent_be_streaming',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-07-17
	platform_editor_status_popup_suggestions: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_status_popup_suggestions',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-06-25
	platform_editor_first_node_fix: createBooleanExperiment({
		productKeys: {
			jira: 'platform_editor_first_node_fix',
			confluence: 'platform_editor_first_node_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-06-09
	remix_button_right_margin_hover: createBooleanExperiment({
		productKeys: {
			confluence: 'remix_button_right_margin_hover',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

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
	// Added 2026-04-21
	cwr_page_tree_auto_finalize: createBooleanExperiment({
		productKeys: {
			confluence: 'cwr_page_tree_auto_finalize',
		},
		param: 'isEnabled',
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
	// Added 2026-07-20
	'editor_a11y__primary-toolbar-aria-label_fy27': createBooleanExperiment({
		productKeys: {
			confluence: 'editor_a11y__primary-toolbar-aria-label_fy27',
			jira: 'editor_a11y__primary-toolbar-aria-label_fy27',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-21
	'editor_a11y__toolbar-item-aria-described-by_fy27': createBooleanExperiment({
		productKeys: {
			confluence: 'editor_a11y__toolbar-item-aria-described-by_fy27',
			jira: 'editor_a11y__toolbar-item-aria-described-by_fy27',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-19
	'enghealth-53346_fix_redaction_marker_editor': createBooleanExperiment({
		productKeys: {
			jira: 'enghealth-53346_fix_redaction_marker_editor',
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
	// Added 2026-07-06
	confluence_comment_nudgebar_improvement: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_comment_nudgebar_improvement',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	confluence_quick_insert_embeds: createMultivariateExperiment({
		productKeys: {
			confluence: 'confluence_quick_insert_embeds',
		},
		param: 'cohort',
		values: ['control', 'prioritizeLinkInQIM', 'prioritizeEmbedInQIM'],
		defaultValue: 'control',
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
	// Added 2026-07-14
	platform_editor_dom_node_count: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_dom_node_count',
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
	// Added 2026-07-13
	platform_editor_fix_focus_MediaInsertPicker: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_focus_MediaInsertPicker',
			jira: 'platform_editor_fix_focus_MediaInsertPicker',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-08
	confluence_inline_comments_fix_stale_selection: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_inline_comments_fix_stale_selection',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-01
	rovo_remix_experience_context: createBooleanExperiment({
		productKeys: {
			confluence: 'rovo_remix_experience_context',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-28
	'agent-managed_blocks_mvp': createBooleanExperiment({
		productKeys: {
			confluence: 'agent-managed_blocks_mvp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-30
	'agent-managed-blocks-stop-block-template': createBooleanExperiment({
		productKeys: {
			confluence: 'agent-managed-blocks-stop-block-template',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-05
	'databases-native-embeds-v2': createBooleanExperiment({
		productKeys: {
			confluence: 'databases-native-embeds-v2',
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
	// Added 2025-11-17
	platform_editor_renderer_extension_width_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_renderer_extension_width_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-16
	platform_editor_table_col_insert: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_col_insert',
			jira: 'platform_editor_table_col_insert',
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
	// Added 2026-05-15
	platform_editor_per_plugin_error_boundary: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_per_plugin_error_boundary',
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
	// Added 2026-07-20
	platform_editor_table_sticky_header_patch_12: createBooleanExperiment({
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
	// Added 2024-12-05
	platform_editor_blockquote_in_text_formatting_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_blockquote_in_text_formatting_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-03-30
	platform_editor_editor_ssr_streaming: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_editor_ssr_streaming',
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
	// Added 2026-05-19
	platform_editor_controls_reliable_anchor: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_controls_reliable_anchor',
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
	// Added 2026-05-26
	platform_editor_agent_mentions: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_agent_mentions',
			jira: 'platform_editor_agent_mentions',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-14
	platform_editor_fix_table_sort_with_mark: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_table_sort_with_mark',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-09
	platform_editor_reduced_profile_cards: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_reduced_profile_cards',
			jira: 'platform_editor_reduced_profile_cards',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-25
	platform_editor_plus_menu_aria_label: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_plus_menu_aria_label',
			jira: 'platform_editor_plus_menu_aria_label',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-30
	platform_editor_fix_link_paste_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_link_paste_menu',
			jira: 'platform_editor_fix_link_paste_menu',
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
	// Added 2026-06-02
	platform_editor_layout_keywords: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_layout_keywords',
			jira: 'platform_editor_layout_keywords',
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
	// Added 2026-04-12
	platform_editor_confluence_base_preset: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_confluence_base_preset',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-30
	platform_editor_code_block_q4_lovability: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_code_block_q4_lovability',
			jira: 'platform_editor_code_block_q4_lovability',
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
	// Added 2026-17-03
	platform_editor_media_name_fallback: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_name_fallback',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-12
	platform_editor_media_name_fallback_viewer_card: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_name_fallback_viewer_card',
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
	// Added 2026-06-25
	jira_editor_a11y_toolbar_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'jira_editor_a11y_toolbar_fixes',
			jira: 'jira_editor_a11y_toolbar_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-30 (QS-9895)
	linking_platform_track_non_primary_3p_clicks: createBooleanExperiment({
		productKeys: {
			confluence: 'linking_platform_track_non_primary_3p_clicks',
			jira: 'linking_platform_track_non_primary_3p_clicks',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2025--8-05
	platform_editor_block_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_block_menu',
			jira: 'platform_editor_blocks_jira',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-09
	platform_editor_blocks: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_blocks_conf',
			jira: 'platform_editor_blocks_jira',
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
	// Added 2025-07-31
	platform_editor_breakout_interaction_rerender: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_breakout_interaction_rerender',
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
	// Added 2026-07-15
	cc_smarts_should_improve_writing_migration: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_smarts_should_improve_writing_migration',
		},
		param: 'routingMode',
		values: ['control', 'shadow_compare', 'live_cc_smarts'],
		defaultValue: 'control',
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
	// Added 2026-03-27 — Pre-auth unauthorised inline hover card UX
	platform_sl_3p_preauth_better_hovercard: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_preauth_better_hovercard',
			jira: 'platform_sl_3p_preauth_better_hovercard',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-29 — Inline rovo action on resolved inline smart links
	platform_sl_3p_auth_inline_tailored_cta: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_auth_inline_tailored_cta',
			jira: 'platform_sl_3p_auth_inline_tailored_cta',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-16 — Use link-extractors inline icon extraction for Confluence 1P/3P connection byline
	confluence_1p_and_3p_connection_byline_experiment: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_1p_and_3p_connection_byline_experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-21 — Post-auth GDrive Smart Link to Rovo Chat auto-open
	platform_sl_3p_post_auth_chat_open_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_post_auth_chat_open_exp',
			jira: 'platform_sl_3p_post_auth_chat_open_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-11 — Pre-auth inline CTA 'Preview' experiment for unauthorised 3P inline smart links
	'rovogrowth-635-pre-auth-cta-preview-exp': createBooleanExperiment({
		productKeys: {
			confluence: 'rovogrowth-635-pre-auth-cta-preview-exp',
			jira: 'rovogrowth-635-pre-auth-cta-preview-exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-29 — Social proof inline CTA for unauthorised 3P inline smart links
	platform_sl_3p_preauth_social_proof_inline_cta: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_preauth_social_proof_inline_cta',
			jira: 'platform_sl_3p_preauth_social_proof_inline_cta',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-15 — Embed card footer rovo action for resolved 3P smart links in confluence
	platform_sl_3p_auth_rovo_embed_footer_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_sl_3p_auth_rovo_embed_footer_exp',
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
	// Added 2026-04-16
	platform_editor_inline_media_replacement: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_inline_media_replacement',
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
	platform_editor_toolbar_submenu_open_click: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_toolbar_submenu_open_click',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-13
	platform_editor_hide_extension_renderer_support: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_hide_extension_renderer_support',
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
	// Added 2026-07-16
	platform_editor_fix_lagging_embed_resize_handle: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_lagging_embed_resize_handle',
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
	// Added 2026-02-05
	cc_fd_db_top_editor_toolbar: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_fd_db_top_editor_toolbar',
		},
		param: 'cohort',
		values: ['control', 'new-description', 'orig-description'],
		defaultValue: 'control',
	}),
	// Added 2026-04-02
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
	// Added 2026-07-20
	platform_editor_fix_ai_streaming_race: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_ai_streaming_race',
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
	platform_editor_fix_advanced_codeblocks_crlf_patch: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_advanced_codeblocks_crlf_patch',
			jira: 'platform_editor_fix_advanced_codeblocks_crlf_patch',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-01
	cc_page_experiences_editor_image_generation: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_page_experiences_editor_image_generation',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-13
	'editor-image-generation-styles-and-aspect-ratios': createBooleanExperiment({
		productKeys: {
			confluence: 'editor-image-generation-styles-and-aspect-ratios',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-23
	confluence_advanced_header_image_generation_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_advanced_header_image_generation_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-17
	cc_page_experiences_premium_macros_img_generation: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_page_experiences_premium_macros_img_generation',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-02
	aifc_page_create_with_rovo_include_infographics: createBooleanExperiment({
		productKeys: {
			confluence: 'aifc_page_create_with_rovo_include_infographics',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-02-23
	'cc-maui-experiment': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-maui-experiment',
			jira: 'jira_maui_remix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	cc_maui_create_keyword: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_maui_create_keyword',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-07-13
	confluence_native_tabs_experiment: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_native_tabs_experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-26
	'cc-maui-ai-edit-loading-experiment': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-maui-ai-edit-loading-experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-07
	'cc-maui-overlay-by-localid': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-maui-overlay-by-localid',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-22
	cc_maui_polish_changes_batch_1: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_maui_polish_changes_batch_1',
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
	// Added 2026-05-11
	cfe_cwr_outcome_picker_respect_site_settings: createBooleanExperiment({
		productKeys: {
			confluence: 'cfe_cwr_outcome_picker_respect_site_settings',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-12
	prompt_tile_content_type_localizaiton: createBooleanExperiment({
		productKeys: {
			confluence: 'prompt_tile_content_type_localizaiton',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-24
	'cwr-modal-ui-refresh': createBooleanExperiment({
		productKeys: {
			confluence: 'cwr-modal-ui-refresh',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-08
	'cc-disambiguation-in-cwr': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-disambiguation-in-cwr',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-11
	'cwr-reduce-prompt-suggestion-max-chars': createBooleanExperiment({
		productKeys: {
			confluence: 'cwr-reduce-prompt-suggestion-max-chars',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-15
	'cwr-staging-area-close-as-minimize-button': createBooleanExperiment({
		productKeys: {
			confluence: 'cwr-staging-area-close-as-minimize-button',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-08
	cc_cwr_prompt_strength_indicator: createMultivariateExperiment({
		productKeys: {
			confluence: 'cc_cwr_prompt_strength_indicator',
		},
		param: 'cohort',
		values: ['control', 'variant1', 'variant2'],
		defaultValue: 'control',
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
	// Added 2026-06-17
	platform_editor_emoji_hover_show_tooltip: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_emoji_hover_show_tooltip',
			jira: 'platform_editor_emoji_hover_show_tooltip',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-11
	platform_teamoji_26_refresh_emoji_picker: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_teamoji_26_refresh_emoji_picker',
			jira: 'platform_teamoji_26_refresh_emoji_picker',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-16
	platform_use_unicode_emojis: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_use_unicode_emojis_confluence',
			jira: 'platform_use_unicode_emojis_jira',
			bitbucket: 'platform_use_unicode_emojis_bitbucket',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-30
	confluence_ai_generated_emojis: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_ai_generated_emojis',
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
	// Added 2026-02-27
	platform_editor_early_exit_return_draft: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_early_exit_return_draft',
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
	// Added 2026-05-26
	platform_editor_remix_in_block_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remix_in_block_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-19 — fix table text length calculation for Remix/Improve Writing hero prompts
	remix_iw_block_menu_table_calc_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'remix_iw_block_menu_table_calc_fix',
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
	// Added 2026-03-04
	confluence_fe_renderer_inline_node_mark_color_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_fe_renderer_inline_node_mark_color_fix',
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
	// Added 2026-06-24
	platform_editor_diff_granular_extended: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_diff_granular_extended',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-20
	platform_editor_table_diff_rounded_corners: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_diff_rounded_corners',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-17
	platform_editor_improve_inline_diffs: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_improve_inline_diffs',
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
	// Added 2026-03-06
	platform_editor_single_player_expand: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_single_player_expand',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_table_fit_to_content_auto_convert: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_fit_to_content_auto_convert',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_table_fit_to_content_on_demand: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_fit_to_content_on_demand',
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
	// Added 2026-06-10
	platform_editor_close_expand_find: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_close_expand_find',
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
	// Added 2026-05-01
	platform_editor_ai_normalized_telemetry: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_normalized_telemetry',
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
	// Added 2026-03-25
	platform_editor_improve_preset_builder_logging: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_improve_preset_builder_logging',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-23
	'cc-markdown-mode': createBooleanExperiment({
		productKeys: {
			confluence: 'cc-markdown-mode',
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
	// Added 2026-04-14
	platform_editor_ai_multi_format_streaming: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_multi_format_streaming',
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
	// Added 2026-04-28
	platform_editor_expand_content_a11y: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_expand_content_a11y',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-15
	platform_editor_ai_no_stream_skip_pacer: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_no_stream_skip_pacer',
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
	// Added 2026-05-07
	platform_editor_layout_column_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_layout_column_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-15
	platform_editor_layout_column_valign_rendering: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_layout_column_valign_rendering',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-21
	platform_editor_layout_typeahead_reorder: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_layout_typeahead_reorder',
			jira: 'platform_editor_layout_typeahead_reorder',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-11
	platform_editor_external_embed_grid_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_external_embed_grid_fix',
			jira: 'platform_editor_external_embed_grid_fix',
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
	// Added 2026-06-30
	cc_fix_editor_context_on_cwr_followups: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_fix_editor_context_on_cwr_followups',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-09
	cc_fix_ephemeral_preview_staging_area_registration: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_fix_ephemeral_preview_staging_area_registration',
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
	// Added 2026-04-28
	platform_editor_use_markdown_plus_parser: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_use_markdown_plus_parser',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-30
	platform_editor_use_html_plus_parser: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_use_html_plus_parser',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-10
	platform_editor_static_css: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_renderer_static_css',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-01
	platform_editor_core_static_css: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_core_static_css',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-15
	platform_editor_core_non_ecc_static_css: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_core_non_ecc_static_css',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-30
	platform_editor_renderer_static_css: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_renderer_static_css',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-12
	platform_editor_media_reliability_enhancements: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_reliability_enhancements',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_table_q4_loveability: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_q4_loveability',
			jira: 'platform_editor_table_q4_loveability',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-16
	platform_editor_table_q4_patch_3: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_q4_patch_3',
			jira: 'platform_editor_table_q4_patch_3',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-21
	platform_editor_table_q4_patch_4: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_q4_patch_4',
			jira: 'platform_editor_table_q4_patch_4',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-11
	platform_editor_table_menu_updates: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_table_menu_updates',
			jira: 'platform_editor_table_menu_updates',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-06
	confluence_live_doc_table_sort_bugfix: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_live_doc_table_sort_bugfix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-16
	platform_editor_fix_table_move_shortcut: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_table_move_shortcut',
			jira: 'platform_editor_fix_table_move_shortcut',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-16
	cc_dnd_smart_link_changeboard_platform_css: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_dnd_smart_link_changeboard_platform_css',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-23
	work_item_modernization: createBooleanExperiment({
		productKeys: {
			jira: 'work_item_modernization',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-21
	platform_editor_fix_a11y_tab_focus_insertion_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_a11y_tab_focus_insertion_menu',
			jira: 'platform_editor_fix_a11y_tab_focus_insertion_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-30
	confluence_fe_disable_comment_if_offline_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_fe_disable_comment_if_offline_fix',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-22
	platform_editor_korean_characters_split: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_korean_characters_split',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-24
	platform_editor_ai_fix_error_discard_screen: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_fix_error_discard_screen',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-05
	editor_synced_block_perf: createBooleanExperiment({
		productKeys: {
			confluence: 'editor_synced_block_perf',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-09
	platform_editor_sync_block_activation: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_sync_block_activation',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-17
	platform_editor_ai_template_localids: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_template_localids',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-20
	platform_editor_ai_tablecell_localids: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_tablecell_localids',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-05
	fix_copy_paste_external_media_renderer_to_editor: createBooleanExperiment({
		productKeys: {
			confluence: 'fix_copy_paste_external_media_renderer_to_editor',
			jira: 'fix_copy_paste_external_media_renderer_to_editor',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-04-30
	platform_editor_insert_menu_ai: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_insert_menu_ai',
			jira: 'platform_editor_insert_menu_ai',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_paste_actions_menu_v2: createMultivariateExperiment({
		productKeys: {
			confluence: 'platform_editor_paste_actions_menu_v2',
			jira: 'platform_editor_paste_actions_menu_v2',
		},
		param: 'variant',
		values: ['control', 'hasSpellingAndGrammar', 'hasAltAiActions'],
		defaultValue: 'control',
	}),

	// Added 2026-05-01 — Social proof experiment for unauthorized 3P block cards
	social_proof_3p_unauth_block_exp: createBooleanExperiment({
		productKeys: {
			confluence: 'social_proof_3p_unauth_block_exp',
			jira: 'social_proof_3p_unauth_block_exp',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-06
	'jira-smart-replies-v2': createBooleanExperiment({
		productKeys: {
			jira: 'jira-smart-replies-v2',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-01
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_replace_doc/setup
	platform_editor_ai_replace_doc: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_replace_doc',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-18
	platform_editor_nest_table_in_panel: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_nest_table_in_panel',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-20
	platform_editor_default_toolbar_state: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_default_toolbar_state',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_rovo_support_create_inline_comment: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_rovo_support_create_inline_comment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-15
	platform_editor_fix_sticky_header_malfunction: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_sticky_header_malfunction',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-17
	platform_editor_fix_sticky_header_row: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_sticky_header_row',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-10
	confluence_editor_paste_3p_link_actions_menu: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_editor_paste_3p_link_actions_menu',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-19
	platform_editor_ai_improve_formatting_toolbar: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_improve_formatting_toolbar',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-25
	'a11y-fixes-week4-may-2026': createBooleanExperiment({
		productKeys: {
			confluence: 'a11y-fixes-week4-may-2026',
			jira: 'a11y-fixes-week4-may-2026',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-26
	'a11y-fixes-week1-june-2026': createBooleanExperiment({
		productKeys: {
			confluence: 'a11y-fixes-week1-june-2026',
			jira: 'a11y-fixes-week1-june-2026',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-29
	'a11y-fixes-week3-may-2026': createBooleanExperiment({
		productKeys: {
			confluence: 'a11y-fixes-week3-may-2026',
			jira: 'a11y-fixes-week3-may-2026',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-16
	platform_a11y_fixes_reactions_selector_list: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_a11y_fixes_reactions_selector_list',
			jira: 'platform_a11y_fixes_reactions_selector_list',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-16
	platform_a11y_fixes_emoji_picker_list: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_a11y_fixes_emoji_picker_list',
			jira: 'platform_a11y_fixes_emoji_picker_list',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-25
	// HTML+ v2 incremental tool-call streaming contract — gates the new
	// PartialStreamParserV2 / ToolCallProcessorV2 / AdfChunkStrategyV2 stack
	// in `@atlassian/editor-rovo-bridge`, the `replaceValue` orchestrator
	// action, and the `toolCallsStreaming.supportsProvisionalToolCalls`
	// capability advert on `PageContentCommandResult`.
	platform_editor_use_html_plus_streaming_parser: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_use_html_plus_streaming_parser',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-14
	platform_editor_ai_minion_skip_orchestrator: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_minion_skip_orchestrator',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	platform_editor_wide_slash_trigger: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_wide_slash_trigger',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-05-11 — [CCI-15904] New AIFC Editor Experience (Full Page Staging Area + Post Stream Review Toolbar)
	// https://console.statsig.com/LqivKg6ADZZaGczRfBKfX/experiments/platform_editor_ai_new_aifc_editor_experience/setup
	platform_editor_ai_new_aifc_editor_experience: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ai_new_aifc_editor_experience',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-01
	// Gates the `GhostIconWave` animation primitive in
	// `@atlassian/rovo-platform-ui-components` — rendered as a loading cue on
	// Confluence's 3p-in-CWR (Rovo) surfaces. When off the primitive renders
	// nothing.
	confluence_3p_in_cwr_ghost_icons: createBooleanExperiment({
		productKeys: {
			confluence: 'confluence_3p_in_cwr_ghost_icons',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-01
	platform_editor_lovability_text_bg_color: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_text_bg_color',
			jira: 'platform_editor_lovability_text_bg_color',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-25
	platform_editor_fix_selection_text_color_change: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_fix_selection_text_color_change',
			jira: 'platform_editor_fix_selection_text_color_change',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-08
	cc_ai_insert_to_page_rovo_chat_experiment: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_ai_insert_to_page_rovo_chat_experiment',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-15
	platform_editor_menu_radius_update: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_menu_radius_update',
			jira: 'platform_editor_menu_radius_update',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-20
	platform_editor_ssr_toolbar_optimistic: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_ssr_toolbar_optimistic',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	cc_smarts_heading_autocomplete_migration: createBooleanExperiment({
		productKeys: {
			confluence: 'cc_smarts_heading_autocomplete_migration',
		},
		param: 'useCcSmarts',
		defaultValue: false,
	}),

	// Added 2026-06-24 — HUBS-850 — gates the --ak-editor-extension-block-spacing block-margin hook
	platform_editor_extension_block_spacing: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_extension_block_spacing',
			jira: 'platform_editor_extension_block_spacing',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-21
	platform_renderer_collapsible_headings: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_renderer_collapsible_headings',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-07-20
	platform_editor_lovability_breakout_resizing_fixes: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_breakout_resizing_fixes',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),

	// Added 2026-06-19
	platform_editor_lovability_resize_dividers_panels: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_resize_dividers_panels',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-16
	platform_editor_add_breakout_marks_on_page_load: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_add_breakout_marks_on_page_load',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-23
	'aifc-confluence-editor-csp-fix': createBooleanExperiment({
		productKeys: {
			confluence: 'aifc-confluence-editor-csp-fix',
			jira: 'aifc-confluence-editor-csp-fix',
		},
		param: 'value',
		defaultValue: false,
	}),
	// Added 2026-07-02
	platform_editor_media_download_fallback_name: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_media_download_fallback_name',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-06-29
	platform_editor_lovability_color_schema_change: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_lovability_color_schema_change',
			jira: 'platform_editor_lovability_color_schema_change',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-01
	platform_editor_remove_pause_streaming: createBooleanExperiment({
		productKeys: {
			confluence: 'platform_editor_remove_pause_streaming',
		},
		param: 'isEnabled',
		defaultValue: false,
	}),
	// Added 2026-07-17
	revert_remix_ephemeral_iframe_sizing_fix: createBooleanExperiment({
		productKeys: {
			confluence: 'revert_remix_ephemeral_iframe_sizing_fix',
			jira: 'revert_remix_ephemeral_iframe_sizing_fix',
		},
		param: 'value',
		defaultValue: false,
	}),
} satisfies Record<string, ExperimentConfigValue>;
