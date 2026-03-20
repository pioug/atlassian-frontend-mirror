import {
	AI_PASTE_MENU_SECTION,
	AI_SECTION,
	APPS_SECTION,
	COLLAB_SECTION,
	IMPROVE_WRITING_GROUP,
	IMPROVE_WRITING_BUTTON,
	HERO_PROMPT_BUTTON_GROUP,
	HERO_PROMPT_BUTTON,
	HERO_PROMPT_MENU_ITEM,
	LINKING_SECTION,
	OVERFLOW_SECTION,
	ROVO_GROUP,
	ROVO_HERO_BUTTON,
	ROVO_MENU,
	TEXT_SECTION,
	MAKE_SHORTER_MENU_ITEM,
	MAKE_LONGER_MENU_ITEM,
	SPELLING_AND_GRAMMAR_MENU_ITEM,
	CHANGE_TONE_NESTED_MENU,
	CHANGE_TONE_MENU_SECTION,
	MORE_PROFESSIONAL_MENU_ITEM,
	MORE_CASUAL_MENU_ITEM,
	MORE_EMPATHETIC_MENU_ITEM,
	TRANSLATE_NESTED_MENU,
	COMMENT_GROUP,
	COMMENT_HERO_BUTTON,
	ROVO_PROMPT_MENU_SECTION,
	TRANSLATE_MENU_SECTION,
	TEXT_FORMATTING_GROUP,
	TEXT_FORMATTING_HERO_BUTTON,
	TEXT_FORMATTING_HERO_BUTTON_COLLAPSED,
	BOLD_BUTTON_GROUP,
	UNDERLINE_BUTTON_GROUP,
	TEXT_FORMATTING_MENU,
	TEXT_FORMATTING_MENU_SECTION,
	TEXT_STYLES_GROUP,
	TEXT_STYLES_MENU,
	TEXT_STYLES_MENU_SECTION,
	NORMAL_TEXT_MENU_ITEM,
	SMALL_TEXT_MENU_ITEM,
	HEADING_1_MENU_ITEM,
	HEADING_2_MENU_ITEM,
	HEADING_3_MENU_ITEM,
	HEADING_4_MENU_ITEM,
	HEADING_5_MENU_ITEM,
	HEADING_6_MENU_ITEM,
	BLOCK_QUOTE_MENU_ITEM,
	UNDERLINE_MENU_ITEM,
	ITALIC_MENU_ITEM,
	STRIKE_MENU_ITEM,
	BOLD_MENU_ITEM,
	CODE_MENU_ITEM,
	SUBSCRIPT_MENU_ITEM,
	SUPERSCRIPT_MENU_ITEM,
	CLEAR_FORMARTTING_MENU_SECTION,
	CLEAR_FORMATTING_MENU_ITEM,
	TEXT_COLOR_HIGHLIGHT_GROUP,
	TEXT_COLOR_MENU_ITEM,
	HIGHLIGHT_MENU_ITEM,
	CLEAR_COLOR_MENU_ITEM,
	TEXT_COLOR_HIGHLIGHT_MENU,
	TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
	PIN_MENU_ITEM,
	PIN_MENU_SECTION,
	OVERFLOW_MENU,
	OVERFLOW_GROUP,
	LINKING_GROUP,
	LINKING_BUTTON,
	ALIGNMENT_MENU,
	ALIGNMENT_GROUP,
	ALIGNMENT_MENU_SECTION,
	ALIGN_LEFT_MENU_ITEM,
	ALIGN_CENTER_MENU_ITEM,
	ALIGN_RIGHT_MENU_ITEM,
	LISTS_INDENTATION_GROUP,
	BULLETED_LIST_BUTTON,
	LISTS_INDENTATION_HERO_BUTTON,
	LISTS_INDENTATION_MENU,
	LISTS_INDENTATION_MENU_SECTION,
	NUMBERED_LIST_MENU_ITEM,
	BULLETED_LIST_MENU_ITEM,
	TASK_LIST_MENU_ITEM,
	OUTDENT_MENU_ITEM,
	INDENT_MENU_ITEM,
	TASK_LIST_GROUP,
	MEDIA_GROUP,
	MENTION_GROUP,
	LAYOUT_GROUP,
	TABLE_GROUP,
	EMOJI_GROUP,
	INSERT_BLOCK_SECTION,
	TASK_LIST_BUTTON,
	MEDIA_BUTTON,
	MENTION_BUTTON,
	EMOJI_BUTTON,
	LAYOUT_BUTTON,
	TABLE_BUTTON,
	TABLE_SIZE_PICKER,
	INSERT_GROUP,
	INSERT_BUTTON,
	TRACK_CHANGES_SECTION,
	UNDO_BUTTON,
	REDO_BUTTON,
	TRACK_CHANGES_BUTTON,
	UNDO_CHANGES_GROUP,
	REDO_CHANGES_GROUP,
	TRACK_CHANGES_GROUP,
	PIN_SECTION,
	PIN_BUTTON,
	PIN_GROUP,
	LOOM_MENU_SECTION,
	LOOM_MENU_ITEM,
	OVERFLOW_SECTION_PRIMARY_TOOLBAR,
	OVERFLOW_GROUP_PRIMARY_TOOLBAR,
	OVERFLOW_MENU_PRIMARY_TOOLBAR,
	TEXT_SECTION_COLLAPSED,
	TEXT_COLLAPSED_GROUP,
	TEXT_COLLAPSED_MENU,
	SELECTION_EXTENSION_MENU_SECTION,
	DEFINE_MENU_ITEM,
	DEFINE_BUTTON,
	DEFINE_GROUP,
	AI_VIEW_SECTION,
	LISTS_INDENTATION_HERO_BUTTON_COLLAPSED,
	BULLETED_LIST_BUTTON_GROUP,
	CODE_BLOCK_BUTTON,
	CODE_BLOCK_GROUP,
	IMPROVE_WRITING_MENU_ITEM,
	ROVO_MENU_DISPLAY_SMALL,
	ROVO_PROMPT_MENU_SECTION_DISPLAY_SMALL,
	ROVO_GROUP_DISPLAY_SMALL,
	ROVO_GROUP_PRIMARY_TOOLBAR,
	ROVO_WRITE_BUTTON_PRIMARY_TOOLBAR,
	SYNCED_BLOCK_GROUP,
	SYNCED_BLOCK_SECTION,
	SYNCED_BLOCK_BUTTON,
	ADD_POLISH_MENU_ITEM,
	OVERFLOW_EXTENSIONS_MENU_SECTION,
	FIRST_PARTY_EXTENSIONS_MENU_ITEM,
	EXTERNAL_EXTENSIONS_MENU_ITEM,
	PASTE_MENU_SECTION,
	PASTE_NESTED_MENU,
	PASTE_MENU_NESTED_SECTION,
	PASTE_RICH_TEXT_MENU_ITEM,
	PASTE_MARKDOWN_MENU_ITEM,
	PASTE_PLAIN_TEXT_MENU_ITEM,
} from './keys';

