import { type ReactNode, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const CSS_VAR_WIDTH = '--local-dynamic-table-width';

export interface TruncateStyleProps {
	width?: number;
	isFixedSize?: boolean;
	shouldTruncate?: boolean;
	children?: ReactNode;
	testId?: string;
	innerRef?: Ref<HTMLTableCellElement | HTMLTableRowElement> | undefined;
	className?: string;
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const truncationWidthStyles = css({ width: `var(${CSS_VAR_WIDTH})` });

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fixedSizeTruncateStyles = css({
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const overflowTruncateStyles = css({
	overflow: 'hidden',
});

export const getTruncationStyleVars = ({ width }: TruncateStyleProps) =>
	typeof width !== 'undefined' ? { [CSS_VAR_WIDTH]: `${width}%` } : undefined;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const cellStyles = css({
	padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
	border: 'none',
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type': {
		paddingInlineStart: token('space.0', '0px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:last-child': {
		paddingInlineEnd: token('space.0', '0px'),
	},
});
