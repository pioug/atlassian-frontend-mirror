import React, { memo, useMemo } from 'react';

import { cssMap } from '@compiled/react';

import type { MenuType, RegisterComponent } from '@atlaskit/editor-ui-control-model';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { PluginInjectionAPI } from '../../../types';

type TableMenuProps = {
	api: PluginInjectionAPI | undefined | null;
	surface: MenuType;
};

const tableMenuContainerStyles = cssMap({
	container: {
		width: '280px',
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
		backgroundColor: token('elevation.surface.overlay'),
		overflow: 'hidden',
	},
});

export const TableMenu: React.MemoExoticComponent<
	(props: TableMenuProps) => React.JSX.Element | null
> = memo(({ api, surface }: TableMenuProps): React.JSX.Element | null => {
	const components: RegisterComponent[] = useMemo(
		() => api?.uiControlRegistry?.actions.getComponents(surface.key) ?? [],
		[api, surface.key],
	);

	if (components.length === 0) {
		return null;
	}

	return (
		<Box xcss={tableMenuContainerStyles.container} testId={surface.key}>
			<SurfaceRenderer surface={surface} components={components} />
		</Box>
	);
});
