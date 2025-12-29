/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef } from 'react';

import { css, cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const readViewContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography
	lineHeight: 1 as any,
});

const editButtonStyles = cssMap({
	root: {
		display: 'block',
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginBlockEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		appearance: 'none',
		backgroundColor: 'transparent',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		borderWidth: '0',
		borderStyle: 'none',
		borderColor: 'transparent',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography
		lineHeight: 1 as any,
		outline: 0,

		'&:focus-visible': {
			outline: 0,
		},

		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:focus + div': {
			borderColor: token('color.border.focused'),
			borderWidth: token('border.width.focused'),
			borderStyle: 'solid',
		},
	},
});

const readViewWrapperStyles = css({
	display: 'inline-block',
	boxSizing: 'border-box',
	width: 'auto',
	maxWidth: '100%',
	borderColor: 'transparent',
	borderRadius: token('radius.small', '3px'),
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	transition: 'background 0.2s',
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},
});

const readViewWrapperStylesT26Shape = css({
	borderRadius: token('radius.medium', '6px'),
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
		/**
		 * If a link is clicked in the read view, default action should be taken
		 */
		if (element.tagName.toLowerCase() !== 'a' && !mouseHasMovedAfterMouseDown(event)) {
			event.preventDefault();
			onEditRequested();
			postReadViewClick();
		}
	};

	return (
		<div css={readViewContainerStyles}>
			<Pressable
				xcss={editButtonStyles.root}
				onClick={onEditRequested}
				ref={editButtonRef}
				testId={testId && `${testId}--edit-button`}
				aria-label={editButtonLabel}
			></Pressable>
			{/* eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable */}
			<div
				css={[
					readViewWrapperStyles,
					readViewFitContainerWidth && readViewFitContainerWidthStyles,
					fg('platform-dst-shape-theme-default') && readViewWrapperStylesT26Shape,
				]}
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ReadView;
