import React, { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const styles = xcss({
	/* Reset inherited styles from toolbar */
	whiteSpace: 'initial',
	textAlign: 'initial',

	boxShadow: 'elevation.shadow.overflow',
	width: '340px',
	padding: 'space.200',
	borderRadius: 'radius.small',
	backgroundColor: 'elevation.surface.overlay',
});

export const MediaInsertWrapper: React.ForwardRefExoticComponent<
	{
		children?: React.ReactNode;
	} & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, { children?: React.ReactNode }>(({ children }, ref) => {
	return (
		<Box ref={ref} xcss={styles}>
			{children}
		</Box>
	);
});
