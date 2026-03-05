/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useEffect, useRef, type PropsWithChildren } from 'react';

import { css, jsx } from '@compiled/react';

import { getDocument } from '@atlaskit/browser-apis';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
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

export enum SmartLinkAppearance {
	INLINE = 'inline',
	BLOCK = 'block',
	EMBED = 'embed',
}

export interface SmartLinkDragData {
	appearance: SmartLinkAppearance;
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

export interface SmartLinkDraggableProps {
	appearance: SmartLinkAppearance;
	/** Which context the smart link is being dragged from */
	source: SMART_LINK_DRAG_TYPES;
	title?: string;
	url: string;
}

/**
 * Extracts the resolved title from the smart card's rendered DOM.
 * At drag time, the smart card has already resolved and rendered the title
 * as visible text. This avoids needing to thread the async onResolve title
 * back up to the outer ReactNodeView wrapper.
 */
function getTitleFromDOM(
	element: HTMLElement,
	url: string,
	propTitle?: string,
): string | undefined {
	if (propTitle) {
		return propTitle;
	}

	// For inline cards: the title is rendered inside the first child span of
	// the anchor element.
	const inlineLink = element.querySelector<HTMLAnchorElement>('a[href]');
	if (inlineLink) {
		const titleSpan = inlineLink.querySelector<HTMLElement>(':scope > span:first-of-type');
		const text = (titleSpan ?? inlineLink).textContent?.trim();
		if (text && text !== url) {
			return text;
		}
	}

	// For block/embed cards (FlexibleCard): title is in the smart-link-title element
	const smartTitle = element.querySelector<HTMLElement>('[data-smart-element="Title"]');
	if (smartTitle) {
		const text = smartTitle.textContent?.trim();
		if (text && text !== url) {
			return text;
		}
	}

	// Fallback: use full textContent (works for simple cards without metadata)
	const text = element.textContent?.trim();
	if (text && text !== url) {
		return text;
	}
	return undefined;
}

/**
 * Extracts the provider/favicon icon URL from the smart card's rendered DOM.
 * Looks for icons within elements marked with data-smart-element-icon (FlexibleCard),
 * then falls back to finding the first small <img> in the card.
 */
function getIconUrlFromDOM(element: HTMLElement): string | undefined {
	// Try smart element icon container (FlexibleCard)
	const smartElementIcon = element.querySelector<HTMLElement>('[data-smart-element-icon]');
	const smartElementImg = smartElementIcon?.querySelector<HTMLImageElement>('img[src]');
	if (smartElementImg?.src) {
		return smartElementImg.src;
	}

	// Fallback: find the first small img in the card (likely the provider/favicon icon)
	const allImgs = element.querySelectorAll<HTMLImageElement>('img[src]');
	for (const img of allImgs) {
		// Skip large images (likely card previews, not icons)
		if (img.naturalWidth > 0 && img.naturalWidth <= 32) {
			return img.src;
		}
		// If natural dimensions aren't available yet, check computed/attribute size
		if (img.width <= 32 || ['16', '20', '24', '32'].includes(img.getAttribute('width') ?? '')) {
			return img.src;
		}
	}

	return undefined;
}

/**
 * Renders a drag preview element for a smart link being dragged.
 * Shows an icon (if available) and the link title in a compact pill.
 */
function renderDragPreview(
	container: HTMLElement,
	{ title, url, iconUrl }: { iconUrl: string | undefined; title: string | undefined; url: string },
): void {
	const doc = getDocument();
	if (!doc) {
		return;
	}
	const preview = doc.createElement('div');
	Object.assign(preview.style, {
		padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
		backgroundColor: token('elevation.surface.raised', '#fff'),
		borderRadius: token('radius.small', '4px'),
		boxShadow: token('elevation.shadow.raised', '0 2px 8px rgba(0,0,0,0.15)'),
		font: token('font.body', '14px'),
		maxWidth: '300px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		display: 'flex',
		alignItems: 'center',
		gap: token('space.075', '6px'),
	});

	if (iconUrl) {
		const icon = doc.createElement('img');
		icon.src = iconUrl;
		Object.assign(icon.style, {
			width: token('space.200', '16px'),
			height: token('space.200', '16px'),
			flexShrink: '0',
		});
		preview.appendChild(icon);
	}

	const text = doc.createElement('span');
	Object.assign(text.style, {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	});
	text.textContent = title || url;
	preview.appendChild(text);

	container.appendChild(preview);
}

const draggableInlineStyles = css({
	cursor: 'grab',
	display: 'inline',
});

const draggableBlockStyles = css({
	cursor: 'grab',
});

/**
 * Wraps a smart link card to make it draggable into the content tree.
 * Extracts the resolved title and icon from the card's DOM at drag start time.
 */
export function SmartLinkDraggable({
	url,
	title,
	appearance,
	source,
	children,
}: PropsWithChildren<SmartLinkDraggableProps>) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		return draggable({
			element: el,
			getInitialData: () => {
				// Resolve the title and icon at drag start time, when the smart card has already rendered
				const resolvedTitle = getTitleFromDOM(el, url, title);
				const iconUrl = getIconUrlFromDOM(el);
				return {
					type: source,
					url,
					title: resolvedTitle,
					iconUrl,
					appearance,
				};
			},
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				const resolvedTitle = getTitleFromDOM(el, url, title);
				const iconUrl = getIconUrlFromDOM(el);
				setCustomNativeDragPreview({
					getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
					render({ container }) {
						renderDragPreview(container, { title: resolvedTitle, url, iconUrl });
					},
					nativeSetDragImage,
				});
			},
		});
	}, [url, title, appearance, source]);

	// Only wrap with draggable styles if we have a valid URL
	if (!url) {
		return <>{children}</>;
	}

	// Use span with inline display for inline cards to preserve text flow
	if (appearance === SmartLinkAppearance.INLINE) {
		return (
			<span ref={ref} css={draggableInlineStyles}>
				{children}
			</span>
		);
	}

	return (
		<div ref={ref} css={draggableBlockStyles}>
			{children}
		</div>
	);
}