export const TOOLBAR_RANK: {
	readonly 'ai-section': 100;
	readonly 'ai-view-section': 100;
	readonly 'text-section': 200;
	/* Same rank as TEXT_SECTION as only one is ever shown at a time */
	readonly 'text-section-collapsed': 200;
	readonly 'insert-block-section': 300;
	readonly 'linking-section': 400;
	readonly 'collab-section': 500;
	readonly 'apps-section': 600;
	readonly 'track-changes-section': 700;
	readonly 'overflow-section': 800;
	readonly 'pin-section': 900;
	readonly 'overflow-section-primary-toolbar': 1000;
} = {
	[AI_SECTION.key]: 100,
	[AI_VIEW_SECTION.key]: 100,
	[TEXT_SECTION.key]: 200,
	/* Same rank as TEXT_SECTION as only one is ever shown at a time */
	[TEXT_SECTION_COLLAPSED.key]: 200,
	[INSERT_BLOCK_SECTION.key]: 300,
	[LINKING_SECTION.key]: 400,
	[COLLAB_SECTION.key]: 500,
	[APPS_SECTION.key]: 600,
	[TRACK_CHANGES_SECTION.key]: 700,
	[OVERFLOW_SECTION.key]: 800,
	[PIN_SECTION.key]: 900,
	[OVERFLOW_SECTION_PRIMARY_TOOLBAR.key]: 1000,
} as const;

