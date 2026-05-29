import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';

import { useSelectedLayoutColumns } from './useSelectedLayoutColumns';

type DeleteColumnDropdownItemProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const DeleteColumnDropdownItem = ({
	api,
}: DeleteColumnDropdownItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const selectedLayoutColumns = useSelectedLayoutColumns(api);

	const onClick = useCallback(() => {
		const deleteCommand = api?.layout?.commands.deleteLayoutColumn;

		api?.core?.actions.execute((props) => {
			const tr = deleteCommand?.(props);
			if (!tr) {
				return tr ?? null;
			}

			api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false })({ tr });
			return tr;
		});
	}, [api]);

	if (selectedLayoutColumns === undefined) {
		return null;
	}

	const selectedColumnCount = selectedLayoutColumns.selectedLayoutColumns.length;

	return (
		<ToolbarDropdownItem onClick={onClick}>
			{formatMessage(layoutMessages.deleteColumn, { count: selectedColumnCount })}
		</ToolbarDropdownItem>
	);
};

export { DeleteColumnDropdownItem };
