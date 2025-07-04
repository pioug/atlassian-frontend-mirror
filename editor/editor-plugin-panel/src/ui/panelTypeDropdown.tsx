import type React from 'react';

import type { IntlShape, MessageDescriptor } from 'react-intl-next';

import { PanelType } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { panelMessages as messages } from '@atlaskit/editor-common/messages';
import type {
	Command,
	DropdownOptionT,
	FloatingToolbarDropdown,
} from '@atlaskit/editor-common/types';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import DiscoveryIcon from '@atlaskit/icon/core/discovery';
import InformationIcon from '@atlaskit/icon/core/information';
import SuccessIcon from '@atlaskit/icon/core/success';
import WarningIcon from '@atlaskit/icon/core/warning';
import { token } from '@atlaskit/tokens';

import { changePanelType } from '../editor-actions/actions';

type Props = {
	activePanelType?: string;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	formatMessage: IntlShape['formatMessage'];
};

const panelTitleAndIcon: Record<
	string,
	{
		title: MessageDescriptor;
		icon: React.ReactNode;
	}
> = {
	[PanelType.INFO]: {
		title: messages.info,
		icon: InformationIcon({
			label: 'info-icon',
			color: token('color.icon.information'),
		}),
	},
	[PanelType.NOTE]: {
		title: messages.note,
		icon: DiscoveryIcon({
			label: 'note-icon',
			color: token('color.icon.discovery'),
		}),
	},
	[PanelType.SUCCESS]: {
		title: messages.success,
		icon: SuccessIcon({
			label: 'success-icon',
			color: token('color.icon.success'),
		}),
	},
	[PanelType.WARNING]: {
		title: messages.warning,
		icon: WarningIcon({
			label: 'warning-icon',
			color: token('color.icon.warning'),
		}),
	},
	[PanelType.ERROR]: {
		title: messages.error,
		icon: CrossCircleIcon({
			label: 'error-icon',
			color: token('color.icon.danger'),
		}),
	},
	[PanelType.CUSTOM]: {
		title: messages.custom,
		icon: CustomizeIcon({
			label: 'custom-icon',
		}),
	},
};

export const panelTypeDropdown = ({
	activePanelType,
	editorAnalyticsAPI,
	formatMessage,
}: Props): FloatingToolbarDropdown<Command> => {
	const dropdownOptions: DropdownOptionT<Command>[] = [
		{
			id: 'editor.panel.info',
			icon: panelTitleAndIcon[PanelType.INFO].icon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.INFO),
			selected: activePanelType === PanelType.INFO,
			title: formatMessage(panelTitleAndIcon[PanelType.INFO].title),
		},
		{
			id: 'editor.panel.note',
			icon: panelTitleAndIcon[PanelType.NOTE].icon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.NOTE),
			selected: activePanelType === PanelType.NOTE,
			title: formatMessage(panelTitleAndIcon[PanelType.NOTE].title),
		},
		{
			id: 'editor.panel.success',
			icon: panelTitleAndIcon[PanelType.SUCCESS].icon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.SUCCESS),
			selected: activePanelType === PanelType.SUCCESS,
			title: formatMessage(panelTitleAndIcon[PanelType.SUCCESS].title),
		},
		{
			id: 'editor.panel.warning',
			icon: panelTitleAndIcon[PanelType.WARNING].icon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.WARNING),
			selected: activePanelType === PanelType.WARNING,
			title: formatMessage(panelTitleAndIcon[PanelType.WARNING].title),
		},
		{
			id: 'editor.panel.error',
			icon: panelTitleAndIcon[PanelType.ERROR].icon,
			onClick: changePanelType(editorAnalyticsAPI)(PanelType.ERROR),
			selected: activePanelType === PanelType.ERROR,
			title: formatMessage(panelTitleAndIcon[PanelType.ERROR].title),
		},
	];

	const selectedPanelType = activePanelType || PanelType.INFO;
	const selectedTitleAndIcon = panelTitleAndIcon[selectedPanelType];
	return {
		id: 'panel-type-dropdown',
		testId: 'panel-type-dropdown-trigger',
		type: 'dropdown',
		options: dropdownOptions,
		showSelected: true,
		iconBefore: () => selectedTitleAndIcon.icon,
		title: formatMessage(selectedTitleAndIcon.title),
	};
};
