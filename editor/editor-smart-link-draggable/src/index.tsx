/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';
import { css } from '@compiled/react';
import ReactDOM from 'react-dom';

import { cssMap, jsx } from '@atlaskit/css';
import { extractSmartLinkTitle } from '@atlaskit/link-extractors';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { isSafeUrl } from '@atlaskit/linking-common/url';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { getObjectIconUrl } from '@atlaskit/smart-card';
import { token } from '@atlaskit/tokens';

/**
 * Shared constants, types, and utilities for smart link drag-and-drop
 * between editor/renderer (drag sources) and the content tree (drop target).
 */
export enum SMART_LINK_DRAG_TYPES {
	EDITOR = 'smart-link-from-editor',
	RENDERER = 'smart-link-from-renderer',
}

export type SmartLinkDragType = SMART_LINK_DRAG_TYPES;

export enum SMART_LINK_APPEARANCE {
	INLINE = 'inline',
	BLOCK = 'block',
	EMBED = 'embed',
}

export interface SmartLinkDragData {
	appearance: SMART_LINK_APPEARANCE;
	iconUrl: string | undefined;
	title: string | undefined;
	type: SmartLinkDragType;
	url: string;
}

/**
 * Type guard to check if a drag source type is a smart link drag.
 */
export function isSmartLinkDrag(type: unknown): boolean {
	return type === SMART_LINK_DRAG_TYPES.EDITOR || type === SMART_LINK_DRAG_TYPES.RENDERER;
}

/**
 * Checks if a ProseMirror node type is a smart link card.
 */
export function isSmartLinkNodeType(nodeType: string): boolean {
	return nodeType === 'inlineCard' || nodeType === 'blockCard' || nodeType === 'embedCard';
}

export interface SmartLinkDraggableProps {
	appearance: SMART_LINK_APPEARANCE;
	isChangeboardTarget?: boolean;
	/** Which context the smart link is being dragged from */
	source: SMART_LINK_DRAG_TYPES;
	title?: string;
	url: string;
}

