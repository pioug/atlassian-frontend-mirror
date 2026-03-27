import React, { useCallback } from 'react';

import { cssMap, cx } from '@compiled/react';
import { useIntl } from 'react-intl-next';

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
	AI_PASTE_MENU_SECTION,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
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

import { getVisibleKeys } from './hasVisibleButton';
import { PasteOptionsDropdownButton } from './PasteOptionsDropdownButton';

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

const PasteMenuItem = ({ api, pasteType }: PasteMenuItemProps) => {
	const intl = useIntl();
	const { editorView } = useEditorToolbar();
	const editorAnalyticsAPI = api?.analytics?.actions;

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
					changeToRichTextWithAnalytics(editorAnalyticsAPI, 'pasteMenu')()(
						editorView.state,
						editorView.dispatch,
					);
					break;
				case 'markdown':
					changeToMarkdownWithAnalytics(editorAnalyticsAPI, plaintextLength, 'pasteMenu')()(
						editorView.state,
						editorView.dispatch,
					);
					break;
				case 'plain-text':
					changeToPlainTextWithAnalytics(editorAnalyticsAPI, plaintextLength, 'pasteMenu')()(
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

const PasteOptionsNestedMenu = ({
	children,
	hasVisibleAiActions,
}: {
	children: React.ReactNode;
	hasVisibleAiActions: boolean;
}) => {
	const intl = useIntl();
	const label = intl.formatMessage(messages.pasteMenuActionsPasteAs);

	if (!hasVisibleAiActions) {
		return (
			<PasteOptionsDropdownButton
				elemBefore={<ClipboardIcon size="small" label="" />}
				elemAfter={<ChevronDownIcon size="small" label="" />}
				label={label}
				testId="paste-options-nested-menu"
				tooltipContent={label}
			>
				{children}
			</PasteOptionsDropdownButton>
		);
	}

	return (
		<ToolbarNestedDropdownMenu
			elemBefore={<ClipboardIcon size="small" label={label} />}
			elemAfter={<ChevronRightIcon size="small" label="" />}
			testId="paste-options-nested-menu"
			text={label}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};

interface PasteMenuComponentsConfig {
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined;
}

const getHasVisibleAiActions = (
	api: ExtractInjectionAPI<PasteOptionsToolbarPlugin> | undefined,
): boolean => {
	const allComponents = api?.uiControlRegistry?.actions.getComponents(PASTE_MENU.key) ?? [];
	const aiMenuItems = allComponents.filter(
		(c) => c.type === 'menu-item' && c.parents?.some((p) => p.key === AI_PASTE_MENU_SECTION.key),
	);
	return getVisibleKeys(aiMenuItems, ['menu-item']).length > 0;
};

export const getPasteMenuComponents = ({ api }: PasteMenuComponentsConfig): RegisterComponent[] => [
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
		component: (props: Record<string, unknown>) => {
			const hasVisibleAiActions = getHasVisibleAiActions(api);

			if (!hasVisibleAiActions) {
				return <Box padding="space.050">{props.children as React.ReactNode}</Box>;
			}

			return (
				<ToolbarDropdownItemSection hasSeparator>
					{props.children as React.ReactNode}
				</ToolbarDropdownItemSection>
			);
		},
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
		component: (props: Record<string, unknown>) => {
			const hasVisibleAiActions = getHasVisibleAiActions(api);
			return (
				<PasteOptionsNestedMenu hasVisibleAiActions={hasVisibleAiActions}>
					{props.children as React.ReactNode}
				</PasteOptionsNestedMenu>
			);
		},
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
		component: () => <PasteMenuItem api={api} pasteType="rich-text" />,
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
		component: () => <PasteMenuItem api={api} pasteType="markdown" />,
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
		component: () => <PasteMenuItem api={api} pasteType="plain-text" />,
		parents: [
			{
				key: PASTE_MENU_NESTED_SECTION.key,
				type: PASTE_MENU_NESTED_SECTION.type,
				rank: PASTE_MENU_NESTED_SECTION_RANK[PASTE_PLAIN_TEXT_MENU_ITEM.key],
			},
		],
	},
];
