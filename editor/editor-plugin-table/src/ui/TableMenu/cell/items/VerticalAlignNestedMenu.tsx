import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { Valign } from '@atlaskit/adf-schema/layout-column';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { NestedDropdownRightIcon, ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import AlignPositionBottomIcon from '@atlaskit/icon-lab/core/align-position-bottom';
import AlignPositionCenterVerticalIcon from '@atlaskit/icon-lab/core/align-position-center-vertical';
import AlignPositionTopIcon from '@atlaskit/icon-lab/core/align-position-top';

import { useTableMenuContext } from '../../shared/TableMenuContext';

import { getSelectedCellValign } from './verticalAlignUtils';

const getTriggerIcon = (valign?: Valign) => {
	switch (valign) {
		case 'middle':
			return AlignPositionCenterVerticalIcon;
		case 'bottom':
			return AlignPositionBottomIcon;
		case 'top':
		default:
			return AlignPositionTopIcon;
	}
};

export const VerticalAlignNestedMenu = ({
	children,
}: {
	children?: React.ReactNode;
}): React.JSX.Element | null => {
	const { editorView } = useTableMenuContext() ?? {};
	const { formatMessage } = useIntl();
	const selectedValign = useMemo(() => getSelectedCellValign(editorView), [editorView]);
	const TriggerIcon = getTriggerIcon(selectedValign);

	if (!editorView) {
		return null;
	}

	return (
		<ToolbarNestedDropdownMenu
			elemBefore={<TriggerIcon color="currentColor" label="" size="small" />}
			elemAfter={<NestedDropdownRightIcon label="" size="small" />}
			text={formatMessage(messages.cellAlignment)}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
