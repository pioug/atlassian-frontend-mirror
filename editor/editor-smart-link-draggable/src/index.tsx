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
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { getObjectIconUrl } from '@atlaskit/smart-card';
import { token } from '@atlaskit/tokens';
import { PopoverProvider, PopoverTarget } from '@atlaskit/spotlight';

import { SmartLinkDraggableChangeboardPopover } from './SmartLinkDraggableChangeboardPopover';

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

export interface SmartLinkDraggableProps {
	appearance: SMART_LINK_APPEARANCE;
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
	children,
}: PropsWithChildren<SmartLinkDraggableProps>) {
	const ref = useRef<HTMLDivElement>(null);
	const { store } = useSmartLinkContext();
	const [state, setState] = useState<DraggableState>(idleState);
	// Changeboarding popover will always be hidden until visibility/targeting logic is implemented
	const [showChangeboard, setShowChangeboard] = useState(false);

	const cleanupDraggableRef = useRef<(() => void) | null>(null);

	const getDraggableConfig = useCallback(
		(element: HTMLElement) => ({
			element,
			getInitialData: () => {
				const cardState = store.getState()[url];
				const details = cardState?.details;
				const title = propTitle || extractSmartLinkTitle(details);
				const iconUrl = getIconUrl(details);

				return { type: source, url, title, iconUrl, appearance };
			},
			getInitialDataForExternal: () => ({
				'text/uri-list': url,
				'text/plain': url,
			}),
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
	// For block/embed: disables native drag on nested anchors, registers the wrapper.
	// For inline: registers the anchor itself since an inline <span> can't be a drag source.
	// Uses pointerdown because the anchor may not exist at mount time (smart card resolves asynchronously).
	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		const unbind = bind(el, {
			type: 'pointerdown',
			listener: () => {
				if (appearance === SMART_LINK_APPEARANCE.INLINE) {
					const anchor = el.querySelector('a[href]') as HTMLElement | null;
					if (!anchor || cleanupDraggableRef.current) {
						return;
					}
					cleanupDraggableRef.current = draggable(getDraggableConfig(anchor));
				} else if (!cleanupDraggableRef.current) {
					el.querySelectorAll('a[href]').forEach((anchor) => {
						anchor.setAttribute('draggable', 'false');
					});
					cleanupDraggableRef.current = draggable(getDraggableConfig(el));
				}
			},
		});

		return () => {
			unbind();
			cleanupDraggableRef.current?.();
			cleanupDraggableRef.current = null;
			el.querySelectorAll('a[href]').forEach((anchor) => {
				anchor.removeAttribute('draggable');
			});
		};
	}, [appearance, getDraggableConfig]);

	const handleDismissChangeboard = () => setShowChangeboard(false);

	const preview =
		state.type === 'preview'
			? ReactDOM.createPortal(
					<SmartLinkDragPreview title={state.title} url={url} iconUrl={state.iconUrl} />,
					state.container,
			  )
			: null;

	// Use span with inline display for inline cards to preserve text flow
	if (appearance === SMART_LINK_APPEARANCE.INLINE) {
		return (
			<PopoverProvider>
				<PopoverTarget>
					<span ref={ref} css={draggableInlineStyles} data-testid="smart-link-draggable-inline">
						{children}
					</span>
				</PopoverTarget>
				{preview}
				<SmartLinkDraggableChangeboardPopover
					isVisible={showChangeboard}
					dismiss={handleDismissChangeboard}
				/>
			</PopoverProvider>
		);
	}

	return (
		<PopoverProvider>
			<PopoverTarget>
				<Box ref={ref} xcss={styles.draggableBlock} testId="smart-link-draggable-block">
					{children}
				</Box>
			</PopoverTarget>
			{preview}
			<SmartLinkDraggableChangeboardPopover
				isVisible={showChangeboard}
				dismiss={handleDismissChangeboard}
			/>
		</PopoverProvider>
	);
}

/**
 * Validates that a URL uses a safe protocol (http or https).
 * Rejects dangerous protocols like javascript:, data:, vbscript:, etc.
 */
function isSafeUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'http:' || parsed.protocol === 'https:';
	} catch {
		return false;
	}
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
	children,
}: PropsWithChildren<SmartLinkDraggableProps>): JSX.Element {
	if (!url || !isSafeUrl(url) || !fg('cc_drag_and_drop_smart_link_from_content_to_tree')) {
		return <>{children}</>;
	}

	return (
		<SmartLinkDraggableInner url={url} title={title} appearance={appearance} source={source}>
			{children}
		</SmartLinkDraggableInner>
	);
}
