import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import type { TableDirection } from '../../types';
import { DragInMotionIcon } from '../icons/DragInMotionIcon';

const boxStyles = xcss({
	borderColor: 'color.border.focused',
	borderStyle: 'solid',
	borderRadius: 'border.radius.100',
	borderWidth: 'border.width.outline',
	backgroundColor: 'color.blanket.selected',
});

export const DragPreview = ({
	direction,
	width,
	height,
}: {
	direction: TableDirection;
	height: number;
	width: number;
}) => {
	const marginLeft = direction === 'row' ? -14 : width / 2 - 14;
	const marginTop = direction === 'row' ? height / 2 - 14 : -10;
	const transform = direction === 'row' ? 'rotate(90deg)' : 'none';
	return (
		<Box
			xcss={boxStyles}
			style={{
				width: `${width}px`,
				height: `${height}px`,
			}}
		>
			<DragInMotionIcon
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					marginLeft: `${marginLeft}px`,
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
					marginTop: `${marginTop}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					transform: transform,
				}}
			/>
		</Box>
	);
};
