import React from 'react';

import { BlockNodeBadges } from '../block-node-badges';

type Props = Omit<React.ComponentProps<typeof BlockNodeBadges>, 'element' | 'width' | 'height'> & {
	mediaElement?: HTMLElement | null;
	mediaHeight?: number;
	mediaWidth?: number;
};

/** Compatibility wrapper for existing media consumers of BlockNodeBadges. */
export const MediaBadges = ({
	mediaElement,
	mediaWidth,
	mediaHeight,
	children,
	extendedResizeOffset,
	useMinimumZIndex,
}: Props): React.JSX.Element => (
	<BlockNodeBadges
		element={mediaElement}
		width={mediaWidth}
		height={mediaHeight}
		extendedResizeOffset={extendedResizeOffset}
		useMinimumZIndex={useMinimumZIndex}
	>
		{children}
	</BlockNodeBadges>
);
