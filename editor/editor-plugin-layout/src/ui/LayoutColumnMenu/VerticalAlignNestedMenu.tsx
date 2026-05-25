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
import { getLayoutColumnValign } from '../../pm-plugins/utils/layout-column-selection';

import { useSelectedLayoutColumns } from './useSelectedLayoutColumns';
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
	const selectedLayoutColumns = useSelectedLayoutColumns(api);
	const currentValign = useMemo(() => {
		const selectedColumns = selectedLayoutColumns?.selectedColumns;
		const firstColumn = selectedColumns?.[0];
		const firstValign = getLayoutColumnValign(firstColumn?.node);

		if (
			!firstValign ||
			!selectedColumns?.every(({ node }) => getLayoutColumnValign(node) === firstValign)
		) {
			return undefined;
		}

		return firstValign;
	}, [selectedLayoutColumns]);
	const TriggerIcon = currentValign ? VERTICAL_ALIGN_ICONS[currentValign] : LayoutIcon;

	if (!selectedLayoutColumns) {
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
