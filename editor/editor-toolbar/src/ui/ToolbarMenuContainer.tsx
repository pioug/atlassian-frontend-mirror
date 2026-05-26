/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';
import type { ReactNode } from 'react';

import { jsx, cssMap } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

type ToolbarMenuContainerProps = {
	children?: ReactNode;
};

/**
 * Shared visual shell for popup-hosted editor toolbar menus.
 *
 * This intentionally does not provide a trigger or popup positioning; callers own those concerns.
 */
export const ToolbarMenuContainer: React.ForwardRefExoticComponent<
	ToolbarMenuContainerProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, ToolbarMenuContainerProps>(
	({ children }, ref): React.JSX.Element => {
		return (
			<Box xcss={styles.container} data-toolbar-component="menu" role="menu" ref={ref}>
				{children}
			</Box>
		);
	},
);
