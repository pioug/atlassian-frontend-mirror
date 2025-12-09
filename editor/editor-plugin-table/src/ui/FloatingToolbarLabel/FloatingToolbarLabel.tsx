import React from 'react';

import { Popup } from '@atlaskit/editor-common/ui';

interface Props {
	alignX?: 'left' | 'center' | 'right';
	alignY?: 'top' | 'bottom' | 'start';
	content: React.ReactNode;
	forcePlacement?: boolean;
	offset?: [number, number];
	stick?: boolean;
	target: HTMLElement;
	zIndex?: number;
}

export const FloatingToolbarLabel = React.memo((props: Props): React.JSX.Element => {
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
