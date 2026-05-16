import React from 'react';

import { cssMap } from '@compiled/react';

import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { PluginInjectionAPI } from '../../../types';

import { ROW_MENU } from './keys';

const rowMenuContainerStyles = cssMap({
	container: {
		width: '280px',
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
		backgroundColor: token('elevation.surface.overlay'),
		overflow: 'hidden',
	},
});

type RowMenuProps = {
	api: PluginInjectionAPI | undefined | null;
};

export const RowMenu = ({ api }: RowMenuProps): React.ReactNode => {
	const rowMenuComponents = api?.uiControlRegistry?.actions.getComponents(ROW_MENU.key) ?? [];
	const surface = rowMenuComponents.find((c) => c.type === ROW_MENU.type);
	if (!surface) {
		return null;
	}

	return (
		<Box xcss={rowMenuContainerStyles.container} testId="row-handle-menu">
			<SurfaceRenderer surface={surface} components={rowMenuComponents} />
		</Box>
	);
};
