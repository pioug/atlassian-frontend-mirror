/** @jsx jsx */

import { type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { scrollableContainerShadowsCssComponents } from '../../../issue-like-table';

const contentContainerStyles = xcss({
	display: 'grid',
	maxHeight: '420px',
	overflow: 'auto',
	borderBottom: `2px solid ${token('color.background.accent.gray.subtler', N40)}`,
	backgroundImage: scrollableContainerShadowsCssComponents.backgroundImage,
	backgroundPosition: scrollableContainerShadowsCssComponents.backgroundPosition,
	backgroundRepeat: scrollableContainerShadowsCssComponents.backgroundRepeat,
	backgroundSize: scrollableContainerShadowsCssComponents.backgroundSize,
	backgroundAttachment: scrollableContainerShadowsCssComponents.backgroundAttachment,
});

const tableContainerStyles = xcss({
	borderTopLeftRadius: token('border.radius.200', '8px'),
	borderTopRightRadius: token('border.radius.200', '8px'),
	border: `1px solid ${token('color.border', N40)}`,
});

export interface ContentContainerProps {
	children: ReactNode;
	withTableBorder?: boolean;
}

export const ContentContainer = ({ children, withTableBorder }: ContentContainerProps) => {
	return (
		<Box xcss={[contentContainerStyles, withTableBorder && tableContainerStyles]}>{children}</Box>
	);
};