/**
 * AI section
 */
export const AI_SECTION_RANK: {
	'rovo-group': number;
	'rovo-group-display-small': number;
	'rovo-group-primary-toolbar': number;
	'define-group': number;
	'improve-writing-group': number;
	'hero-prompt-button-group': number;
} = {
	[ROVO_GROUP.key]: 100,
	[ROVO_GROUP_DISPLAY_SMALL.key]: 100,
	[ROVO_GROUP_PRIMARY_TOOLBAR.key]: 100,
	[DEFINE_GROUP.key]: 200,
	[IMPROVE_WRITING_GROUP.key]: 300,
	[HERO_PROMPT_BUTTON_GROUP.key]: 300,
};

export const ROVO_GROUP_RANK: {
	'rovo-hero-button': number;
	'rovo-write-button-primary-toolbar': number;
	'rovo-menu': number;
} = {
	[ROVO_HERO_BUTTON.key]: 100,
	[ROVO_WRITE_BUTTON_PRIMARY_TOOLBAR.key]: 100,
	[ROVO_MENU.key]: 200,
};

export const ROVO_GROUP_DISPLAY_SMALL_RANK: {
	'rovo-hero-button': number;
	'rovo-menu-display-small': number;
} = {
	[ROVO_HERO_BUTTON.key]: 100,
	[ROVO_MENU_DISPLAY_SMALL.key]: 200,
};

export const DEFINE_GROUP_RANK: {
	'define-button': number;
} = {
	[DEFINE_BUTTON.key]: 100,
};

export const IMPROVE_WRITING_GROUP_RANK: {
	'improve-writing-button': number;
} = {
	[IMPROVE_WRITING_BUTTON.key]: 100,
};

export const HERO_PROMPT_BUTTON_GROUP_RANK: {
	'hero-prompt-button': number;
} = {
	[HERO_PROMPT_BUTTON.key]: 100,
};

export const ROVO_MENU_RANK: {
	'rovo-prompt-menu-section-display-small': number;
	'rovo-prompt-menu-section': number;
} = {
	[ROVO_PROMPT_MENU_SECTION_DISPLAY_SMALL.key]: 100,
	[ROVO_PROMPT_MENU_SECTION.key]: 100,
};

export const ROVO_PROMPT_MENU_SECTION_RANK: {
	'improve-writing-menu-item': number;
	'hero-prompt-menu-item': number;
	'add-polish-menu-item': number;
	'spelling-and-grammar-menu-item': number;
	'change-tone-nested-menu': number;
	'make-shorter-menu-item': number;
	'make-longer-menu-item': number;
	'translate-nested-menu': number;
	'define-menu-item': number;
} = {
	[IMPROVE_WRITING_MENU_ITEM.key]: 100,
	[HERO_PROMPT_MENU_ITEM.key]: 100,
	[ADD_POLISH_MENU_ITEM.key]: 100,
	[SPELLING_AND_GRAMMAR_MENU_ITEM.key]: 300,
	[CHANGE_TONE_NESTED_MENU.key]: 400,
	[MAKE_SHORTER_MENU_ITEM.key]: 500,
	[MAKE_LONGER_MENU_ITEM.key]: 600,
	[TRANSLATE_NESTED_MENU.key]: 700,
	[DEFINE_MENU_ITEM.key]: 800,
};

export const CHANGE_TONE_MENU_RANK: {
	'change-tone-default-menu-section': number;
} = {
	[CHANGE_TONE_MENU_SECTION.key]: 100,
};

export const CHANGE_TONE_MENU_SECTION_RANK: {
	'more-professional-menu-item': number;
	'more-casual-menu-item': number;
	'more-empathetic-menu-item': number;
} = {
	[MORE_PROFESSIONAL_MENU_ITEM.key]: 100,
	[MORE_CASUAL_MENU_ITEM.key]: 200,
	[MORE_EMPATHETIC_MENU_ITEM.key]: 300,
};

