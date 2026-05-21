import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	LayoutIcon,
	NestedDropdownRightIcon,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';

import { getLayoutColumnValign } from './layoutColumnSelection';
import { useCurrentLayoutColumn } from './useCurrentLayoutColumn';
import { VERTICAL_ALIGN_ICONS } from './verticalAlignIcons';

export type VerticalAlignNestedMenuProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
	children?: React.ReactNode;
};

export const VerticalAlignNestedMenu = ({
	api,
	children,
}: VerticalAlignNestedMenuProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const currentColumn = useCurrentLayoutColumn(api);
	const currentValign = useMemo(() => getLayoutColumnValign(currentColumn), [currentColumn]);
	const TriggerIcon = currentValign ? VERTICAL_ALIGN_ICONS[currentValign] : LayoutIcon;

	if (!currentColumn) {
		return null;
	}

	return (
		<ToolbarNestedDropdownMenu
			elemBefore={<TriggerIcon label="" size="small" />}
			elemAfter={<NestedDropdownRightIcon label="" size="small" />}
			text={formatMessage(layoutMessages.alignColumn)}
		>
			{children}
		</ToolbarNestedDropdownMenu>
	);
};
