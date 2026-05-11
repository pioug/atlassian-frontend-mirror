import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { LayoutPlugin } from '../../layoutPluginType';

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

	const placeholder = 'Mock Layout Column Menu';

	return <div>{placeholder}</div>;
};
