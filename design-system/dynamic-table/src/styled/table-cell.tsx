/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getTruncationStyleVars, type TruncateStyleProps } from './constants';

const fixedSizeTruncateStyles = css({
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const overflowTruncateStyles = css({
	overflow: 'hidden',
});

const truncationWidthStyles = css({ width: `var(--local-dynamic-table-width)` });

const cellStyles = css({
	border: 'none',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
	textAlign: 'left',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:first-of-type': {
		paddingInlineStart: token('space.0', '0px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:last-child': {
		paddingInlineEnd: token('space.0', '0px'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const TableBodyCell: FC<TruncateStyleProps> = ({
	width,
	isFixedSize,
	shouldTruncate,
	innerRef,
	...props
}) => (
	<td
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		style={getTruncationStyleVars({ width }) as React.CSSProperties}
		css={[
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			truncationWidthStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			isFixedSize && overflowTruncateStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			cellStyles,
		]}
		// HOC withDimensions complains about the types but it is working fine
		// @ts-ignore
		ref={innerRef}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={props.className}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
