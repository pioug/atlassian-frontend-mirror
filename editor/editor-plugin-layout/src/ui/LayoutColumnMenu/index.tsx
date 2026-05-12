import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';

import type { LayoutPlugin } from '../../layoutPluginType';

import { LAYOUT_COLUMN_MENU, LAYOUT_COLUMN_MENU_FALLBACKS } from './components';

type LayoutColumnMenuProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

export const LayoutColumnMenu = ({ api }: LayoutColumnMenuProps): React.JSX.Element | null => {
	const { isLayoutColumnMenuOpen } = useSharedPluginStateWithSelector(
		api,
		['layout'],
		(states) => ({
			isLayoutColumnMenuOpen: states.layoutState?.isLayoutColumnMenuOpen ?? false,
		}),
	);
	if (!isLayoutColumnMenuOpen) {
		return null;
	}

	const components = api?.uiControlRegistry?.actions.getComponents(LAYOUT_COLUMN_MENU.key) ?? [];
	if (components.length === 0) {
		return null;
	}

	return (
		<SurfaceRenderer
			components={components}
			fallbacks={LAYOUT_COLUMN_MENU_FALLBACKS}
			surface={LAYOUT_COLUMN_MENU}
		/>
	);
};
