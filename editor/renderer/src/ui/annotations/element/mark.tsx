/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type React from 'react';
import { useMemo, useCallback } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { AnnotationSharedCSSByState } from '@atlaskit/editor-common/styles';
import type { OnAnnotationClickPayload } from '@atlaskit/editor-common/types';
import type { AnnotationId, AnnotationDataAttributes } from '@atlaskit/adf-schema';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { fg } from '@atlaskit/platform-feature-flags';
import { useIntl } from 'react-intl-next';
import { inlineCommentMessages } from '../../../messages';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- `AnnotationSharedCSSByState` is not object-safe
const markStyles = () => css`
	color: inherit;
	background-color: unset;
	-webkit-tap-highlight-color: transparent;

	&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}'] {
		${fg('editor_inline_comments_on_inline_nodes') ? AnnotationSharedCSSByState().common : ''}
		${AnnotationSharedCSSByState().blur}

		&:focus,
			&[data-has-focus='true'] {
			${AnnotationSharedCSSByState().focus}
		}
		&[data-is-hovered='true']:not([data-has-focus='true']) {
			${fg('confluence-frontend-comments-panel') ? AnnotationSharedCSSByState().hover : ''}
		}
	}
`;

const isMobile = () => {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const accessibilityStyles = (startMarker: string, endMarker: string) =>
	css({
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
			content: `' [${startMarker}] '`,
		},
		'&::after': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			content: `' [${endMarker}] '`,
		},
	});

type MarkComponentProps = {
	id: AnnotationId;
	annotationParentIds: AnnotationId[];
	dataAttributes: AnnotationDataAttributes;
	state: AnnotationMarkStates | null;
	hasFocus: boolean;
	isHovered: boolean;
	onClick: (props: OnAnnotationClickPayload) => void;
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

			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			onClick({ eventTarget: event.target as HTMLElement, annotationIds });
		},
		[annotationIds, onClick, state],
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

	const getAccessibilityStyles = () => {
		if (isMobile()) {
			return {};
		}
		if (state !== AnnotationMarkStates.RESOLVED) {
			const startMarker = intl.formatMessage(
				inlineCommentMessages.contentRendererInlineCommentMarkerStart,
			);
			const endMarker = intl.formatMessage(
				inlineCommentMessages.contentRendererInlineCommentMarkerEnd,
			);
			return accessibilityStyles(startMarker, endMarker);
		} else {
			return {};
		}
	};

	return jsx(
		useBlockLevel ? 'div' : 'mark',
		{
			id,
			[fg('editor_inline_comments_on_inline_nodes') ? 'onClickCapture' : 'onClick']: onMarkClick,
			...accessibility,
			...overriddenData,
			...(!useBlockLevel && {
				css: [markStyles, getAccessibilityStyles()],
			}),
		},
		children,
	);
};
