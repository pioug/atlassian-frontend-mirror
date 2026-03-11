import React, { useCallback } from 'react';

import { cssMap, cx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { pasteOptionsToolbarMessages as messages } from '@atlaskit/editor-common/messages';
import {
	useEditorToolbar,
	PASTE_MENU,
	PASTE_MENU_SECTION,
	PASTE_NESTED_MENU,
	PASTE_MENU_NESTED_SECTION,
	PASTE_RICH_TEXT_MENU_ITEM,
	PASTE_MARKDOWN_MENU_ITEM,
	PASTE_PLAIN_TEXT_MENU_ITEM,
	PASTE_MENU_RANK,
	PASTE_MENU_SECTION_RANK,
	PASTE_NESTED_MENU_RANK,
	PASTE_MENU_NESTED_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ClipboardIcon from '@atlaskit/icon/core/clipboard';
import { Box } from '@atlaskit/primitives/compiled';

import {
	changeToMarkdownWithAnalytics,
	changeToPlainTextWithAnalytics,
	changeToRichTextWithAnalytics,
} from '../../editor-commands/commands';
import type {
	PasteOptionsToolbarPlugin,
	PasteOptionsToolbarSharedState,
} from '../../pasteOptionsToolbarPluginType';
import { ToolbarDropdownOption, type PasteType } from '../../types/types';

const nestedMenuStyles = cssMap({
	narrowSection: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		button: {
			minWidth: '160px',
		},
	},
});

interface PasteMenuItemProps {
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	pasteType: PasteType;
}

export const isPasteOptionSelected = (
	pasteType: PasteType,
	selectedOption: ToolbarDropdownOption,
): boolean => {
	switch (pasteType) {
		case 'rich-text':
			return selectedOption === ToolbarDropdownOption.RichText;
		case 'markdown':
			return selectedOption === ToolbarDropdownOption.Markdown;
		case 'plain-text':
			return selectedOption === ToolbarDropdownOption.PlainText;
		default:
			return false;
	}
};

const PasteMenuItem = ({ api, editorAnalyticsAPI, pasteType }: PasteMenuItemProps) => {
	const intl = useIntl();
	const { editorView } = useEditorToolbar();

	const { selectedOption, plaintextLength, isPlainText } = useSharedPluginStateWithSelector(
		api,
		['pasteOptionsToolbarPlugin'],
		(states) => {
			const pluginState = states.pasteOptionsToolbarPluginState as
				| PasteOptionsToolbarSharedState
				| undefined;
			return {
				selectedOption: pluginState?.selectedOption ?? ToolbarDropdownOption.None,
				plaintextLength: pluginState?.plaintextLength ?? 0,
				isPlainText: pluginState?.isPlainText ?? false,
			};
		},
	);

	const getDefaultLabel = useCallback(
		(type: PasteType): string => {
			switch (type) {
				case 'rich-text':
					return intl.formatMessage(messages.richTextAction);
				case 'markdown':
					return intl.formatMessage(messages.markdownAction);
				case 'plain-text':
					return intl.formatMessage(messages.plainTextAction);
				default:
					return type;
			}
		},
		[intl],
	);

	const handleClick = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			e.preventDefault();
			if (!editorView) {
				return;
			}

			switch (pasteType) {
				case 'rich-text':
					changeToRichTextWithAnalytics(editorAnalyticsAPI)()(
						editorView.state,
						editorView.dispatch,
					);
					break;
				case 'markdown':
					changeToMarkdownWithAnalytics(editorAnalyticsAPI, plaintextLength)()(
						editorView.state,
						editorView.dispatch,
					);
					break;
				case 'plain-text':
					changeToPlainTextWithAnalytics(editorAnalyticsAPI, plaintextLength)()(
						editorView.state,
						editorView.dispatch,
					);
					break;
			}
		},
		[editorView, editorAnalyticsAPI, plaintextLength, pasteType],
	);

	if (pasteType === 'rich-text' && isPlainText) {
		return null;
	}

	const displayLabel = getDefaultLabel(pasteType);
	const isSelected = isPasteOptionSelected(pasteType, selectedOption);

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isSelected}
			testId={`paste-${pasteType}-menu-item`}
			hasNestedDropdownMenu
		>
			{displayLabel}
		</ToolbarDropdownItem>
	);
};

