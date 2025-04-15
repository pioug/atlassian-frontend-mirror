import React from 'react';

import type { QuickInsertItemId } from '@atlaskit/editor-common/provider-factory';
import DividerElementIcon from '@atlaskit/icon-lab/core/divider-element';
import ExpandElementIcon from '@atlaskit/icon-lab/core/expand-element';
// Status
import LozengeIcon from '@atlaskit/icon-lab/core/lozenge';
// Codeblock
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import CalendarIcon from '@atlaskit/icon/core/calendar';
// Decision
import DecisionIcon from '@atlaskit/icon/core/decision';
// Emoji
import EmojiIcon from '@atlaskit/icon/core/emoji';
// Table
import GridIcon from '@atlaskit/icon/core/grid';
// Media, Media-insert
import ImageIcon from '@atlaskit/icon/core/image';
// Temporaty Panel icon
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
// Layout 2-cols
// import LayoutTwoColumnsIcon from '@atlaskit/icon/core/layout-two-columns';
// Layout 3-cols
import LayoutThreeColumnsIcon from '@atlaskit/icon/core/layout-three-columns';
// Link
import LinkIcon from '@atlaskit/icon/core/link';
// Mention
import MentionIcon from '@atlaskit/icon/core/mention';
// Placehoder icon for native elements:
// Date, Divider (rule), Expand, Layout (1, 4, 5 cols), Panel (all), Status
// import MinusIcon from '@atlaskit/icon/core/minus';
// Blockquote
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
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
					categories: ['text structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'media-insert':
				return {
					...item,
					icon: () => <ImageIcon label="" />,
					categories: ['media'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'mention':
				return {
					...item,
					icon: () => <MentionIcon label="" />,
					categories: ['collaborate'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'emoji':
				return {
					...item,
					icon: () => <EmojiIcon label="" />,
					categories: ['media'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'expand':
				return {
					...item,
					icon: () => <ExpandElementIcon label="" />,
					categories: ['page structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'table':
				return {
					...item,
					icon: () => <GridIcon label="" />,
					categories: ['page structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'codeblock':
				return {
					...item,
					icon: () => <AngleBracketsIcon label="" />,
					categories: ['text structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'status':
				return {
					...item,
					icon: () => <LozengeIcon label="" />,
					categories: ['text structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'infopanel':
				return {
					...item,
					icon: () => <InformationCircleIcon label="" />,
					categories: ['page structure'],
					shouldDisplayAtTop: true,
					title: 'Panel',
					tempKey,
				};
			case 'date':
				return {
					...item,
					icon: () => <CalendarIcon label="" />,
					categories: ['date'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'loom':
				return {
					...item,
					icon: () => <VideoIcon label="" />,
					categories: ['media'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'decision':
				return {
					...item,
					icon: () => <DecisionIcon label="" />,
					categories: ['text structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'threecolumnslayout':
				return {
					...item,
					icon: () => <LayoutThreeColumnsIcon label="" />,
					categories: ['page structure'],
					shouldDisplayAtTop: true,
					title: 'Layout',
					tempKey,
				};
			case 'hyperlink':
				return {
					...item,
					icon: () => <LinkIcon label="" />,
					categories: ['media'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'rule':
				return {
					...item,
					icon: () => <DividerElementIcon label="" />,
					categories: ['page structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'blockquote':
				return {
					...item,
					icon: () => <QuotationMarkIcon label="" />,
					categories: ['text structure'],
					shouldDisplayAtTop: true,
					tempKey,
				};
		}
	} else if (itemTitle) {
		switch (itemTitle) {
			case 'Assets':
				return {
					...item,
					categories: ['data'],
					tempKey,
				};
			case 'Jira Issues':
			case 'Jira Road Map':
				return {
					...item,
					categories: ['jira'],
					tempKey,
				};
			case 'Labels List':
			case 'Related Labels':
			case 'Labels Gadget':
			case 'Popular Labels':
				return {
					...item,
					categories: ['labels'],
					tempKey,
				};
			case 'Version Report':
			case 'Time to First Response':
			case 'Decision report':
			case 'Two Dimensional Filter Statistics':
			case 'Task report':
			case 'Issue Statistics':
			case 'Page Properties Report':
				return {
					...item,
					categories: ['reports'],
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
					categories: ['timelines'],
					tempKey,
				};
			case 'Create database':
			case 'Filter by label':
			case 'Chart':
			case 'Create Jira issue':
			case 'Content Report Table':
				return {
					...item,
					categories: ['data'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'Heat Map':
			case 'Pie Chart':
			case 'Time Since Chart':
			case 'Recently Created Chart':
			case 'Created vs. Resolved Chart':
			case 'Average Age Chart':
				return {
					...item,
					categories: ['charts'],
					tempKey,
				};
			case 'Agile Wallboard Gadget':
			case 'Sprint Burndown Gadget':
				return {
					...item,
					categories: ['gadgets'],
					tempKey,
				};

			case 'Anchor link':
			case 'Child pages':
			case 'Page Index':
				return {
					...item,
					categories: ['navigation'],
					tempKey,
				};
			case 'Table of contents':
				return {
					...item,
					categories: ['page structure'],
					tempKey,
				};
			case 'Insert Confluence list':
			case 'Live Search':
			case 'Page Tree Search':
			case 'Page Tree':
				return {
					...item,
					categories: ['search'],
					tempKey,
				};
			case 'Excerpt':
			case 'Recently Updated Dashboard':
			case 'Create from Template':
				return {
					...item,
					categories: ['connect pages'],
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
					categories: ['media'],
					tempKey,
				};
			case 'Create whiteboard':
				return {
					...item,
					categories: ['media'],
					shouldDisplayAtTop: true,
					tempKey,
				};
			case 'Contributors':
			case 'Contributors Summary':
			case 'User List':
			case 'Voted Issues':
			case 'User Profile':
			case 'Spaces List':
				return {
					...item,
					categories: ['collaborate'],
					tempKey,
				};
			case 'Gliffy Diagram':
				return {
					...item,
					categories: ['apps'],
					tempKey,
				};
			default:
				return {
					...item,
					tempKey,
				};
		}
	}

	return {
		...item,
		categories: ['apps'],
		// category: 'apps',
		// subCategory: undefined,
		tempKey,
	};
};

export const getMappedItems = (
	items: QuickInsertPanelItem[] | SideInsertPanelItem[],
): InsertPanelItem[] => {
	return items.map((item, index) => getItemData(item, index));
};
