import React from 'react';

import type { QuickInsertItemId } from '@atlaskit/editor-common/provider-factory';
// Codeblock
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
// Decision
import DecisionIcon from '@atlaskit/icon/core/decision';
// Emoji
import EmojiIcon from '@atlaskit/icon/core/emoji';
// Media, Media-insert
import ImageIcon from '@atlaskit/icon/core/image';
// Layout 3-cols
import LayoutThreeColumnsIcon from '@atlaskit/icon/core/layout-three-columns';
// Layout 2-cols
import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';
// Link
import LinkIcon from '@atlaskit/icon/core/link';
// Mention
import MentionIcon from '@atlaskit/icon/core/mention';
// Placehoder icon for native elements:
// Date, Divider (rule), Expand, Layout (1, 4, 5 cols), Panel (all), Status
import MinusIcon from '@atlaskit/icon/core/minus';
// Blockquote
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
// Table
import SpreadsheetIcon from '@atlaskit/icon/core/spreadsheet';
// Action
import TaskIcon from '@atlaskit/icon/core/task';
// Loom
import VideoIcon from '@atlaskit/icon/core/video';

import type { QuickInsertPanelItem, SideInsertPanelItem, InsertPanelItem } from '../types';

const getItemData = (
	item: QuickInsertPanelItem | SideInsertPanelItem,
	tempKey: number,
): InsertPanelItem => {
	const itemId: QuickInsertItemId | undefined = item.id;
	const itemTitle: string = item.title;

	if (itemId && itemId !== 'datasource') {
		switch (itemId) {
			case 'action':
				return {
					...item,
					icon: () => <TaskIcon label="" />,
					category: 'structure',
					subcategory: 'text structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'media-insert':
				return {
					...item,
					icon: () => <ImageIcon label="" />,
					category: 'media',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'mention':
				return {
					...item,
					icon: () => <MentionIcon label="" />,
					category: 'collaborate',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'emoji':
				return {
					...item,
					icon: () => <EmojiIcon label="" />,
					category: 'collaborate',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'expand':
				return {
					...item,
					icon: () => <MinusIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'table':
				return {
					...item,
					icon: () => <SpreadsheetIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'codeblock':
				return {
					...item,
					icon: () => <AngleBracketsIcon label="" />,
					category: 'structure',
					subCategory: 'text structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'status':
				return {
					...item,
					icon: () => <MinusIcon label="" />,
					category: 'structure',
					subCategory: 'text structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'infopanel':
			case 'notepanel':
			case 'successpanel':
			case 'warningpanel':
			case 'errorpanel':
			case 'custompanel':
				return {
					...item,
					icon: () => <MinusIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'date':
				return {
					...item,
					icon: () => <MinusIcon label="" />,
					category: 'data',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'loom':
				return {
					...item,
					icon: () => <VideoIcon label="" />,
					category: 'media',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'decision':
				return {
					...item,
					icon: () => <DecisionIcon label="" />,
					category: 'structure',
					subCategory: 'text structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'unorderedList':
			case 'orderedList':
			case 'heading1':
			case 'heading2':
			case 'heading3':
			case 'heading4':
			case 'heading5':
			case 'heading6':
			case 'helpdialog':
				return {
					...item,
					shouldDisplay: false,
					tempKey,
				};
			case 'twocolumnslayout':
				return {
					...item,
					icon: () => <LayoutTwoColumnsIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'threecolumnslayout':
				return {
					...item,
					icon: () => <LayoutThreeColumnsIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'fourcolumnslayout':
			case 'fivecolumnslayout':
				return {
					...item,
					icon: () => <MinusIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'hyperlink':
				return {
					...item,
					icon: () => <LinkIcon label="" />,
					category: 'media',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'rule':
				return {
					...item,
					icon: () => <MinusIcon label="" />,
					category: 'structure',
					subCategory: 'page structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'blockquote':
				return {
					...item,
					icon: () => <QuotationMarkIcon label="" />,
					category: 'structure',
					subCategory: 'text structure',
					shouldDisplayAtTop: true,
					tempKey,
				};
		}
	} else if (itemTitle) {
		switch (itemTitle) {
			case 'Assets':
				return {
					...item,
					category: 'data',
					subCategory: undefined,
					tempKey,
				};
			case 'Jira Issues':
			case 'Jira Road Map':
				return {
					...item,
					category: 'data',
					subCategory: 'jira',
					tempKey,
				};
			case 'Labels List':
			case 'Related Labels':
			case 'Labels Gadget':
			case 'Popular Labels':
				return {
					...item,
					category: 'data',
					subCategory: 'labels',
					tempKey,
				};
			case 'Version Report':
			case 'Time to First Response':
			case 'Content Report Table':
			case 'Decision report':
			case 'Two Dimensional Filter Statistics':
			case 'Task report':
			case 'Issue Statistics':
			case 'Page Properties Report':
				return {
					...item,
					category: 'data',
					subCategory: 'reports',
					tempKey,
				};
			case 'Opsgenie Incident Timeline EU':
			case 'Opsgenie Incident Timeline':
			case 'Jira timeline':
			case 'JSM Incident Timeline EU':
			case 'JSM Incident Timeline':
			case 'Resolution Time':
				return {
					...item,
					category: 'data',
					subCategory: 'timelines',
					tempKey,
				};
			case 'Create database':
				return {
					...item,
					category: 'data',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'Heat Map':
			case 'Pie Chart':
			case 'Time Since Chart':
			case 'Chart':
			case 'Recently Created Chart':
			case 'Created vs. Resolved Chart':
			case 'Average Age Chart':
				return {
					...item,
					category: 'data',
					subCategory: 'charts',
					tempKey,
				};
			case 'Agile Wallboard Gadget':
			case 'Sprint Burndown Gadget':
				return {
					...item,
					category: 'data',
					subCategory: 'gadgets',
					tempKey,
				};

			case 'Anchor link':
			case 'Child pages (Children Display)':
			case 'Page Index':
				return {
					...item,
					category: 'structure',
					subCategory: 'navigation',
					tempKey,
				};
			case 'Table of contents':
				return {
					...item,
					category: 'structure',
					subCategory: 'page structure',
					tempKey,
				};
			case 'Insert Confluence list':
			case 'Live Search':
			case 'Page Tree Search':
			case 'Page Tree':
				return {
					...item,
					category: 'structure',
					subCategory: 'search',
					tempKey,
				};
			case 'Excerpt':
			case 'Recently Updated Dashboard':
			case 'Create from Template':
				return {
					...item,
					category: 'structure',
					subCategory: 'connect pages',
					tempKey,
				};
			case 'Powerpoint':
			case 'Excel':
			case 'Iframe':
			case 'Profile Picture':
			case 'Blog Posts':
			case 'Gallery':
			case 'Word':
			case 'PDF':
			case 'Widget Connector':
				return {
					...item,
					category: 'media',
					subCategory: undefined,
					tempKey,
				};
			case 'Create whiteboard':
				return {
					...item,
					category: 'media',
					subCategory: undefined,
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'Contributors':
			case 'Contributors Summary':
			case 'User List':
			case 'Voted Issues':
			case 'Spaces List':
				return {
					...item,
					category: 'collaborate',
					subCategory: undefined,
					tempKey,
				};
			case 'Gliffy Diagram':
				return {
					...item,
					category: 'apps',
					subCategory: undefined,
					tempKey,
				};
			default:
				return {
					...item,
					category: 'apps',
					subCategory: undefined,
					tempKey,
				};
		}
	}

	return {
		...item,
		category: 'apps',
		subCategory: undefined,
		tempKey,
	};
};

export const getMappedItems = (
	items: QuickInsertPanelItem[] | SideInsertPanelItem[],
): InsertPanelItem[] => {
	return items.map((item, index) => getItemData(item, index));
};
