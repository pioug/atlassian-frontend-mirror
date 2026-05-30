import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleBold,
	toggleCode,
	toggleItalic,
	toggleStrikethrough,
	toggleSubscript,
	toggleSuperscript,
	toggleUnderline,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import {
	BOLD_MENU_ITEM,
	CODE_MENU_ITEM,
	ITALIC_MENU_ITEM,
	STRIKE_MENU_ITEM,
	SUBSCRIPT_MENU_ITEM,
	SUPERSCRIPT_MENU_ITEM,
	TEXT_FORMATTING_MENU_SECTION_RANK,
	UNDERLINE_MENU_ITEM,
	getInputMethodFromParentKeys,
} from '@atlaskit/editor-common/toolbar';
import type { TextFormattingState } from '@atlaskit/editor-common/types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	BoldIcon,
	ItalicIcon,
	UnderlineIcon,
	CodeIcon,
	StrikeThroughIcon,
	SubscriptIcon,
	SuperscriptIcon,
} from '@atlaskit/editor-toolbar';
import type { IconComponent } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import {
	toggleStrongWithAnalytics,
	toggleEmWithAnalytics,
	toggleUnderlineWithAnalytics,
	toggleCodeWithAnalytics,
	toggleStrikeWithAnalytics,
	toggleSubscriptWithAnalytics,
	toggleSuperscriptWithAnalytics,
} from '../../../editor-commands/toggle-mark';
import type {
	ToggleMarkWithAnalyticsEditorCommand,
	ClearFormattingWithAnalyticsEditorCommand,
} from '../../../editor-commands/types';
import type { TextFormattingPlugin } from '../../../textFormattingPluginType';
import type { FormatOptionState, FormatOptions } from '../types';

/**
 * Local copy of `@atlassian/editor-plugin-markdown-mode/source-view-utils`'s
 * `SourceViewInlineFormat` union. Kept here so this `@atlaskit/`-published
 * package doesn't depend on the `@atlassian/`-namespaced source-view-utils
 * subpath for type resolution. Must stay in sync with the source-of-truth
 * declaration in markdown-mode.
 */
type SourceViewInlineFormat = 'bold' | 'italic' | 'inlineCode' | 'strikethrough';

/**
 * Maps the text-formatting plugin's `FormatOptions` keys to their
 * `SourceViewInlineFormat` equivalents for the CM6 source view.
 * Only formats that have a markdown syntax equivalent are included —
 * underline, subscript, and superscript have no GFM equivalent and
 * are left as undefined (they remain PM-only).
 */
const FORMAT_OPTION_TO_SOURCE_VIEW: Partial<Record<FormatOptions, SourceViewInlineFormat>> = {
	strong: 'bold',
	em: 'italic',
	code: 'inlineCode',
	strike: 'strikethrough',
};

const SOURCE_VIEW_ANALYTICS_ACTION_SUBJECT_ID = {
	bold: ACTION_SUBJECT_ID.FORMAT_STRONG,
	italic: ACTION_SUBJECT_ID.FORMAT_ITALIC,
	inlineCode: ACTION_SUBJECT_ID.FORMAT_CODE,
	strikethrough: ACTION_SUBJECT_ID.FORMAT_STRIKE,
} satisfies Record<SourceViewInlineFormat, ACTION_SUBJECT_ID>;

const TEXT_FORMATTING_PLUGIN_STATE_KEYS: 'textFormatting'[] = ['textFormatting'];
const TEXT_FORMATTING_MARKDOWN_PLUGIN_STATE_KEYS: ('textFormatting' | 'markdownMode')[] = [
	'textFormatting',
	'markdownMode',
];

export type FormatComponentProps = {
	api?: ExtractInjectionAPI<TextFormattingPlugin>;
	ariaLabel?: string;
	icon: IconComponent;
	optionType: FormatOptions;
	parents: ToolbarComponentTypes;
	shortcut: Keymap;
	title: MessageDescriptor;
	toggleMarkWithAnalyticsCallback:
		| ToggleMarkWithAnalyticsEditorCommand
		| ClearFormattingWithAnalyticsEditorCommand;
};

const FormatMarkSchema: Record<FormatOptions, string> = {
	strong: 'strong',
	em: 'em',
	underline: 'underline',
	strike: 'strike',
	code: 'code',
	subscript: 'subsup',
	superscript: 'subsup',
};

