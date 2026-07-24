/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';

const iconSlotDivStyles = css({
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

type IconSlotProps = {
	h: number;
	icon: React.ReactNode;
	w: number;
	x: number;
	y: number;
};
const IconSlot = ({ icon, x, y, w, h }: IconSlotProps): React.JSX.Element | null => {
	if (!icon) {
		return null;
	}
	return (
		<foreignObject x={x} y={y} width={w} height={h}>
			<div css={iconSlotDivStyles}>{icon}</div>
		</foreignObject>
	);
};

export default IconSlot;
