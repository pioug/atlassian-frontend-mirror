import React from 'react';

import memoize from 'lodash/memoize';
import memoizeOne from 'memoize-one';
import type { WrappedComponentProps } from 'react-intl-next';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import {
	blockTypeMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { BlockType } from '@atlaskit/editor-plugin-block-type';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EmojiProvider } from '@atlaskit/emoji/resource';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	action,
	blockquote,
	codeblock,
	date,
	decision,
	emoji,
	expand,
	horizontalrule,
	imageUpload,
	layout,
	link,
	media,
	mention,
	more,
	panel,
	placeholder,
	status,
	table,
	tableSelector,
} from './item';
import { shallowEquals } from './shallow-equals';

export interface CreateItemsConfig {
	actionSupported?: boolean;
	availableWrapperBlockTypes?: BlockType[];
	dateEnabled?: boolean;
	decisionSupported?: boolean;
	emojiDisabled?: boolean;
	emojiProvider?: Promise<EmojiProvider> | EmojiProvider;
	expandEnabled?: boolean;
	formatMessage: WrappedComponentProps['intl']['formatMessage'];
	hasEmojiPlugin?: boolean;
	hasMediaPlugin?: boolean;
	hasMentionsPlugin?: boolean;
	horizontalRuleEnabled?: boolean;
	imageUploadEnabled?: boolean;
	imageUploadSupported?: boolean;
	insertMenuItems?: MenuItem[];
	isEditorOffline?: boolean;
	isNewMenuEnabled?: boolean;
	isTypeAheadAllowed?: boolean;
	layoutSectionEnabled?: boolean;
	linkDisabled?: boolean;
	linkSupported?: boolean;
	mediaSupported?: boolean;
	mediaUploadsEnabled?: boolean;
	mentionsDisabled?: boolean;
	mentionsSupported?: boolean;
	nativeStatusSupported?: boolean;
	numberOfButtons: number;
	placeholderTextEnabled?: boolean;
	schema: Schema;
	showElementBrowserLink?: boolean;
	tableSelectorSupported?: boolean;
	tableSupported?: boolean;
}

export interface BlockMenuItem extends MenuItem {
	title: JSX.Element | null;
}

const buttonToItem: (button: MenuItem) => BlockMenuItem = memoize(
	(button: MenuItem): BlockMenuItem => ({
		...button,
		title: <ToolTipContent description={button.content} shortcutOverride={button.shortcut} />,
	}),
);

const buttonToDropdownItem = memoizeOne((title: string): ((button: MenuItem) => BlockMenuItem) =>
	memoize(
		(button: MenuItem): BlockMenuItem => ({
			...button,
			title: <ToolTipContent description={title} shortcutOverride="/" />,
		}),
	),
);

