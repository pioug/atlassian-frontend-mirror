import React, { useCallback, useMemo } from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Valign } from '@atlaskit/editor-common/types/valign';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';

import { getLayoutColumnValign } from './layoutColumnSelection';
import { useCurrentLayoutColumn } from './useCurrentLayoutColumn';
import { VERTICAL_ALIGN_ICONS } from './verticalAlignIcons';

export type VerticalAlignOption = {
	label: MessageDescriptor;
	value: Valign;
};

type VerticalAlignDropdownItemProps = VerticalAlignOption & {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

export const VerticalAlignDropdownItem = ({
	api,
	label,
	value,
}: VerticalAlignDropdownItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const currentColumn = useCurrentLayoutColumn(api);
	const currentValign = useMemo(() => getLayoutColumnValign(currentColumn), [currentColumn]);
	const Icon = VERTICAL_ALIGN_ICONS[value];
	const onClick = useCallback(() => {
		api?.core?.actions.execute(api?.layout?.commands.setLayoutColumnValign(value));
	}, [api, value]);

	return (
		<ToolbarDropdownItem
			elemBefore={<Icon label="" size="small" />}
			isSelected={currentValign === value}
			onClick={onClick}
		>
			{formatMessage(label)}
		</ToolbarDropdownItem>
	);
};
