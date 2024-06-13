/* eslint-disable @atlaskit/design-system/no-nested-styles */
/** @jsx jsx */
import { type FC } from 'react';

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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: PROGRESS_BAR_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: PROGRESS_BAR_HEIGHT,
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: `var(${varBackgroundColor})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: PROGRESS_BAR_HEIGHT,
	insetInlineStart: '50%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transform: `translate(-50%, calc(-1 * ${LABEL_TOP_SPACING}))`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `opacity var(${varTransitionSpeed}) var(${varTransitionEasing}), background-color var(${varTransitionSpeed}) var(${varTransitionEasing})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transitionDelay: `var(${varTransitionDelay})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-appear': {
		opacity: 0.01,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-appear.fade-appear-active': {
		opacity: 1,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-enter': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: `var(${varMarkerColor})`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-enter.fade-enter-active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