export const useComponentInfo = ({
	api,
	optionType,
	title,
	shortcut,
	toggleMarkWithAnalyticsCallback,
	parents,
}: Omit<FormatComponentProps, 'icon' | 'ariaLabel' | 'groupLocation'>): {
	ariaLabel: string;
	formatTitle: string;
	isActive: boolean;
	isDisabled: boolean;
	isHidden: boolean;
	onClick: () => void;
	shortcutContent: string | undefined;
} => {
	const isMarkdownBridgeEnabled =
		expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
		fg('platform_editor_markdown_compatible_toolbar');
	const pluginStateKeys: ('textFormatting' | 'markdownMode')[] = isMarkdownBridgeEnabled
		? TEXT_FORMATTING_MARKDOWN_PLUGIN_STATE_KEYS
		: TEXT_FORMATTING_PLUGIN_STATE_KEYS;

	const {
		isActive,
		isDisabled,
		isHidden,
		isPluginInitialised,
		markdownModeView,
		sourceFormatState,
	} = useSharedPluginStateWithSelector(api, pluginStateKeys, (states) => ({
		isActive: states.textFormattingState?.[`${optionType}Active` as keyof TextFormattingState],
		isDisabled: states.textFormattingState?.[`${optionType}Disabled` as keyof TextFormattingState],
		isHidden: states.textFormattingState?.[`${optionType}Hidden` as keyof TextFormattingState],
		isPluginInitialised: states.textFormattingState?.isInitialised,
		markdownModeView: isMarkdownBridgeEnabled ? states.markdownModeState?.view : undefined,
		sourceFormatState: isMarkdownBridgeEnabled
			? states.markdownModeState?.sourceInlineFormatState
			: null,
	}));

	const hasMarkSchema =
		api?.core?.sharedState.currentState()?.schema?.marks[FormatMarkSchema[optionType]];

	let formatOptionState: FormatOptionState;

	if (!isPluginInitialised) {
		formatOptionState = {
			isActive: false,
			isDisabled: true,
			isHidden: false,
		};
	} else {
		formatOptionState = {
			isActive: Boolean(isActive),
			isDisabled: Boolean(isDisabled),
			isHidden: Boolean(!hasMarkSchema || isHidden),
		};
	}

	const { formatMessage } = useIntl();
	const formatTitle = formatMessage(title);
	const shortcutContent = tooltip(shortcut);
	const ariaLabel = tooltip(shortcut, formatTitle);

	// The SourceViewInlineFormat key for this format option, if it has one.
	// undefined for underline, subscript, superscript (no GFM equivalent).
	const sourceViewFormat = FORMAT_OPTION_TO_SOURCE_VIEW[optionType];

	// The CM6 source view is authoritative when the user has switched to it.
	// We rely on `markdownModeState.view === 'syntax'` (synchronous, set on
	// `setView`) rather than the presence of `sourceFormatState` — the latter
	// is `null` until the CM6 update listener fires for the first time, so
	// using it as the sentinel would let the first toolbar click after entering
	// source view fall through to the PM path and mutate the hidden PM doc.
	const isInSourceView = markdownModeView === 'syntax';

	if (isInSourceView && !sourceViewFormat) {
		// Underline, subscript, superscript have no GFM equivalent. Disable
		// them immediately on entering source view — independent of whether
		// the CM6 update listener has fired yet — so the buttons don't briefly
		// appear active/enabled during that race window.
		formatOptionState = {
			isActive: false,
			isDisabled: true,
			isHidden: false,
		};
	} else if (isInSourceView && sourceFormatState && sourceViewFormat) {
		// Map each SourceViewInlineFormat to its isActive field on the snapshot.
		const activeByFormat: Record<SourceViewInlineFormat, boolean> = {
			bold: sourceFormatState.boldActive,
			italic: sourceFormatState.italicActive,
			inlineCode: sourceFormatState.codeActive,
			strikethrough: sourceFormatState.strikeActive,
		};

		formatOptionState = {
			isActive: activeByFormat[sourceViewFormat],
			isDisabled: !sourceFormatState.inlineFormattingAvailable,
			isHidden: false,
		};
	} else if (isInSourceView) {
		// Race window: the user has switched to source view but the CM6 update
		// listener hasn't pushed its first format state snapshot yet
		// (`sourceFormatState` is still `null`). Without this branch the
		// button would render stale PM-cursor state (e.g. "Bold active" based
		// on where the PM selection was) until CM6 catches up. Render a
		// neutral, non-disabled state instead.
		formatOptionState = {
			isActive: false,
			isDisabled: false,
			isHidden: false,
		};
	}

	const onClick = (): void => {
		// Route to CM6 when in source view and the format has a CM6 equivalent.
		if (isInSourceView) {
			if (sourceViewFormat) {
				api?.analytics?.actions.fireAnalyticsEvent({
					action: ACTION.FORMATTED,
					actionSubject: ACTION_SUBJECT.TEXT,
					eventType: EVENT_TYPE.TRACK,
					actionSubjectId: SOURCE_VIEW_ANALYTICS_ACTION_SUBJECT_ID[sourceViewFormat],
					attributes: {
						inputMethod: getInputMethodFromParentKeys(parents),
					},
				});
				switch (sourceViewFormat) {
					case 'bold':
						api?.markdownMode?.actions.toggleSourceBold();
						break;
					case 'italic':
						api?.markdownMode?.actions.toggleSourceItalic();
						break;
					case 'inlineCode':
						api?.markdownMode?.actions.toggleSourceInlineCode();
						break;
					case 'strikethrough':
						api?.markdownMode?.actions.toggleSourceStrike();
						break;
				}
			}
			return;
		}

		// Default PM path.
		api?.core.actions.execute(
			toggleMarkWithAnalyticsCallback(api?.analytics?.actions)(
				getInputMethodFromParentKeys(parents),
			),
		);
	};

	return {
		...formatOptionState,
		formatTitle: formatTitle,
		shortcutContent,
		ariaLabel: ariaLabel || formatTitle,
		onClick,
	};
};

