import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ToolbarModelRenderer as ToolbarModelRendererNew } from './ToolbarRendererNew';
import { ToolbarModelRenderer as ToolbarModelRendererOld } from './ToolbarRendererOld';
import type { ToolbarProps } from './types';

export const ToolbarModelRenderer = ({ toolbar, components, fallbacks }: ToolbarProps): React.JSX.Element => {
	if (fg('platform_editor_toolbar_aifc_renderer_rewrite')) {
		return (
			<ToolbarModelRendererNew toolbar={toolbar} components={components} fallbacks={fallbacks} />
		);
	}

	return (
		<ToolbarModelRendererOld toolbar={toolbar} components={components} fallbacks={fallbacks} />
	);
};
