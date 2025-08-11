import { useIntl } from 'react-intl-next';
import type { MessageDescriptor } from 'react-intl-next';

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
	TOOLBARS,
	UNDERLINE_MENU_ITEM,
} from '@atlaskit/editor-common/toolbar';
import type { TextFormattingState } from '@atlaskit/editor-common/types';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	BoldIcon,
	ItalicIcon,
	type IconComponent,
	UnderlineIcon,
	CodeIcon,
	StrikeThroughIcon,
	SubscriptIcon,
	SuperscriptIcon,
	type ToolbarButtonGroupLocation,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

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
import { type TextFormattingPlugin } from '../../../textFormattingPluginType';
import { getInputMethod } from '../input-method-utils';
import type { FormatOptionState, FormatOptions } from '../types';
import { ToolbarType } from '../types';

export type FormatComponentProps = {
	api?: ExtractInjectionAPI<TextFormattingPlugin>;
	parents: ToolbarComponentTypes;
	icon: IconComponent;
	shortcut: Keymap;
	title: MessageDescriptor;
	optionType: FormatOptions;
	toggleMarkWithAnalyticsCallback:
		| ToggleMarkWithAnalyticsEditorCommand
		| ClearFormattingWithAnalyticsEditorCommand;
	ariaLabel?: string;
	groupLocation?: ToolbarButtonGroupLocation;
};

export const getInputMethodFromParentKeys = (parentKeys: ToolbarComponentTypes) =>
	getInputMethod(
		parentKeys.at(-1)?.key === TOOLBARS.INLINE_TEXT_TOOLBAR
			? ToolbarType.FLOATING
			: ToolbarType.PRIMARY,
	);

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
}: Omit<FormatComponentProps, 'icon' | 'ariaLabel' | 'groupLocation'>) => {
	const { isActive, isDisabled, isHidden, isPluginInitialised } = useSharedPluginStateWithSelector(
		api,
		['textFormatting'],
		(states) => ({
			isActive: states.textFormattingState?.[`${optionType}Active` as keyof TextFormattingState],
			isDisabled:
				states.textFormattingState?.[`${optionType}Disabled` as keyof TextFormattingState],
			isHidden: states.textFormattingState?.[`${optionType}Hidden` as keyof TextFormattingState],
			isPluginInitialised: states.textFormattingState?.isInitialised,
		}),
	);

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

	const onClick = () => {
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
	rank: number;
	key: string;
	icon: IconComponent;
	title: MessageDescriptor;
	command: ToggleMarkWithAnalyticsEditorCommand;
	shortcut: Keymap;
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
