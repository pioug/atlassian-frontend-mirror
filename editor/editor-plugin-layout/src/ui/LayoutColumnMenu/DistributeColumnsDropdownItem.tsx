import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';

import { useSelectedLayoutColumns } from './useSelectedLayoutColumns';

type DistributeColumnsDropdownItemProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

export const DistributeColumnsDropdownItem = ({
	api,
}: DistributeColumnsDropdownItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const selectedLayoutColumns = useSelectedLayoutColumns(api);

	const handleClick = useCallback(() => {
		api?.core?.actions.execute((props) => {
			const tr = api?.layout?.commands.distributeLayoutColumns(props);
			if (!tr) {
				return null;
			}

			const closedTr = api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false })({ tr });
			return closedTr ?? tr;
		});
	}, [api]);

	// Hide when selected columns are already evenly distributed — no-op action.
	// Must be before any early return to satisfy rules-of-hooks.
	const isAlreadyUniform = useMemo(() => {
		if (!selectedLayoutColumns || selectedLayoutColumns.selectedColumns.length < 2) {
			return false;
		}
		const selectedWidths = selectedLayoutColumns.selectedColumns.map(
			(col) => col.node.attrs.width as number,
		);
		const selectedTotal = selectedWidths.reduce((sum, w) => sum + w, 0);
		const equalWidth = Number((selectedTotal / selectedWidths.length).toFixed(2));
		return selectedWidths.every((w) => w === equalWidth);
	}, [selectedLayoutColumns]);

	if (selectedLayoutColumns === undefined || selectedLayoutColumns.selectedColumns.length < 2) {
		return null;
	}

	if (isAlreadyUniform) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick}>
			{formatMessage(layoutMessages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};