const createInsertBlockItems = (
	config: CreateItemsConfig,
): Readonly<[BlockMenuItem[], BlockMenuItem[]]> => {
	const {
		isTypeAheadAllowed,
		tableSupported,
		tableSelectorSupported,
		mediaUploadsEnabled,
		mediaSupported,
		imageUploadSupported,
		imageUploadEnabled,
		mentionsSupported,
		mentionsDisabled,
		availableWrapperBlockTypes,
		actionSupported,
		decisionSupported,
		showElementBrowserLink,
		linkSupported,
		linkDisabled,
		emojiDisabled,
		emojiProvider,
		hasEmojiPlugin,
		hasMentionsPlugin,
		hasMediaPlugin,
		nativeStatusSupported,
		insertMenuItems,
		dateEnabled,
		placeholderTextEnabled,
		horizontalRuleEnabled,
		layoutSectionEnabled,
		expandEnabled,
		numberOfButtons,
		schema,
		formatMessage,
		isEditorOffline,
	} = config;

	const items: MenuItem[] = [];

	const isOffline = isEditorOffline === true;

	if (actionSupported) {
		items.push(
			action({
				content: formatMessage(messages.action),
				tooltipDescription: formatMessage(messages.actionDescription),
				disabled: false,
			}),
		);
	}

	if (linkSupported) {
		items.push(
			link({
				content: formatMessage(messages.link),
				tooltipDescription: formatMessage(messages.linkDescription),
				disabled: !!linkDisabled,
				'aria-haspopup': 'dialog',
			}),
		);
	}

	if (editorExperiment('platform_editor_prevent_toolbar_layout_shifts', true)) {
		if (imageUploadSupported) {
			items.push(
				imageUpload({
					content: formatMessage(messages.image),
					disabled: !imageUploadEnabled || isOffline,
				}),
			);
		} else if (hasMediaPlugin) {
			items.push(
				media({
					content: formatMessage(messages.addMediaFiles),
					tooltipDescription: formatMessage(messages.mediaFilesDescription),
					disabled: isOffline || !mediaSupported || !mediaUploadsEnabled,
				}),
			);
		}

		if (hasMentionsPlugin) {
			items.push(
				mention({
					content: formatMessage(messages.mention),
					tooltipDescription: formatMessage(messages.mentionDescription),
					disabled: !isTypeAheadAllowed || !!mentionsDisabled || !mentionsSupported,
					'aria-haspopup': 'listbox',
				}),
			);
		}

		if (hasEmojiPlugin) {
			items.push(
				emoji({
					content: formatMessage(messages.emoji),
					tooltipDescription: formatMessage(messages.emojiDescription),
					disabled: emojiDisabled || !isTypeAheadAllowed || !emojiProvider,
					'aria-haspopup': 'dialog',
				}),
			);
		}
	} else {
		if (mediaSupported && mediaUploadsEnabled) {
			items.push(
				media({
					content: formatMessage(messages.addMediaFiles),
					tooltipDescription: formatMessage(messages.mediaFilesDescription),
					disabled: isOffline,
				}),
			);
		}

		if (imageUploadSupported) {
			items.push(
				imageUpload({
					content: formatMessage(messages.image),
					disabled: !imageUploadEnabled || isOffline,
				}),
			);
		}

		if (mentionsSupported) {
			items.push(
				mention({
					content: formatMessage(messages.mention),
					tooltipDescription: formatMessage(messages.mentionDescription),
					disabled: !isTypeAheadAllowed || !!mentionsDisabled,
					'aria-haspopup': 'listbox',
				}),
			);
		}

		if (emojiProvider) {
			items.push(
				emoji({
					content: formatMessage(messages.emoji),
					tooltipDescription: formatMessage(messages.emojiDescription),
					disabled: emojiDisabled || !isTypeAheadAllowed,
					'aria-haspopup': 'dialog',
				}),
			);
		}
	}

	if (tableSupported) {
		items.push(
			table({
				content: formatMessage(messages.table),
				tooltipDescription: formatMessage(messages.tableDescription),
				disabled: false,
			}),
		);
	}

	if (tableSupported && tableSelectorSupported) {
		items.push(
			tableSelector({
				content: formatMessage(messages.tableSelector),
				tooltipDescription: formatMessage(messages.tableSelectorDescription),
				disabled: false,
			}),
		);
	}

	if (layoutSectionEnabled) {
		const labelColumns = formatMessage(messages.columns);
		items.push(
			layout({
				content: labelColumns,
				tooltipDescription: formatMessage(messages.columnsDescription),
				disabled: false,
			}),
		);
	}

	const blockTypes = availableWrapperBlockTypes || [];
	const codeblockData = blockTypes.find((type) => type.name === 'codeblock');
	const panelData = blockTypes.find((type) => type.name === 'panel');
	const blockquoteData = blockTypes.find((type) => type.name === 'blockquote');

	if (codeblockData) {
		items.push(
			codeblock({
				content: formatMessage(codeblockData.title),
				tooltipDescription: formatMessage(blockTypeMessages.codeblockDescription),
				disabled: false,
				shortcut: '```',
			}),
		);
	}

	if (panelData) {
		items.push(
			panel({
				content: formatMessage(panelData.title),
				tooltipDescription: formatMessage(blockTypeMessages.infoPanelDescription),
				disabled: false,
			}),
		);
	}

	if (blockquoteData) {
		items.push(
			blockquote({
				content: formatMessage(blockquoteData.title),
				tooltipDescription: formatMessage(blockTypeMessages.blockquoteDescription),
				disabled: false,
				shortcut: '>',
			}),
		);
	}

	if (decisionSupported) {
		items.push(
			decision({
				content: formatMessage(messages.decision),
				tooltipDescription: formatMessage(messages.decisionDescription),
				disabled: false,
			}),
		);
	}

	if (horizontalRuleEnabled && schema.nodes.rule) {
		items.push(
			horizontalrule({
				content: formatMessage(messages.horizontalRule),
				tooltipDescription: formatMessage(messages.horizontalRuleDescription),
				disabled: false,
			}),
		);
	}

	if (expandEnabled && schema.nodes.expand) {
		items.push(
			expand({
				content: formatMessage(messages.expand),
				tooltipDescription: formatMessage(messages.expandDescription),
				disabled: false,
			}),
		);
	}

	if (dateEnabled) {
		const labelDate = formatMessage(messages.date);
		items.push(
			date({
				content: labelDate,
				tooltipDescription: formatMessage(messages.dateDescription),
				disabled: false,
			}),
		);
	}

	if (placeholderTextEnabled) {
		items.push(
			placeholder({
				content: formatMessage(messages.placeholderText),
				disabled: false,
			}),
		);
	}

	if (nativeStatusSupported) {
		const labelStatus = formatMessage(messages.status);
		items.push(
			status({
				content: labelStatus,
				tooltipDescription: formatMessage(messages.statusDescription),
				disabled: false,
			}),
		);
	}

	if (insertMenuItems) {
		items.push(...insertMenuItems);
	}

	if (showElementBrowserLink && !fg('platform_editor_refactor_view_more')) {
		items.push(
			more({
				content: formatMessage(messages.viewMore),
				disabled: false,
			}),
		);
	}

	let numButtonsAdjusted = numberOfButtons;
	if (fg('platform_editor_toolbar_responsive_fixes')) {
		if (items.slice(0, numButtonsAdjusted).some((item) => item.value.name === 'table selector')) {
			numButtonsAdjusted++;
		}
	} else {
		numButtonsAdjusted =
			tableSupported && tableSelectorSupported ? numberOfButtons + 1 : numberOfButtons;
	}
	const buttonItems = items.slice(0, numButtonsAdjusted).map(buttonToItem);

	const remainingItems = items
		.slice(numButtonsAdjusted)
		.filter(({ value: { name } }) => name !== 'table selector');

	const dropdownItems = remainingItems.map(
		buttonToDropdownItem(formatMessage(messages.insertMenu)),
	);

	return [buttonItems, dropdownItems] as const;
};

export const createItems = memoizeOne(createInsertBlockItems, shallowEquals);