export const TRANSLATE_MENU_RANK: {
	'translate-menu-section': number;
} = {
	[TRANSLATE_MENU_SECTION.key]: 100,
};

/**
 * Text section
 */
export const TEXT_SECTION_RANK: {
	'text-styles-group': number;
	'text-formatting-group': number;
	'lists-indentation-group': number;
	'alignment-group': number;
	'text-color-highlight-group': number;
} = {
	[TEXT_STYLES_GROUP.key]: 100,
	[TEXT_FORMATTING_GROUP.key]: 200,
	[LISTS_INDENTATION_GROUP.key]: 300,
	[ALIGNMENT_GROUP.key]: 400,
	[TEXT_COLOR_HIGHLIGHT_GROUP.key]: 500,
};

export const TEXT_SECTION_PRIMARY_TOOLBAR_RANK: {
	'text-styles-group': number;
	'bold-button-group': number;
	'underline-button-group': number;
	'text-formatting-group': number;
	'bullet-list-button-group': number;
	'lists-indentation-group': number;
	'alignment-group': number;
	'text-color-highlight-group': number;
} = {
	[TEXT_STYLES_GROUP.key]: 100,
	[BOLD_BUTTON_GROUP.key]: 200,
	[UNDERLINE_BUTTON_GROUP.key]: 300,
	[TEXT_FORMATTING_GROUP.key]: 400,
	[BULLETED_LIST_BUTTON_GROUP.key]: 500,
	[LISTS_INDENTATION_GROUP.key]: 600,
	[ALIGNMENT_GROUP.key]: 700,
	[TEXT_COLOR_HIGHLIGHT_GROUP.key]: 800,
};

export const TEXT_SECTION_COLLAPSED_RANK: {
	'text-collapsed-group': number;
} = {
	[TEXT_COLLAPSED_GROUP.key]: 100,
};

export const TEXT_COLLAPSED_GROUP_RANK: {
	'text-collapsed-menu': number;
} = {
	[TEXT_COLLAPSED_MENU.key]: 100,
};

export const TEXT_COLLAPSED_MENU_RANK: {
	'text-styles-menu-section': number;
	'text-formatting-menu-section': number;
	'clear-formatting-menu-section': number;
	'lists-indendation-menu-section': number;
	'alignment-menu-section': number;
	'text-color-highlight-menu-section': number;
} = {
	[TEXT_STYLES_MENU_SECTION.key]: 100,
	[TEXT_FORMATTING_MENU_SECTION.key]: 200,
	[CLEAR_FORMARTTING_MENU_SECTION.key]: 300,
	[LISTS_INDENTATION_MENU_SECTION.key]: 400,
	[ALIGNMENT_MENU_SECTION.key]: 500,
	[TEXT_COLOR_HIGHLIGHT_MENU_SECTION.key]: 600,
};

/**
 * Text styles group
 */
export const TEXT_STYLES_GROUP_RANK: {
	'text-styles-menu': number;
} = {
	[TEXT_STYLES_MENU.key]: 100,
};

export const TEXT_STYLES_MENU_RANK: {
	'text-styles-menu-section': number;
} = {
	[TEXT_STYLES_MENU_SECTION.key]: 100,
};

export const TEXT_STYLES_MENU_SECTION_RANK: Record<string, number> = {
	[NORMAL_TEXT_MENU_ITEM.key]: 100,
	[SMALL_TEXT_MENU_ITEM.key]: 150,
	[HEADING_1_MENU_ITEM.key]: 200,
	[HEADING_2_MENU_ITEM.key]: 300,
	[HEADING_3_MENU_ITEM.key]: 400,
	[HEADING_4_MENU_ITEM.key]: 500,
	[HEADING_5_MENU_ITEM.key]: 600,
	[HEADING_6_MENU_ITEM.key]: 700,
	[BLOCK_QUOTE_MENU_ITEM.key]: 800,
};

/**
 * Text formatting group
 */
export const TEXT_FORMAT_GROUP_RANK: {
	'text-formatting-hero-button': number;
	'text-formatting-menu': number;
} = {
	[TEXT_FORMATTING_HERO_BUTTON.key]: 100,
	[TEXT_FORMATTING_MENU.key]: 200,
};

