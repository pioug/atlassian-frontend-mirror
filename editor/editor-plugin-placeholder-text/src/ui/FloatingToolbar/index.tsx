/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Popup } from '@atlaskit/editor-common/ui';

import { container } from './styles';

export type Coordinates = {
	bottom?: number;
	left?: number;
	right?: number;
	top?: number;
};

export type PositionOffset = Coordinates;

export interface Props {
	absoluteOffset?: PositionOffset;
	alignX?: 'left' | 'center' | 'right';
	alignY?: 'bottom' | 'top';
	children?: React.ReactNode;
	className?: string;
	fitHeight?: number;
	fitWidth?: number;
	offset?: number[];
	onPositionCalculated?: (position: Coordinates) => Coordinates;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	target?: HTMLElement;
	zIndex?: number;
}

export default function FloatingToolbar({
	children,
	target,
	offset,
	fitWidth,
	fitHeight = 40,
	onPositionCalculated,
	popupsMountPoint,
	popupsBoundariesElement,
	className,
	absoluteOffset,
	alignX,
	alignY,
	zIndex,
}: Props) {
	if (!target) {
		return null;
	}

	return (
		<Popup
			absoluteOffset={absoluteOffset}
			alignX={alignX}
			alignY={alignY}
			target={target}
			zIndex={zIndex}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			offset={offset}
			fitWidth={fitWidth}
			fitHeight={fitHeight}
			onPositionCalculated={onPositionCalculated}
		>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={container(fitHeight)}
				data-testid="popup-container"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
			>
				{children}
			</div>
		</Popup>
	);
}
