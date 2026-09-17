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
	previewImageUrls: { dark: string; light: string };
	title: MessageDescriptor;
};

const standardPanelItems: PanelItem[] = [
	{
		description: blockTypeMessages.infoPanelDescription,
		icon: InformationCircleIcon,
		keywords: ['panel'],
		menuItem: INFO_PANEL_MENU_ITEM,
		panelType: PanelType.INFO,
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1ehbcks76dadn6s1ag865ovgv0725wf3.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/sj4h840me816r662ei5r630c56mrs7r3.png',
		},
		title: blockTypeMessages.infoPanel,
	},
	{
		description: blockTypeMessages.notePanelDescription,
		icon: NoteIcon,
		menuItem: NOTE_PANEL_MENU_ITEM,
		panelType: PanelType.NOTE,
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/248377u2ho62u47324ytqoh85dqha007.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/h60803y651s373xi527m1g77h0yfc10m.png',
		},
		title: blockTypeMessages.notePanel,
	},
	{
		description: blockTypeMessages.successPanelDescription,
		icon: CheckCircleIcon,
		keywords: ['tip'],
		menuItem: SUCCESS_PANEL_MENU_ITEM,
		panelType: PanelType.SUCCESS,
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/hsw851w22c21u6ax4t5fiuyb03yhvs16.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/wd47nv4tx2i1241dsnyv5j50hgibquo2.png',
		},
		title: blockTypeMessages.successPanel,
	},
	{
		description: blockTypeMessages.warningPanelDescription,
		icon: WarningOutlineIcon,
		menuItem: WARNING_PANEL_MENU_ITEM,
		panelType: PanelType.WARNING,
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/54op86o010736t82k472108al33sm3hl.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1058288r80467lk7vg0ymq8yp0fs42ws.png',
		},
		title: blockTypeMessages.warningPanel,
	},
	{
		description: blockTypeMessages.errorPanelDescription,
		icon: StatusWorkflowCancelledIcon,
		menuItem: ERROR_PANEL_MENU_ITEM,
		panelType: PanelType.ERROR,
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/526333021m38g0ndel1s4ljcma4ce2s0.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/c15gpkb25ds3078i0n8dp8k6o1io173f.png',
		},
		title: blockTypeMessages.errorPanel,
	},
];

const customPanelItem: PanelItem = {
	description: blockTypeMessages.customPanelDescription,
	icon: PencilIcon,
	menuItem: CUSTOM_PANEL_MENU_ITEM,
	panelType: PanelType.CUSTOM,
	previewImageUrls: {
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/kt0aor1ut1h72isq432188hmbs3du1l0.png',
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/f2m032ds3s1t81m362bp10ni7h8604xn.png',
	},
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

	return allPanelItems.map(
		({ description, icon, keywords, menuItem, panelType, previewImageUrls, title }) => ({
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
				<PanelQuickInsertMenuItem
					api={api}
					icon={icon}
					panelType={panelType}
					previewImageUrls={previewImageUrls}
					title={title}
				/>
			),
		}),
	);
};