export const TEXT_FORMAT_GROUP_COLLAPSED_RANK: {
	'text-formatting-hero-button-collapsed': number;
	'text-formatting-menu': number;
} = {
	[TEXT_FORMATTING_HERO_BUTTON_COLLAPSED.key]: 100,
	[TEXT_FORMATTING_MENU.key]: 200,
};

export const TEXT_FORMAT_MENU_RANK: {
	'text-formatting-menu-section': number;
	'clear-formatting-menu-section': number;
} = {
	[TEXT_FORMATTING_MENU_SECTION.key]: 100,
	[CLEAR_FORMARTTING_MENU_SECTION.key]: 200,
};

export const TEXT_FORMATTING_MENU_SECTION_RANK: {
	'bold-menu-item': number;
	'italic-menu-item': number;
	'underline-menu-item': number;
	'strike-menu-item': number;
	'code-menu-item': number;
	'subscript-menu-item': number;
	'superscript-menu-item': number;
} = {
	[BOLD_MENU_ITEM.key]: 100,
	[ITALIC_MENU_ITEM.key]: 200,
	[UNDERLINE_MENU_ITEM.key]: 300,
	[STRIKE_MENU_ITEM.key]: 400,
	[CODE_MENU_ITEM.key]: 500,
	[SUBSCRIPT_MENU_ITEM.key]: 600,
	[SUPERSCRIPT_MENU_ITEM.key]: 700,
};

export const CLEAR_FORMARTTING_MENU_SECTION_RANK: {
	'clear-formatting-menu-item': number;
} = {
	[CLEAR_FORMATTING_MENU_ITEM.key]: 100,
};

export const SYNCED_BLOCK_SECTION_RANK: {
	'synced-block-button': number;
} = {
	[SYNCED_BLOCK_BUTTON.key]: 100,
};

/*
 * Lists and indentation group
 */
export const LISTS_INDENTATION_GROUP_RANK: {
	'bullet-list-button': number;
	'lists-indentation-hero-button': number;
	'lists-indentation-menu': number;
} = {
	[BULLETED_LIST_BUTTON.key]: 100,
	[LISTS_INDENTATION_HERO_BUTTON.key]: 200,
	[LISTS_INDENTATION_MENU.key]: 300,
};

export const LISTS_INDENTATION_GROUP_COLLAPSED_RANK: {
	'lists-indentation-hero-button-collapsed': number;
	'lists-indentation-menu': number;
} = {
	[LISTS_INDENTATION_HERO_BUTTON_COLLAPSED.key]: 100,
	[LISTS_INDENTATION_MENU.key]: 200,
};

export const LISTS_INDENTATION_MENU_RANK: {
	'lists-indendation-menu-section': number;
} = {
	[LISTS_INDENTATION_MENU_SECTION.key]: 100,
};

export const LISTS_INDENTATION_MENU_SECTION_RANK: {
	'bullet-list-menu-item': number;
	'numbered-list-menu-item': number;
	'task-list-menu-item': number;
	'outdent-menu-item': number;
	'indent-menu-item': number;
} = {
	[BULLETED_LIST_MENU_ITEM.key]: 100,
	[NUMBERED_LIST_MENU_ITEM.key]: 200,
	[TASK_LIST_MENU_ITEM.key]: 300,
	[OUTDENT_MENU_ITEM.key]: 400,
	[INDENT_MENU_ITEM.key]: 500,
};

/**
 * Alignment group
 */
export const ALIGNMENT_GROUP_RANK: {
	'alignment-menu': number;
} = {
	[ALIGNMENT_MENU.key]: 100,
};

export const ALIGNMENT_MENU_RANK: {
	'alignment-menu-section': number;
} = {
	[ALIGNMENT_MENU_SECTION.key]: 100,
};

export const ALIGNMENT_MENU_SECTION_RANK: {
	'align-left-menu-item': number;
	'align-center-menu-item': number;
	'align-right-menu-item': number;
} = {
	[ALIGN_LEFT_MENU_ITEM.key]: 100,
	[ALIGN_CENTER_MENU_ITEM.key]: 200,
	[ALIGN_RIGHT_MENU_ITEM.key]: 300,
};

