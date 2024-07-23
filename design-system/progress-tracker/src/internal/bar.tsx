/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { spacing } from '../constants';

import {
	HALF_GRID_SIZE,
	LABEL_TOP_SPACING,
	PROGRESS_BAR_HEIGHT,
	varSpacing,
	varTransitionDelay,
	varTransitionEasing,
	varTransitionSpeed,
} from './constants';

interface StageBarProps {
	testId?: string;
	percentageComplete: number;
}

const progressBarStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: PROGRESS_BAR_HEIGHT,
	position: 'absolute',
	backgroundColor: token('color.background.brand.bold', B300),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderEndEndRadius: PROGRESS_BAR_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderStartEndRadius: PROGRESS_BAR_HEIGHT,
	insetInlineStart: '50%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transform: `translate(0, calc(-1 * ${LABEL_TOP_SPACING}))`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width var(${varTransitionSpeed}) var(${varTransitionEasing})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transitionDelay: `var(${varTransitionDelay})`,
});

/**
 * __Progress bar__
 *
 * A progress bar describes the horizontal tracking bar that traverses each individual step.
 *
 */
const ProgressBar = ({ percentageComplete, testId }: StageBarProps) => (
	<div
		data-testid={testId}
		style={{
			width: `calc(${percentageComplete}% + ${
				percentageComplete / 100
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			} * calc(var(${varSpacing}, ${spacing.cosy}) + ${HALF_GRID_SIZE}))`,
		}}
		css={progressBarStyles}
	/>
);

export default ProgressBar;
