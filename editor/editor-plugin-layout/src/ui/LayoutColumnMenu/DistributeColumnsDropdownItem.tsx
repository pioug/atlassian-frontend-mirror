import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
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
	const selectedLayoutColumnsResult = useSelectedLayoutColumns(api);
	const { selectedLayoutColumns } = selectedLayoutColumnsResult ?? {};

	const handleClick = useCallback(() => {
		api?.core?.actions.execute((props) => {
			const tr = api?.layout?.commands.distributeLayoutColumns({
				inputMethod: INPUT_METHOD.LAYOUT_COLUMN_MENU,
			})(props);

			if (!tr) {
				return null;
			}

			const closedTr = api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false })({ tr });
			return closedTr ?? tr;
		});
	}, [api]);

	const isAlreadyUniform = useMemo(() => {
		if (!selectedLayoutColumns || selectedLayoutColumns.length < 2) {
			return false;
		}
		const selectedWidths = selectedLayoutColumns.map((col) => col.node.attrs.width as number);
		return isDistributedUniformly(selectedWidths);
	}, [selectedLayoutColumns]);

	if (selectedLayoutColumns === undefined || selectedLayoutColumns.length < 2) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} isDisabled={isAlreadyUniform}>
			{formatMessage(layoutMessages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};
