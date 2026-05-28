import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';
import { isDistributedUniformly } from '../../pm-plugins/utils/layout-column-distribution';

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

	const isAlreadyUniform = useMemo(() => {
		if (!selectedLayoutColumns || selectedLayoutColumns.selectedColumns.length < 2) {
			return false;
		}
		const selectedWidths = selectedLayoutColumns.selectedColumns.map(
			(col) => col.node.attrs.width as number,
		);
		return isDistributedUniformly(selectedWidths);
	}, [selectedLayoutColumns]);

	if (selectedLayoutColumns === undefined || selectedLayoutColumns.selectedColumns.length < 2) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} isDisabled={isAlreadyUniform}>
			{formatMessage(layoutMessages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};
