/** @jsx jsx */
import { useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	defaultGridColumnWidth,
	defaultLayout,
	spacingMapping,
	varColumnsNum,
	varGridSpacing,
} from './constants';
import { GridContext } from './grid-context';
import type { GridProps } from './types';

const gridStyles = css({
	display: 'flex',
	margin: '0 auto',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	padding: `0 calc(var(${varGridSpacing}) / 2)`,
	position: 'relative',
	alignItems: 'flex-start',
	flexWrap: 'wrap',
});

const gridLayoutStyles = {
	fixed: css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `calc(var(${varColumnsNum}) * ${defaultGridColumnWidth}px)`,
	}),
	fluid: css({
		maxWidth: '100%',
	}),
};

const nestedGridStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: `0 calc(-1 * var(${varGridSpacing}))`,
});

/**
 * __Grid__
 *
 * A container for one or more `GridColumn`.
 *
 * This is the internal component, which relies on the context provided by the
 * grid wrapper.
 *
 * @internal
 */
export const Grid = ({ layout = defaultLayout, testId, children }: GridProps) => {
	const { isNested, columns, spacing } = useContext(GridContext);

	return (
		<div
			css={[gridStyles, gridLayoutStyles[layout], isNested && nestedGridStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					[varColumnsNum]: columns,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					[varGridSpacing]: `${spacingMapping[spacing]}px`,
				} as React.CSSProperties
			}
			data-testid={testId}
		>
			{children}
		</div>
	);
};
