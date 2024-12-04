/* eslint-disable @atlaskit/design-system/no-nested-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const progressMarkerStyles = css({
	width: token('space.100', '8px'),
	height: token('space.100', '8px'),
	position: 'absolute',
	backgroundColor: `var(--ds--pt--bg)`,
	borderRadius: token('space.100', '8px'),
	insetInlineStart: '50%',
	transform: `translate(-50%, calc(-1 * ${token('space.250')}))`,
	transition: `opacity var(--ds--pt--ts) var(--ds--pt--te), background-color var(--ds--pt--ts) var(--ds--pt--te)`,
	transitionDelay: `var(--ds--pt--td)`,
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
		backgroundColor: `var(--ds--pt--mc)`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.fade-enter.fade-enter-active': {
		backgroundColor: `var(--ds--pt--bg)`,
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
