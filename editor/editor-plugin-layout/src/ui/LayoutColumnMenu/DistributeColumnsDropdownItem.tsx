import React from 'react';

import { useIntl } from 'react-intl';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';

type DistributeColumnsDropdownItemProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const DistributeColumnsDropdownItem = ({
	api,
}: DistributeColumnsDropdownItemProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const handleClick = () => {
		api?.core?.actions.execute(api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false }));
	};

	return (
		<ToolbarDropdownItem onClick={handleClick}>
			{formatMessage(layoutMessages.distributeColumns)}
		</ToolbarDropdownItem>
	);
};

export const createDistributeColumnsDropdownItem = (
	api: ExtractInjectionAPI<LayoutPlugin> | undefined,
) => {
	return (): React.JSX.Element => <DistributeColumnsDropdownItem api={api} />;
};
