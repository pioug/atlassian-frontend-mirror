import React from 'react';

import { Popup } from '@atlaskit/editor-common/ui';

export interface Props {
	target: HTMLElement;
	content: React.ReactNode;
	alignX?: 'left' | 'center' | 'right';
	alignY?: 'top' | 'bottom' | 'start';
	zIndex?: number;
	forcePlacement?: boolean;
	stick?: boolean;
	offset?: [number, number];
}

export const FloatingToolbarLabel = React.memo((props: Props) => {
	const { target, content, alignX, alignY, zIndex, forcePlacement, stick, offset } = props;
	return (
		<Popup
			target={target}
			alignX={alignX}
			alignY={alignY}
			zIndex={zIndex}
			stick={stick}
			forcePlacement={forcePlacement}
			offset={offset}
		>
			{content}
		</Popup>
	);
});