type DraggableState =
	| { type: 'idle' }
	| {
			container: HTMLElement;
			iconUrl: string | undefined;
			title: string | undefined;
			type: 'preview';
	  }
	| { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

const styles = cssMap({
	preview: {
		backgroundColor: token('elevation.surface'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		maxWidth: '260px',
		overflow: 'hidden',
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	previewText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	draggableBlock: {
		cursor: 'grab',
	},
});

const previewIconStyles = css({
	width: token('space.200'),
	height: token('space.200'),
	flexShrink: 0,
});

const draggableInlineStyles = css({
	cursor: 'grab',
	display: 'inline',
});

function SmartLinkDragPreview({
	title,
	url,
	iconUrl,
}: {
	iconUrl: string | undefined;
	title: string | undefined;
	url: string;
}) {
	return (
		<Box xcss={styles.preview}>
			<Inline alignBlock="center" space="space.075">
				{iconUrl && <img src={iconUrl} alt="" css={previewIconStyles} />}
				<Box as="span" xcss={styles.previewText}>
					{title || url}
				</Box>
			</Inline>
		</Box>
	);
}

function getIconUrl(details?: SmartLinkResponse): string | undefined {
	if (details?.data && 'icon' in details.data && typeof details?.data?.icon === 'string') {
		return details.data.icon;
	}

	const objectIconUrl = getObjectIconUrl(details);
	if (objectIconUrl) {
		return objectIconUrl;
	}

	// Confluence/Jira content-type specific icons (page, blog, whiteboard, issue, etc.)
	if (
		details?.entityData &&
		'iconUrl' in details.entityData &&
		typeof details.entityData.iconUrl === 'string'
	) {
		return details.entityData.iconUrl;
	}

	// Fallback to provider/generator icon (product logo)
	if (typeof details?.meta?.generator?.icon?.url === 'string') {
		return details.meta.generator.icon.url;
	}

	return undefined;
}

/**
 * Inner component that handles the actual drag behavior.
 * Must be rendered within a SmartCardProvider context.
 */
function SmartLinkDraggableInner({
	url,
	title: propTitle,
	appearance,
	source,
	isChangeboardTarget = false,
	children,
}: PropsWithChildren<SmartLinkDraggableProps>) {
	const ref = useRef<HTMLElement>(null);
	const { store } = useSmartLinkContext();
	const [state, setState] = useState<DraggableState>(idleState);

	// Store the draggable config so we can re-register on different elements
	// when the browser picks a child as the drag target.
	const getDragConfig = useCallback(
		(targetEl: HTMLElement) => ({
			element: targetEl,
			getInitialData: () => {
				const cardState = store.getState()[url];
				const details = cardState?.details;
				const title = propTitle || extractSmartLinkTitle(details);
				const iconUrl = getIconUrl(details);

				return { type: source, url, title, iconUrl, appearance };
			},
			onGenerateDragPreview: ({
				nativeSetDragImage,
			}: {
				nativeSetDragImage: DataTransfer['setDragImage'] | null;
			}) => {
				const cardState = store.getState()[url];
				const details = cardState?.details;
				const title = propTitle || extractSmartLinkTitle(details);
				const iconUrl = getIconUrl(details);

				setCustomNativeDragPreview({
					getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
					render({ container }) {
						setState({ type: 'preview', container, title, iconUrl });
						return () => setState(draggingState);
					},
					nativeSetDragImage,
				});
			},
			onDragStart: () => setState(draggingState),
			onDrop: () => setState(idleState),
		}),
		[url, propTitle, appearance, source, store],
	);

	// On pointerdown, determine the drag element and register it with Pragmatic DnD.
	// Uses pointerdown because the drag source may not exist at mount time as smart cards resolve.
	// For inline cards inside ProseMirror, prefer the inner anchor because the browser fires
	// dragstart from that element rather than from the inline card wrapper.
	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		const inlineCardRootSelector = '[data-prosemirror-node-name="inlineCard"][draggable="true"]';

		// In contentEditable editors (ProseMirror), the browser may pick a child
		// element (e.g., an <a> tag) as the drag target instead of our element.
		// On pointerdown, we find the likely drag target and register draggable()
		// on it so pragmatic-drag-and-drop recognizes the drag.
		let cleanupDraggable: (() => void) | null = null;

		// In contentEditable="true" contexts (block/embed cards), the browser treats
		// the smart-element-link as editable text rather than a draggable element.
		// Not needed for inline cards since the wrapper is already not editable
		let observer: MutationObserver | null = null;
		if (appearance !== SMART_LINK_APPEARANCE.INLINE) {
			const setupSmartElementLink = () => {
				el.querySelectorAll<HTMLElement>('[data-smart-element-link]').forEach((link) => {
					link.contentEditable = 'false';
					link.setAttribute('draggable', 'true');
				});
			};
			setupSmartElementLink();

			observer = new MutationObserver(setupSmartElementLink);
			observer.observe(el, { childList: true, subtree: true });
		}

		const unbindPointerDown = bind(el, {
			type: 'pointerdown',
			listener: (event: PointerEvent) => {
				const selectionAtPointerDown = window.getSelection();
				if (
					appearance === SMART_LINK_APPEARANCE.INLINE &&
					selectionAtPointerDown?.type === 'Range' &&
					selectionAtPointerDown.toString().length > 0
				) {
					selectionAtPointerDown.removeAllRanges();
				}
				cleanupDraggable?.();

				const target = event.target;
				// Find the nearest draggable ancestor within the card to match
				// the element the browser will use as the dragstart target.
				let dragTarget: HTMLElement = el;
				if (appearance === SMART_LINK_APPEARANCE.INLINE) {
					const targetElement = target instanceof Element ? target : null;
					const hostInlineCardRoot = el.closest<HTMLElement>(inlineCardRootSelector);
					const inlineCardRoot =
						targetElement?.closest<HTMLElement>(inlineCardRootSelector) ?? null;
					const closestInlineAnchor =
						targetElement?.closest<HTMLElement>('a[href], [data-smart-element-link]') ?? null;
					if (
						closestInlineAnchor instanceof HTMLElement &&
						(el.contains(closestInlineAnchor) ||
							(hostInlineCardRoot instanceof HTMLElement &&
								hostInlineCardRoot.contains(closestInlineAnchor)))
					) {
						dragTarget = closestInlineAnchor;
					} else if (
						inlineCardRoot instanceof HTMLElement &&
						hostInlineCardRoot instanceof HTMLElement &&
						inlineCardRoot === hostInlineCardRoot
					) {
						dragTarget = inlineCardRoot;
					}
				} else {
					dragTarget = target instanceof HTMLElement && el.contains(target) ? target : el;
				}
				cleanupDraggable = draggable(getDragConfig(dragTarget));
			},
		});

		return () => {
			cleanupDraggable?.();
			unbindPointerDown();
			observer?.disconnect();
		};
	}, [url, propTitle, appearance, source, store, getDragConfig]);

	const preview =
		state.type === 'preview'
			? ReactDOM.createPortal(
					<SmartLinkDragPreview title={state.title} url={url} iconUrl={state.iconUrl} />,
					state.container,
			  )
			: null;

	// Use span with inline display for inline cards to preserve text flow.
	if (appearance === SMART_LINK_APPEARANCE.INLINE) {
		return (
			<>
				<span
					ref={ref}
					css={draggableInlineStyles}
					data-testid="smart-link-draggable-inline"
					data-spotlight-target={
						isChangeboardTarget ? 'smart-link-draggable-changeboard' : undefined
					}
				>
					{children}
				</span>
				{preview}
			</>
		);
	}

	return (
		<>
			<Box ref={ref} xcss={styles.draggableBlock} testId="smart-link-draggable-block">
				{children}
			</Box>
			{preview}
		</>
	);
}

/**
 * Wraps a smart link card to make it draggable into the content tree.
 * Extracts the resolved title and icon from the smart link data store at drag start time.
 * Falls back to rendering children directly when the feature flag is off or url is missing.
 */
export function SmartLinkDraggable({
	url,
	title,
	appearance,
	source,
	isChangeboardTarget,
	children,
}: PropsWithChildren<SmartLinkDraggableProps>): JSX.Element {
	if (!url || !isSafeUrl(url) || !fg('cc_drag_and_drop_smart_link_from_content_to_tree')) {
		return <>{children}</>;
	}

	return (
		<SmartLinkDraggableInner
			url={url}
			title={title}
			appearance={appearance}
			source={source}
			isChangeboardTarget={isChangeboardTarget}
		>
			{children}
		</SmartLinkDraggableInner>
	);
}