const PasteOptionsNestedMenu = ({ children }: { children: React.ReactNode }) => {
	const intl = useIntl();

	return (
		<ToolbarNestedDropdownMenu
			elemBefore={<ClipboardIcon size="small" label={intl.formatMessage(messages.pasteOptions)} />}
			elemAfter={
				<ChevronRightIcon size="small" label={intl.formatMessage(messages.pasteOptions)} />
			}
			testId="paste-options-nested-menu"
			text={intl.formatMessage(messages.pasteOptions)}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};

interface PasteMenuComponentsConfig {
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
}

export const getPasteMenuComponents = ({
	api,
	editorAnalyticsAPI,
}: PasteMenuComponentsConfig): RegisterComponent[] => [
	{
		type: PASTE_MENU.type,
		key: PASTE_MENU.key,
	},
	{
		type: PASTE_MENU_SECTION.type,
		key: PASTE_MENU_SECTION.key,
		parents: [
			{ type: PASTE_MENU.type, key: PASTE_MENU.key, rank: PASTE_MENU_RANK[PASTE_MENU_SECTION.key] },
		],
		isHidden: () => {
			const pluginState = api?.pasteOptionsToolbarPlugin?.sharedState.currentState() as
				| PasteOptionsToolbarSharedState
				| undefined;
			return !(pluginState?.showLegacyOptions ?? false);
		},
		component: (props: Record<string, unknown>) => (
			<ToolbarDropdownItemSection hasSeparator>
				{props.children as React.ReactNode}
			</ToolbarDropdownItemSection>
		),
	},
	{
		type: PASTE_NESTED_MENU.type,
		key: PASTE_NESTED_MENU.key,
		parents: [
			{
				type: PASTE_MENU_SECTION.type,
				key: PASTE_MENU_SECTION.key,
				rank: PASTE_MENU_SECTION_RANK[PASTE_NESTED_MENU.key],
			},
		],
		component: (props: Record<string, unknown>) => (
			<PasteOptionsNestedMenu>{props.children as React.ReactNode}</PasteOptionsNestedMenu>
		),
	},
	{
		type: PASTE_MENU_NESTED_SECTION.type,
		key: PASTE_MENU_NESTED_SECTION.key,
		parents: [
			{
				type: PASTE_NESTED_MENU.type,
				key: PASTE_NESTED_MENU.key,
				rank: PASTE_NESTED_MENU_RANK[PASTE_MENU_NESTED_SECTION.key],
			},
		],
		component: (props: Record<string, unknown>) => (
			<Box xcss={cx(nestedMenuStyles.narrowSection)}>
				<ToolbarDropdownItemSection>{props.children as React.ReactNode}</ToolbarDropdownItemSection>
			</Box>
		),
	},
	{
		key: PASTE_RICH_TEXT_MENU_ITEM.key,
		type: PASTE_RICH_TEXT_MENU_ITEM.type,
		component: () => (
			<PasteMenuItem api={api} editorAnalyticsAPI={editorAnalyticsAPI} pasteType="rich-text" />
		),
		parents: [
			{
				key: PASTE_MENU_NESTED_SECTION.key,
				type: PASTE_MENU_NESTED_SECTION.type,
				rank: PASTE_MENU_NESTED_SECTION_RANK[PASTE_RICH_TEXT_MENU_ITEM.key],
			},
		],
	},
	{
		key: PASTE_MARKDOWN_MENU_ITEM.key,
		type: PASTE_MARKDOWN_MENU_ITEM.type,
		component: () => (
			<PasteMenuItem api={api} editorAnalyticsAPI={editorAnalyticsAPI} pasteType="markdown" />
		),
		parents: [
			{
				key: PASTE_MENU_NESTED_SECTION.key,
				type: PASTE_MENU_NESTED_SECTION.type,
				rank: PASTE_MENU_NESTED_SECTION_RANK[PASTE_MARKDOWN_MENU_ITEM.key],
			},
		],
	},
	{
		key: PASTE_PLAIN_TEXT_MENU_ITEM.key,
		type: PASTE_PLAIN_TEXT_MENU_ITEM.type,
		component: () => (
			<PasteMenuItem api={api} editorAnalyticsAPI={editorAnalyticsAPI} pasteType="plain-text" />
		),
		parents: [
			{
				key: PASTE_MENU_NESTED_SECTION.key,
				type: PASTE_MENU_NESTED_SECTION.type,
				rank: PASTE_MENU_NESTED_SECTION_RANK[PASTE_PLAIN_TEXT_MENU_ITEM.key],
			},
		],
	},
];
