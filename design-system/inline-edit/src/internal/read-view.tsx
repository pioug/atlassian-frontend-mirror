/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Pressable, xcss } from '@atlaskit/primitives';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { borderRadius } from './constants';

const readViewContainerStyles = css({
	lineHeight: 1,
});

const editButtonStyles = xcss({
	display: 'block',
	margin: 'space.0',
	padding: 'space.0',
	appearance: 'none',
	background: 'transparent',
	border: 0,
	lineHeight: 1,
	outline: 0,

	':focus-visible': {
		outline: 0,
	},

	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	':focus + div': {
		borderColor: 'color.border.focused',
		borderWidth: 'border.width.outline',
		borderStyle: 'solid',
	},
});

const readViewWrapperStyles = css({
	display: 'inline-block',
	boxSizing: 'border-box',
	width: 'auto',
	maxWidth: '100%',
	border: '2px solid transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: borderRadius,
	transition: 'background 0.2s',
	'&:hover': {
		background: token('color.background.neutral.subtle.hovered', N30),
	},
});

const readViewFitContainerWidthStyles = css({
	width: '100%',
});

const DRAG_THRESHOLD = 5;

interface ReadViewProps {
	editButtonLabel: string;
	onEditRequested: () => void;
	postReadViewClick: () => void;
	editButtonRef: React.RefObject<HTMLButtonElement>;
	readViewFitContainerWidth?: boolean;
	readView: () => React.ReactNode;
	testId?: string;
}

const ReadView = ({
	editButtonLabel,
	onEditRequested,
	postReadViewClick,
	editButtonRef,
	readViewFitContainerWidth,
	readView,
	testId,
}: ReadViewProps) => {
	const startX = useRef(0);
	const startY = useRef(0);

	const mouseHasMovedAfterMouseDown = (event: { clientX: number; clientY: number }) => {
		return (
			Math.abs(startX.current - event.clientX) >= DRAG_THRESHOLD ||
			Math.abs(startY.current - event.clientY) >= DRAG_THRESHOLD
		);
	};

	const onReadViewClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
		const element = event.target as HTMLElement;
		/** If a link is clicked in the read view, default action should be taken */
		if (element.tagName.toLowerCase() !== 'a' && !mouseHasMovedAfterMouseDown(event)) {
			event.preventDefault();
			onEditRequested();
			postReadViewClick();
		}
	};

	return (
		<div css={readViewContainerStyles}>
			<Pressable
				xcss={editButtonStyles}
				onClick={onEditRequested}
				ref={editButtonRef}
				testId={testId && `${testId}--edit-button`}
				aria-label={editButtonLabel}
			></Pressable>
			<div
				css={[readViewWrapperStyles, readViewFitContainerWidth && readViewFitContainerWidthStyles]}
				/**
				 * It is not normally acceptable to add click handlers to non-interactive elements
				 * as this is an accessibility anti-pattern. However, because this instance is
				 * account for clicking on links that may be embedded within inline-edit and not
				 * creating an inaccessible custom element, we can add role="presentation" so that
				 * there is no negative impacts to assistive technologies.
				 * (Why links are embeeded in inline-edit is for another day...)
				 */
				role="presentation"
				onClick={onReadViewClick}
				onMouseDown={(e) => {
					startX.current = e.clientX;
					startY.current = e.clientY;
				}}
				data-read-view-fit-container-width={readViewFitContainerWidth}
			>
				{readView()}
			</div>
		</div>
	);
};

export default ReadView;
