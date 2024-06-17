/** @jsx jsx */
import { type FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	cellStyles,
	fixedSizeTruncateStyles,
	getTruncationStyleVars,
	overflowTruncateStyles,
	type TruncateStyleProps,
	truncationWidthStyles,
} from './constants';

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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			truncationWidthStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			isFixedSize && shouldTruncate && fixedSizeTruncateStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			isFixedSize && overflowTruncateStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			cellStyles,
		]}
		// HOC withDimensions complains about the types but it is working fine
		// @ts-ignore
		ref={innerRef}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
