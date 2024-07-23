/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundImage: scrollableContainerShadowsCssComponents.backgroundImage,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundPosition: scrollableContainerShadowsCssComponents.backgroundPosition,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundRepeat: scrollableContainerShadowsCssComponents.backgroundRepeat,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundSize: scrollableContainerShadowsCssComponents.backgroundSize,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
