import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { elementInsertSidePanel } from '@atlaskit/editor-common/messages';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { SideInsertPanel } from '@atlaskit/editor-element-browser';
import type { SideInsertPanelItem } from '@atlaskit/editor-element-browser';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import AddIcon from '@atlaskit/icon/core/add';
import { Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

type ViewAllButtonProps = {
	items: SideInsertPanelItem[];
	onItemInsert: (mode: SelectItemMode, index: number) => void;
	onPanelOpen?: () => void;
	editorApi?: PublicPluginAPI<ContextPanelPlugin>;
};

const viewAllButtonStyles = xcss({
	background: token('color.background.input.pressed'),

	position: 'sticky',
	bottom: '-4px',

	width: '100%',
	height: '40px',

	color: 'color.text.subtle',
	fontWeight: token('font.weight.medium'),

	':hover': {
		textDecoration: 'underline',
	},
	':active': {
		color: 'color.text',
	},
});

const INSERT_PANEL_WIDTH = 320;

export const ViewAllButton = ({
	items,
	editorApi,
	onItemInsert,
	onPanelOpen,
}: ViewAllButtonProps) => {
	const { formatMessage } = useIntl();

	const handleClick = useCallback(() => {
		const showContextPanel = editorApi?.contextPanel?.actions?.showPanel;
		if (!showContextPanel || !items) {
			return;
		}

		// Opens main editor controls side panel
		showContextPanel(
			{
				id: 'editor-element-insert-sidebar-panel',
				headerComponentElements: {
					headerLabel: elementInsertSidePanel.title,
					HeaderIcon: () => <AddIcon label={formatMessage(elementInsertSidePanel.title)} />,
				},
				BodyComponent: () => {
					return <SideInsertPanel items={items} onItemInsert={onItemInsert} />;
				},
			},
			'push',
			INSERT_PANEL_WIDTH,
		);

		// Closes typeahead
		if (onPanelOpen) {
			onPanelOpen();
		}
	}, [editorApi, formatMessage, items, onItemInsert, onPanelOpen]);

	return (
		<Pressable xcss={viewAllButtonStyles} onClick={handleClick}>
			{formatMessage(typeAheadListMessages.viewAllInserts)}
		</Pressable>
	);
};
