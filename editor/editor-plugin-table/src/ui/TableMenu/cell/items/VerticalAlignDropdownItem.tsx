import React, { useCallback, useMemo } from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl';

import type { Valign } from '@atlaskit/adf-schema/layout-column';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import type AlignPositionTopIcon from '@atlaskit/icon-lab/core/align-position-top';

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { setCellVerticalAlignmentWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getPluginState } from '../../../../pm-plugins/plugin-factory';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

import { getSelectedCellValign } from './verticalAlignUtils';

type VerticalAlignDropdownItemProps = TableMenuComponentsParams & {
	icon: typeof AlignPositionTopIcon;
	label: MessageDescriptor;
	value: Valign;
};

export const VerticalAlignDropdownItem = ({
	api,
	icon: Icon,
	label,
	value,
}: VerticalAlignDropdownItemProps): React.JSX.Element | null => {
	const { editorView } = useTableMenuContext() ?? {};
	const { formatMessage } = useIntl();
	const selectedValign = useMemo(() => getSelectedCellValign(editorView), [editorView]);
	const handleClick = useCallback(() => {
		if (!editorView || !api) {
			return;
		}

		const { targetCellPosition } = getPluginState(editorView.state);
		api.core.actions.execute(({ tr }) => {
			setCellVerticalAlignmentWithAnalytics(api.analytics?.actions)(
				INPUT_METHOD.TABLE_CONTEXT_MENU,
				value,
				targetCellPosition,
			)({ tr });
			closeActiveTableMenu(api)({ tr });
			return tr;
		});
		api.core.actions.focus();
	}, [api, editorView, value]);

	if (!editorView) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			elemBefore={<Icon color="currentColor" label="" size="small" />}
			isSelected={selectedValign === value}
			onClick={handleClick}
			role="menuitemradio"
		>
			{formatMessage(label)}
		</ToolbarDropdownItem>
	);
};
