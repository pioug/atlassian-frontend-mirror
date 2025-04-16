/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { easeInOut } from '@atlaskit/motion/curves';
import { durations } from '@atlaskit/motion/durations';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gutter = 60;

const maxWidthDimensions = `calc(100vw - ${gutter * 2}px)`;
const maxHeightDimensions = `calc(100vh - ${gutter * 2 - 1}px)`;

// Flex and min-content are set to constrain the height of the body and support multi-column scrolling experiences
const positionerStyles = css({
	display: 'flex',
	width: '100%',
	maxWidth: '100%',
	height: '100%',
	position: 'fixed',
	zIndex: layers.modal(),
	flexDirection: 'column',
	insetBlockStart: 0,
	insetInlineStart: 0,
});

const viewportScrollStyles = css({
	height: 'auto',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		margin: `${gutter}px auto`,
		pointerEvents: 'none',
	},
});

const bodyScrollStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		maxWidth: maxWidthDimensions,
		maxHeight: maxHeightDimensions,
		position: 'absolute',
		insetBlockStart: `${gutter}px`,
		insetInlineEnd: 0,
		insetInlineStart: 0,
		marginInlineEnd: 'auto',
		marginInlineStart: 'auto',
		pointerEvents: 'none',
	},
});

const stackTransitionStyles = css({
	transitionProperty: 'transform',

	/**
	 * Duplicated from @atlaskit/motion/accessibility
	 * because @repo/internal/styles/consistent-style-ordering
	 * doesn't work well with object spreading.
	 */
	'@media (prefers-reduced-motion: reduce)': {
		animation: 'none',
		transition: 'none',
	},
});

const stackTransformStyles = css({
	transform: 'translateY(var(--modal-dialog-translate-y))',
});

const stackIdleStyles = css({
	transform: 'none',
});

interface PositionerProps {
	children?: ReactNode;
	stackIndex: number;
	shouldScrollInViewport: boolean;
	testId?: string;
}

const Positioner = (props: PositionerProps) => {
	const { children, stackIndex, shouldScrollInViewport, testId } = props;

	return (
		<div
			style={
				{
					'--modal-dialog-translate-y': `calc(${stackIndex}px * ${token('space.100')})`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					transitionDuration: `${durations.medium}ms`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					transitionTimingFunction: easeInOut,
				} as CSSProperties
			}
			css={[
				positionerStyles,
				stackTransitionStyles,
				/* We only want to apply transform on modals shifting to the back of the stack. */
				stackIndex > 0 ? stackTransformStyles : stackIdleStyles,
				shouldScrollInViewport ? viewportScrollStyles : bodyScrollStyles,
			]}
			data-testid={testId && `${testId}--positioner`}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Positioner;
