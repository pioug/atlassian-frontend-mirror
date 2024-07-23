/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type StyledBarProps } from './types';
import { styledBarStyles } from './styles';

export const StyledBar = (props: StyledBarProps) => {
	const { progress, breakpoint, positionBottom, showOnTop } = props;

	return (
		<div
			id="styledBar"
			role="progressbar"
			aria-valuenow={progress}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={styledBarStyles({
				progress,
				breakpoint,
				positionBottom,
				showOnTop,
			})}
		/>
	);
};
