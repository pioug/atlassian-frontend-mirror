/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type React from 'react';
import { useMemo, useCallback, Fragment } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { OnAnnotationClickPayload } from '@atlaskit/editor-common/types';
import type { AnnotationId, AnnotationDataAttributes } from '@atlaskit/adf-schema';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { fg } from '@atlaskit/platform-feature-flags';
import { useIntl } from 'react-intl-next';
import { inlineCommentMessages } from '../../../messages';
import { token } from '@atlaskit/tokens';
import {
	useAnnotationManagerDispatch,
	useAnnotationManagerState,
} from '../contexts/AnnotationManagerContext';

const markStyles = css({
	color: 'inherit',
	backgroundColor: 'unset',
	WebkitTapHighlightColor: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}']`]: {
		// was from blur in AnnotationSharedCSSByState().blur
		background: token('color.background.accent.yellow.subtlest'),
		borderBottom: `${token('border.width.selected')} solid ${token('color.border.accent.yellow')}`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-has-focus="true"]': {
			background: token('color.background.accent.yellow.subtler'),
			borderBottom: `${token('border.width.selected')} solid ${token(
				'color.border.accent.yellow',
			)}`,
			// TODO: DSP-4147 - Annotation shadow
			boxShadow: token('elevation.shadow.overlay'),
			cursor: 'pointer',
		},
	},
});

const markStylesLayeringFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}']`]: {
		// Only apply transparency to nested marks when parent is focused
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-has-focus="true"] mark': {
			backgroundColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-background-color-mark &[data-has-focus="true"], &[data-has-focus="true"]': {
			background: token('color.background.accent.yellow.subtlest.pressed'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.raised'),
		},
	},
});

const markStylesWithUpdatedShadow = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}']`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-has-focus="true"]': {
			background: token('color.background.accent.yellow.subtlest.pressed'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.raised'),
		},
	},
});

const markStylesWithInlineComments = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}']`]: {
		// was from common in AnnotationSharedCSSByState().common
		borderBottom: `${token('border.width.selected')} solid transparent`,
		cursor: 'pointer',
		padding: `1px 0 ${token('space.025')}`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.card), &:has([data-inline-card])': {
			padding: '5px 0 3px 0',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has(.date-lozenger-container)': {
			paddingTop: token('space.025', '2px'),
		},

		// was from blur in AnnotationSharedCSSByState().blur
		background: token('color.background.accent.yellow.subtlest'),
		borderBottomColor: token('color.border.accent.yellow'),

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-has-focus="true"]': {
			background: token('color.background.accent.yellow.subtlest.pressed'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.overlay'),
		},
	},
});

const markStylesWithCommentsPanel = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}']`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&[data-is-hovered="true"]:not([data-has-focus="true"])': {
			background: token('color.background.accent.yellow.subtlest.hovered'),
			borderBottomColor: token('color.border.accent.yellow'),
			boxShadow: token('elevation.shadow.overlay'),
		},
	},
});

const isMobile = () => {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const accessibilityStylesOld = css({
	'&::before, &::after': {
		clipPath: 'inset(100%)',
		clip: 'rect(1px, 1px, 1px, 1px)',
		height: '1px',
		overflow: 'hidden',
		position: 'absolute',
		whiteSpace: 'nowrap',
		width: '1px',
	},
	'&::before': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		content: `' [var(--ak-renderer-annotation-startmarker)] '`,
	},
	'&::after': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		content: `' [var(--ak-renderer-annotation-endmarker)] '`,
	},
});

const accessibilityStylesNew = css({
	clipPath: 'inset(100%)',
	clip: 'rect(1px, 1px, 1px, 1px)',
	height: '1px',
	overflow: 'hidden',
	position: 'absolute',
	whiteSpace: 'nowrap',
	width: '1px',
});