/*
 * Text color and highlight
 */

export const TEXT_COLOR_HIGHLIGHT_GROUP_RANK: {
	'text-color-highlight-menu': number;
} = {
	[TEXT_COLOR_HIGHLIGHT_MENU.key]: 100,
};

export const TEXT_COLOR_HIGHLIGHT_MENU_RANK: {
	'text-color-highlight-menu-section': number;
} = {
	[TEXT_COLOR_HIGHLIGHT_MENU_SECTION.key]: 100,
};

export const TEXT_COLOR_HIGHLIGHT_MENU_SECTION_RANK: {
	'text-color-menu-item': number;
	'highlight-menu-item': number;
	'clear-color-menu-item': number;
} = {
	[TEXT_COLOR_MENU_ITEM.key]: 100,
	[HIGHLIGHT_MENU_ITEM.key]: 200,
	[CLEAR_COLOR_MENU_ITEM.key]: 300,
};

/**
 * Insert block section
 */

export const INSERT_BLOCK_SECTION_RANK: {
	'task-list-group': number;
	'media-group': number;
	'code-block-group': number;
	'mention-group': number;
	'emoji-group': number;
	'layout-group': number;
	'synced-block-group': number;
	'table-group': number;
	'insert-group': number;
} = {
	[TASK_LIST_GROUP.key]: 100,
	[MEDIA_GROUP.key]: 200,
	[CODE_BLOCK_GROUP.key]: 300,
	[MENTION_GROUP.key]: 400,
	[EMOJI_GROUP.key]: 500,
	[LAYOUT_GROUP.key]: 600,
	[SYNCED_BLOCK_GROUP.key]: 700,
	[TABLE_GROUP.key]: 800,
	[INSERT_GROUP.key]: 900,
};

export const TASK_LIST_GROUP_RANK: {
	'task-list-button': number;
} = {
	[TASK_LIST_BUTTON.key]: 100,
};

export const MEDIA_GROUP_RANK: {
	'media-button': number;
} = {
	[MEDIA_BUTTON.key]: 100,
};

export const CODE_BLOCK_GROUP_RANK: {
	'code-block-button': number;
} = {
	[CODE_BLOCK_BUTTON.key]: 100,
};

export const MENTION_GROUP_RANK: {
	'mention-button': number;
} = {
	[MENTION_BUTTON.key]: 100,
};

export const EMOJI_GROUP_RANK: {
	'emoji-button': number;
} = {
	[EMOJI_BUTTON.key]: 100,
};

export const LAYOUT_GROUP_RANK: {
	'layout-button': number;
} = {
	[LAYOUT_BUTTON.key]: 100,
};

export const TABLE_GROUP_RANK: {
	'table-button': number;
	'table-size-picker': number;
} = {
	[TABLE_BUTTON.key]: 100,
	[TABLE_SIZE_PICKER.key]: 200,
};

export const INSERT_GROUP_RANK: {
	'insert-button': number;
} = {
	[INSERT_BUTTON.key]: 100,
};

/**
 * Link section
 */
export const LINKING_SECTION_RANK: {
	'linking-group': number;
} = {
	[LINKING_GROUP.key]: 100,
};

export const LINKING_GROUP_RANK: {
	'linking-button': number;
} = {
	[LINKING_BUTTON.key]: 100,
};

/**
 * Collab section
 */
export const COLLAB_SECTION_RANK: {
	'comment-group': number;
} = {
	[COMMENT_GROUP.key]: 100,
};

export const COMMENT_GROUP_RANK: {
	'comment-hero-button': number;
} = {
	[COMMENT_HERO_BUTTON.key]: 100,
};

/**
 * Track changes section
 */

export const TRACK_CHANGES_SECTION_RANK: {
	'undo-changes-group': number;
	'redo-changes-group': number;
	'track-changes-group': number;
} = {
	[UNDO_CHANGES_GROUP.key]: 100,
	[REDO_CHANGES_GROUP.key]: 200,
	[TRACK_CHANGES_GROUP.key]: 300,
};