type FormatOptionInfo = {
	command: ToggleMarkWithAnalyticsEditorCommand;
	icon: IconComponent;
	key: string;
	rank: number;
	shortcut: Keymap;
	title: MessageDescriptor;
};

export const formatOptions = (): Record<FormatOptions, FormatOptionInfo> => ({
	strong: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[BOLD_MENU_ITEM.key],
		key: BOLD_MENU_ITEM.key,
		icon: BoldIcon,
		title: toolbarMessages.bold,
		command: toggleStrongWithAnalytics,
		shortcut: toggleBold,
	},
	em: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[ITALIC_MENU_ITEM.key],
		key: ITALIC_MENU_ITEM.key,
		icon: ItalicIcon,
		title: toolbarMessages.italic,
		command: toggleEmWithAnalytics,
		shortcut: toggleItalic,
	},
	underline: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[UNDERLINE_MENU_ITEM.key],
		key: UNDERLINE_MENU_ITEM.key,
		icon: UnderlineIcon,
		title: toolbarMessages.underline,
		command: toggleUnderlineWithAnalytics,
		shortcut: toggleUnderline,
	},
	strike: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[STRIKE_MENU_ITEM.key],
		key: STRIKE_MENU_ITEM.key,
		icon: StrikeThroughIcon,
		title: toolbarMessages.strike,
		command: toggleStrikeWithAnalytics,
		shortcut: toggleStrikethrough,
	},
	code: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[CODE_MENU_ITEM.key],
		key: CODE_MENU_ITEM.key,
		icon: CodeIcon,
		title: toolbarMessages.code,
		command: toggleCodeWithAnalytics,
		shortcut: toggleCode,
	},
	subscript: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[SUBSCRIPT_MENU_ITEM.key],
		key: SUBSCRIPT_MENU_ITEM.key,
		icon: SubscriptIcon,
		title: toolbarMessages.subscript,
		command: toggleSubscriptWithAnalytics,
		shortcut: toggleSubscript,
	},
	superscript: {
		rank: TEXT_FORMATTING_MENU_SECTION_RANK[SUPERSCRIPT_MENU_ITEM.key],
		key: SUPERSCRIPT_MENU_ITEM.key,
		icon: SuperscriptIcon,
		title: toolbarMessages.superscript,
		command: toggleSuperscriptWithAnalytics,
		shortcut: toggleSuperscript,
	},
});
