import React from 'react';

import type { MessageDescriptor } from 'react-intl';

import { PanelType } from '@atlaskit/adf-schema/panel';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	CUSTOM_PANEL_MENU_ITEM,
	ERROR_PANEL_MENU_ITEM,
	INFO_PANEL_MENU_ITEM,
	NOTE_PANEL_MENU_ITEM,
	STRUCTURE_SECTION,
	SUCCESS_PANEL_MENU_ITEM,
	WARNING_PANEL_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';
import InformationCircleIcon from '@atlaskit/icon/core/information-circle';
import NoteIcon from '@atlaskit/icon/core/note';
import PencilIcon from '@atlaskit/icon-lab/core/pencil';
import StatusWorkflowCancelledIcon from '@atlaskit/icon-lab/core/status-workflow-cancelled';
import WarningOutlineIcon from '@atlaskit/icon-lab/core/warning-outline';

import type { PanelPlugin } from '../../panelPluginType';

import type { QuickInsertPanelType } from './PanelQuickInsertMenuItem';
import { PanelQuickInsertMenuItem } from './PanelQuickInsertMenuItem';

type PanelMenuItem =
	| typeof CUSTOM_PANEL_MENU_ITEM
	| typeof ERROR_PANEL_MENU_ITEM
	| typeof INFO_PANEL_MENU_ITEM
	| typeof NOTE_PANEL_MENU_ITEM
	| typeof SUCCESS_PANEL_MENU_ITEM
	| typeof WARNING_PANEL_MENU_ITEM;

type PanelItem = {
	description: MessageDescriptor;
	icon: React.ComponentType<{ label: string }>;
	keywords?: string[];
	menuItem: PanelMenuItem;
	panelType: QuickInsertPanelType;
	title: MessageDescriptor;
};

const standardPanelItems: PanelItem[] = [
	{
		description: blockTypeMessages.infoPanelDescription,
		icon: InformationCircleIcon,
		keywords: ['panel'],
		menuItem: INFO_PANEL_MENU_ITEM,
		panelType: PanelType.INFO,
		title: blockTypeMessages.infoPanel,
	},
	{
		description: blockTypeMessages.notePanelDescription,
		icon: NoteIcon,
		menuItem: NOTE_PANEL_MENU_ITEM,
		panelType: PanelType.NOTE,
		title: blockTypeMessages.notePanel,
	},
	{
		description: blockTypeMessages.successPanelDescription,
		icon: CheckCircleIcon,
		keywords: ['tip'],
		menuItem: SUCCESS_PANEL_MENU_ITEM,
		panelType: PanelType.SUCCESS,
		title: blockTypeMessages.successPanel,
	},
	{
		description: blockTypeMessages.warningPanelDescription,
		icon: WarningOutlineIcon,
		menuItem: WARNING_PANEL_MENU_ITEM,
		panelType: PanelType.WARNING,
		title: blockTypeMessages.warningPanel,
	},
	{
		description: blockTypeMessages.errorPanelDescription,
		icon: StatusWorkflowCancelledIcon,
		menuItem: ERROR_PANEL_MENU_ITEM,
		panelType: PanelType.ERROR,
		title: blockTypeMessages.errorPanel,
	},
];

const customPanelItem: PanelItem = {
	description: blockTypeMessages.customPanelDescription,
	icon: PencilIcon,
	menuItem: CUSTOM_PANEL_MENU_ITEM,
	panelType: PanelType.CUSTOM,
	title: blockTypeMessages.customPanel,
};

export const getPanelQuickInsertComponents = ({
	api,
	allowCustomPanel,
	allowCustomPanelEdit,
}: {
	allowCustomPanel: boolean;
	allowCustomPanelEdit: boolean;
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
}): RegisterMenuItem[] => {
	const allPanelItems: PanelItem[] = [
		...standardPanelItems,
		...(allowCustomPanel && allowCustomPanelEdit ? [customPanelItem] : []),
	];

	return allPanelItems.map(({ description, icon, keywords, menuItem, panelType, title }) => ({
		key: menuItem.key,
		type: menuItem.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[menuItem.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(description),
			keywords,
			title: formatMessage(title),
		})),
		component: () => (
			<PanelQuickInsertMenuItem api={api} icon={icon} panelType={panelType} title={title} />
		),
	}));
};
