/** @jsx jsx */
import type { CSSProperties } from 'react';

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
  height: PROGRESS_BAR_HEIGHT,
  position: 'absolute',
  left: '50%',
  backgroundColor: token('color.background.brand.bold', B300),
  borderBottomRightRadius: PROGRESS_BAR_HEIGHT,
  borderTopRightRadius: PROGRESS_BAR_HEIGHT,
  transform: `translate(0, -${LABEL_TOP_SPACING}px)`,
  transition: `width var(${varTransitionSpeed}) var(${varTransitionEasing})`,
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
    style={
      {
        width: `calc(${percentageComplete}% + ${
          percentageComplete / 100
        } * calc(var(${varSpacing}, ${spacing.cosy}px) + ${HALF_GRID_SIZE}px))`,
      } as CSSProperties
    }
    css={progressBarStyles}
  />
);

export default ProgressBar;
