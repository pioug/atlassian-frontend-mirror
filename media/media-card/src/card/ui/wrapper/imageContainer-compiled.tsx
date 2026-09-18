/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { MediaCardCursor } from '../../../types';
import { fileCardImageViewSelector } from '../../classnames';

const imageContainerStyles = css({
	display: 'flex',
	position: 'relative',
	maxWidth: '100%',
	width: '100%',
	height: '100%',
	maxHeight: '100%',
	overflow: 'hidden',
	borderRadius: token('radius.large', '3px'),
});

const imageContainerCenterStyles = css({
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

// Holds the preview back until it has decoded, so it can be faded in rather than appearing the
// instant it becomes displayable. Nothing is drawn in the meantime — consumers using this
// motion keep the node out of the layout until the preview is ready.
const mediaMotionHiddenStyles = css({
	opacity: 0,
});

const mediaMotionEnteringStyles = css({
	animationName: token('motion.keyframe.fade.in'),
	animationDuration: token('motion.duration.medium'),
	animationTimingFunction: token('motion.easing.out.practical'),
	// Held back until the consumer has finished opening the space. Assumes that takes
	// `motion.duration.xlong`; promote to a prop if that stops holding.
	animationDelay: token('motion.duration.xlong'),
	// Keeps the preview invisible through the delay and visible after the last frame, so there
	// is no flash at either end.
	animationFillMode: 'both',
	'@media (prefers-reduced-motion: reduce)': {
		animation: 'none',
	},
});

type ImageContainerProps = {
	children: React.ReactNode;
	centerElements?: boolean;
	testId: string;
	mediaCardCursor?: MediaCardCursor;
	mediaName?: string;
	status?: string;
	progress?: number;
	selected?: boolean;
	source?: string;
	/**
	 * Entering motion for the media preview: `hidden` while it is still loading, `entering`
	 * once it has rendered. Undefined opts out entirely.
	 */
	mediaMotion?: 'hidden' | 'entering';
};

export const ImageContainer = ({
	children,
	mediaName,
	status,
	progress,
	selected,
	source,
	centerElements,
	mediaCardCursor,
	mediaMotion,
}: ImageContainerProps): JSX.Element => (
	<div
		css={[
			imageContainerStyles,
			centerElements && imageContainerCenterStyles,
			mediaMotion === 'hidden' && mediaMotionHiddenStyles,
			mediaMotion === 'entering' && mediaMotionEnteringStyles,
		]}
		data-testid={fileCardImageViewSelector}
		/**
		 * This wrapper MUST add the classname in order to allow the editor to prevent bubbling up the click event.
		 * See the method isInteractiveElement in source platform/packages/editor/renderer/src/ui/Renderer/click-to-edit.ts
		 * Also, many other consumer tests rely on this selector.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={fileCardImageViewSelector}
		data-test-media-name={mediaName}
		data-test-status={status}
		data-test-progress={progress}
		data-test-selected={selected}
		data-test-source={source}
		data-cursor={mediaCardCursor}
	>
		{children}
	</div>
);
