import type { EditorExperimentsConfig } from './experiments-config';

type MultivariateConfig<Value> = Value extends boolean ? false : true;
type BooleanConfig<Value> = Value extends boolean ? true : false;

export type EditorExperimentOverridesMultivariate = {
	[K in keyof EditorExperimentsConfig as MultivariateConfig<
		EditorExperimentsConfig[K]['defaultValue']
	> extends true
		? K
		: never]: EditorExperimentsConfig[K]['defaultValue'];
};

export type EditorExperimentOverridesBoolean = {
	[K in keyof EditorExperimentsConfig as BooleanConfig<
		EditorExperimentsConfig[K]['defaultValue']
	> extends true
		? K
		: // Optional as boolean will default to true if not specified here
			never]?: EditorExperimentsConfig[K]['defaultValue'];
};

export const testMultivariateOverrides: EditorExperimentOverridesMultivariate = {
	'example-multivariate': 'one',
	'platform_editor_ai-prompts-placeholder': 'control',
	platform_editor_controls: 'control',
	cc_editor_ai_content_mode: 'control',
	platform_hover_card_preview_panel: 'control',
	smart_link_confluence_short_link_analytics: 'control',
	cc_editor_insm_outlier_events: 'test',
	platform_editor_table_sticky_header_improvements: 'test_with_overflow',
	platform_sl_3p_unauth_paste_as_block_card: 'control',
	cc_fd_db_top_editor_toolbar: 'control',
};

export const testBooleanOverrides: EditorExperimentOverridesBoolean = {
	cc_editor_hover_link_overlay_css_fix: false,
	platform_editor_feedback_mandatory_rating: false,
	platform_editor_preview_panel_responsiveness: false,
	platform_editor_toolbar_aifc: false,
	platform_editor_block_control_optimise_render: false,
	'test-new-experiments-package': false,
	support_table_in_comment: false,
	platform_editor_exp_lazy_node_views: false,
	platform_renderer_table_sticky_scrollbar: false,
	platform_editor_prevent_toolbar_layout_shifts: false,
	comment_on_bodied_extensions: false,
	advanced_layouts: false,
	single_column_layouts: false,
	support_table_in_comment_jira: false,
	platform_editor_ai_unsplash_page_header: false,
	platform_editor_blockquote_in_text_formatting_menu: false,
	platform_editor_element_drag_and_drop_multiselect: false,
	platform_editor_ai_edit_response_in_preview: false,
	platform_editor_offline_editing_web: false,
	platform_editor_tables_drag_and_drop: false,
	platform_editor_tables_table_selector: false,
	platform_renderer_fix_analytics_memo_callback: false,
	platform_editor_no_cursor_on_edit_page_init: false,
	'jira-work-sync-desc-comment-summary': false,
	platform_editor_breakout_resizing: false,
	platform_editor_ai_quickstart_command: false,
	platform_editor_block_controls_perf_optimization: false,
	platform_editor_enable_single_player_step_merging: false,
	platform_editor_find_and_replace_improvements: false,
	platform_editor_toggle_expand_on_match_found: false,
	platform_editor_reduce_noisy_steps_ncs: false,
	platform_editor_prosemirror_rendered_data: false,
	confluence_compact_text_format: false,
	platform_editor_paste_actions_menu: false,
};
