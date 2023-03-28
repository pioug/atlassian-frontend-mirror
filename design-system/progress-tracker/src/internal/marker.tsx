/* eslint-disable @repo/internal/styles/no-nested-styles */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import {
  LABEL_TOP_SPACING,
  PROGRESS_BAR_HEIGHT,
  varBackgroundColor,
  varMarkerColor,
  varTransitionDelay,
  varTransitionEasing,
  varTransitionSpeed,
} from './constants';

const progressMarkerStyles = css({
  width: PROGRESS_BAR_HEIGHT,
  height: PROGRESS_BAR_HEIGHT,
  position: 'absolute',
  left: '50%',
  backgroundColor: `var(${varBackgroundColor})`,
  borderRadius: PROGRESS_BAR_HEIGHT,
  transform: `translate(-50%, calc(-1 * ${LABEL_TOP_SPACING}))`,
  transition: `opacity var(${varTransitionSpeed}) var(${varTransitionEasing}), background-color var(${varTransitionSpeed}) var(${varTransitionEasing})`,
  transitionDelay: `var(${varTransitionDelay})`,
  '&.fade-appear': {
    opacity: 0.01,
  },
  '&.fade-appear.fade-appear-active': {
    opacity: 1,
  },
  '&.fade-enter': {
    backgroundColor: `var(${varMarkerColor})`,
  },
  '&.fade-enter.fade-enter-active': {
    backgroundColor: `var(${varBackgroundColor})`,
  },
});

/**
 * __Progress marker__
 *
 * Similar to `@atlaskit/progress-indicator`, a small visual circle marker
 */
const ProgressMarker: FC<{ testId?: string }> = ({ testId }) => (
  // too many props that would go in UNSAFE_style + css transition prop having issues

  <div data-testid={testId} css={progressMarkerStyles} />
);

export default ProgressMarker;