export const UNDO_CHANGES_GROUP_RANK: {
	'undo-button': number;
} = {
	[UNDO_BUTTON.key]: 100,
};

export const REDO_CHANGES_GROUP_RANK: {
	'redo-button': number;
} = {
	[REDO_BUTTON.key]: 100,
};

export const TRACK_CHANGES_GROUP_RANK: {
	'track-changes-button': number;
} = {
	[TRACK_CHANGES_BUTTON.key]: 100,
};

/**
 * Overflow section
 */
export const OVERFLOW_SECTION_RANK: {
	'overflow-group': number;
} = {
	[OVERFLOW_GROUP.key]: 100,
};

export const OVERFLOW_GROUP_RANK: {
	'overflow-menu': number;
} = {
	[OVERFLOW_MENU.key]: 100,
};

export const OVERFLOW_MENU_RANK: {
	'pin-menu-section': number;
	'loom-menu-section': number;
	'overflow-extensions-menu-section': number;
	'selection-extension-menu-section': number;
	'synced-block-section': number;
} = {
	[PIN_MENU_SECTION.key]: 100,
	[LOOM_MENU_SECTION.key]: 200,
	[OVERFLOW_EXTENSIONS_MENU_SECTION.key]: 300,
	[SELECTION_EXTENSION_MENU_SECTION.key]: 300,
	[SYNCED_BLOCK_SECTION.key]: 400,
};

export const PIN_MENU_SECTION_RANK: {
	'pin-menu-item': number;
} = {
	[PIN_MENU_ITEM.key]: 100,
};

export const OVERFLOW_EXTENSIONS_MENU_SECTION_RANK: {
	'loom-menu-item': number;
	'first-party-extensions-menu-item': number;
	'external-extensions-menu-item': number;
} = {
	[LOOM_MENU_ITEM.key]: 100,
	[FIRST_PARTY_EXTENSIONS_MENU_ITEM.key]: 200,
	[EXTERNAL_EXTENSIONS_MENU_ITEM.key]: 300,
};

/**
 * Overflow section in primary toolbar
 */
export const OVERFLOW_SECTION_PRIMARY_TOOLBAR_RANK: {
	'overflow-group-primary-toolbar': number;
} = {
	[OVERFLOW_GROUP_PRIMARY_TOOLBAR.key]: 100,
};

export const OVERFLOW_GROUP_PRIMARY_TOOLBAR_RANK: {
	'overflow-menu-primary-toolbar': number;
} = {
	[OVERFLOW_MENU_PRIMARY_TOOLBAR.key]: 100,
};

export const OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK: {
	'loom-menu-section': number;
} = {
	[LOOM_MENU_SECTION.key]: 100,
};

/**
 * Pin section
 */
export const PIN_SECTION_RANK: {
	'pin-group': number;
} = {
	[PIN_GROUP.key]: 100,
};

export const PIN_GROUP_RANK: {
	'pin-button': number;
} = {
	[PIN_BUTTON.key]: 100,
};

/**
 * Loom menu section
 */
export const LOOM_MENU_SECTION_RANK: {
	'loom-menu-item': number;
} = {
	[LOOM_MENU_ITEM.key]: 100,
};

/**
 * Paste options section
 */
export const PASTE_MENU_RANK: Record<string, number> = {
	[AI_PASTE_MENU_SECTION.key]: 50,
	[PASTE_MENU_SECTION.key]: 100,
};

export const PASTE_MENU_SECTION_RANK: {
	'paste-nested-menu': number;
} = {
	[PASTE_NESTED_MENU.key]: 100,
};

export const PASTE_NESTED_MENU_RANK: {
	'paste-menu-nested-section': number;
} = {
	[PASTE_MENU_NESTED_SECTION.key]: 100,
};

export const PASTE_MENU_NESTED_SECTION_RANK: {
	'rich-text-menu-item': number;
	'markdown-menu-item': number;
	'plain-text-menu-item': number;
} = {
	[PASTE_RICH_TEXT_MENU_ITEM.key]: 100,
	[PASTE_MARKDOWN_MENU_ITEM.key]: 200,
	[PASTE_PLAIN_TEXT_MENU_ITEM.key]: 300,
};
