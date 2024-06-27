/** @jsx jsx */
import type React from 'react';
import { useMemo, useCallback } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import FeatureGates from '@atlaskit/feature-gate-js-client';

import { AnnotationSharedCSSByState } from '@atlaskit/editor-common/styles';
import type { OnAnnotationClickPayload } from '@atlaskit/editor-common/types';
import type { AnnotationId, AnnotationDataAttributes } from '@atlaskit/adf-schema';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- `AnnotationSharedCSSByState` is not object-safe
const markStyles = () => css`
	color: inherit;
	background-color: unset;
	-webkit-tap-highlight-color: transparent;

	&[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}'] {
		${AnnotationSharedCSSByState().common};
		${AnnotationSharedCSSByState().blur};

		&:focus,
		&[data-has-focus='true'] {
			${AnnotationSharedCSSByState().focus};
		}
	}
`;

const isMobile = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

type MarkComponentProps = {
	id: AnnotationId;
	annotationParentIds: AnnotationId[];
	dataAttributes: AnnotationDataAttributes;
	state: AnnotationMarkStates | null;
	hasFocus: boolean;
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
	onClick,
	useBlockLevel,
}: React.PropsWithChildren<MarkComponentProps>) => {
	const isInlineCommentsKbAccessible = FeatureGates.checkGate(
		'inline_comments_keyboard_accessible_renderer',
	);

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

			if (getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes')) {
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
			};

	const desktopAccessibilityAttributes = isInlineCommentsKbAccessible
		? isMobile()
			? {}
			: {
					role: 'button',
					tabIndex: 0,
					onKeyDown: onMarkEnter,
					'aria-expanded': hasFocus,
				}
		: {};

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
			id,
			[getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes')
				? 'onClickCapture'
				: 'onClick']: onMarkClick,
			...accessibility,
			...overriddenData,
			...(!useBlockLevel && { css: [markStyles] }),
		},
		children,
	);
};
