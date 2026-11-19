/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// Fullscreen only. The inset Media Viewer's footer, for the player's own fullscreen element:
// a dark bar below the video holding the timeline and the left and right controls.
import { type ReactNode, type Ref } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { ControlsLayout } from './ControlsLayout';

const footerStyles = css({
	// Always dark, so not themed: the design's gray, with its gradient.
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#22272A',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundImage:
		'linear-gradient(to top, rgba(5, 12, 31, 0.46) 0%, rgba(5, 12, 31, 0.1487) 83%, rgba(5, 12, 31, 0) 100%)',
	boxSizing: 'border-box',
	flexShrink: 0,
	width: '100%',
	// The Media Viewer's footer for a player, with 4px less padding above the controls.
	height: token('space.800'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'relative',
	overflow: 'visible',
	paddingBlockStart: token('space.200'),
	paddingBlockEnd: token('space.200'),
	// The viewer's 24px gutter
	paddingInline: token('space.300'),
});

export const InsetFullscreenControlsLayout = ({
	videoControlsWrapperRef,
	timeline,
	left,
	right,
}: {
	videoControlsWrapperRef?: Ref<HTMLDivElement>;
	timeline: ReactNode;
	left: ReactNode;
	right: ReactNode;
}): JSX.Element => (
	<div css={footerStyles}>
		<ControlsLayout
			videoControlsWrapperRef={videoControlsWrapperRef}
			timeline={timeline}
			left={left}
			right={right}
		/>
	</div>
);