type MarkComponentProps = {
	annotationParentIds: AnnotationId[];
	dataAttributes: AnnotationDataAttributes;
	hasFocus: boolean;
	id: AnnotationId;
	isHovered: boolean;
	onClick: (props: OnAnnotationClickPayload) => void;
	state: AnnotationMarkStates | null;
	useBlockLevel?: boolean;
};
export const MarkComponent = ({
	annotationParentIds,
	children,
	dataAttributes,
	id,
	state,
	hasFocus,
	isHovered,
	onClick,
	useBlockLevel,
}: React.PropsWithChildren<MarkComponentProps>) => {
	const intl = useIntl();
	const annotationIds = useMemo(
		() => [...new Set([...annotationParentIds, id])],
		[id, annotationParentIds],
	);
	const { annotationManager, dispatch } = useAnnotationManagerDispatch();
	const { currentSelectedAnnotationId } = useAnnotationManagerState();
	const isAnnotationManagerEnabled = !!annotationManager;

	// after creating a new annotation, we need to set the markRef to the new mark
	const markRef = useCallback(
		(node: HTMLElement | null) => {
			if (id === currentSelectedAnnotationId && node) {
				dispatch({
					type: 'setSelectedMarkRef',
					data: {
						markRef: node,
					},
				});
			}
		},
		[dispatch, id, currentSelectedAnnotationId],
	);

	const onMarkClick = useCallback(
		(event: MouseEvent | KeyboardEvent) => {
			// prevent inline mark logic for media block marks
			if (
				event.currentTarget instanceof HTMLElement &&
				event.currentTarget.getAttribute('data-block-mark')
			) {
				return;
			}

			// prevents multiple callback on overlapping annotations
			if (event.defaultPrevented || state !== AnnotationMarkStates.ACTIVE) {
				return;
			}

			if (fg('editor_inline_comments_on_inline_nodes')) {
				// We only want to interfere with click events if the click is on some ui inside the renderer document
				// This is to prevent the click events from portaled content (such as link previews and mention profiles)
				if (event.target instanceof HTMLElement && event.target.closest('.ak-renderer-document')) {
					if (event.target.closest('[data-mention-id]')) {
						// don't prevent default for mentions
					} else {
						// prevents from opening link URL inside webView in Safari
						event.preventDefault();
						event.stopPropagation();
					}
				}
			} else {
				// prevents from opening link URL inside webView in Safari
				event.preventDefault();
			}

			if (isAnnotationManagerEnabled) {
				// currentTarget is the right element if there are multiple overlapping annotations
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				onClick({ eventTarget: event.currentTarget as HTMLElement, annotationIds });
			} else {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				onClick({ eventTarget: event.target as HTMLElement, annotationIds });
			}
		},
		[annotationIds, onClick, state, isAnnotationManagerEnabled],
	);

	const onMarkEnter = (evt: KeyboardEvent) => {
		const focusedElementTag = document.activeElement?.tagName;

		if (focusedElementTag === 'MARK' && evt.key === 'Enter') {
			onMarkClick(evt);
		}
	};

	const overriddenData = !state
		? dataAttributes
		: {
				...dataAttributes,
				'data-mark-annotation-state': state,
				'data-has-focus': hasFocus,
				'data-is-hovered': isHovered,
		  };

	const desktopAccessibilityAttributes = isMobile()
		? {}
		: {
				role: 'button',
				tabIndex: 0,
				onKeyDown: onMarkEnter,
				'aria-expanded': hasFocus,
		  };

	const accessibility =
		state !== AnnotationMarkStates.ACTIVE
			? { 'aria-disabled': true }
			: {
					'aria-details': annotationIds.join(', '),
					...desktopAccessibilityAttributes,
			  };

	return jsx(
		useBlockLevel ? 'div' : 'mark',
		{
			ref: id === currentSelectedAnnotationId ? markRef : undefined,
			id,
			[fg('editor_inline_comments_on_inline_nodes') ? 'onClickCapture' : 'onClick']: onMarkClick,
			...accessibility,
			...overriddenData,
			...(!useBlockLevel && {
				css: [
					markStyles,
					markStylesLayeringFix,
					fg('editor_inline_comments_on_inline_nodes') && markStylesWithInlineComments,
					markStylesWithCommentsPanel,
					!fg('platform_renderer_a11y_inline_comment_fix') && !isMobile() && accessibilityStylesOld,
					markStylesWithUpdatedShadow,
				],
				style: fg('platform_renderer_a11y_inline_comment_fix')
					? {}
					: {
							'--ak-renderer-annotation-startmarker': intl.formatMessage(
								inlineCommentMessages.contentRendererInlineCommentMarkerStart,
							),
							'--ak-renderer-annotation-endmarker': intl.formatMessage(
								inlineCommentMessages.contentRendererInlineCommentMarkerEnd,
							),
					  },
			}),
		},
		fg('platform_renderer_a11y_inline_comment_fix') ? (
			useBlockLevel || isMobile() ? (
				children
			) : (
				<Fragment>
					<span css={accessibilityStylesNew}>
						{intl.formatMessage(inlineCommentMessages.contentRendererInlineCommentMarkerStart)}
					</span>
					{children}
					<span css={accessibilityStylesNew}>
						{intl.formatMessage(inlineCommentMessages.contentRendererInlineCommentMarkerEnd)}
					</span>
				</Fragment>
			)
		) : (
			children
		),
	);
};
