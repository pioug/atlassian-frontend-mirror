import { useLayoutEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import { isCSSAnchorSupported } from '@atlaskit/editor-common/styles/native-anchor';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { getNodeTypeWithLevel } from '../pm-plugins/decorations-common';
import { getNodeContentElement } from '../ui/utils/get-node-content-element';
import {
	getAbsoluteSurfacePlacement,
	getLeftGutterSurfacePlacement,
	getSurfacePlacement,
	toMeasuredSurfaceWrapperPlacement,
	type SurfaceSide,
	type SurfaceWrapperPlacement,
} from '../ui/utils/get-surface-placement';
import type { SurfaceDescriptor } from './block-controls-surface-descriptors';

export type MeasuredSurfacePlacements = ReadonlyMap<string, SurfaceWrapperPlacement>;

const EMPTY_PLACEMENTS: MeasuredSurfacePlacements = new Map();

export const getSurfaceKey = (side: SurfaceSide, descriptor: SurfaceDescriptor): string =>
	`${side}:${descriptor.anchorName}`;

/**
 * Measures surface placements from DOM geometry when the browser cannot position surfaces with CSS
 * anchors. Returns an empty map and binds nothing when anchors are supported. Both sides share one
 * set of listeners, and measuring reruns only when a side's descriptor list changes, which the
 * descriptor resolver keeps stable across unrelated updates.
 */
export const useMeasuredSurfacePlacements = (
	editorView: EditorView,
	left: readonly SurfaceDescriptor[] | undefined,
	right: readonly SurfaceDescriptor[] | undefined,
): MeasuredSurfacePlacements => {
	const [placements, setPlacements] = useState<MeasuredSurfacePlacements>(EMPTY_PLACEMENTS);
	const animationFrameRef = useRef<number | undefined>(undefined);

	useLayoutEffect(() => {
		// Anchor support is fixed for the session, so anchored surfaces never set measured state.
		if (isCSSAnchorSupported()) {
			return;
		}
		const descriptors = [
			...(left ?? []).map((descriptor) => ({ descriptor, side: 'left' as const })),
			...(right ?? []).map((descriptor) => ({ descriptor, side: 'right' as const })),
		];
		if (descriptors.length === 0) {
			// Clear only when there is something to clear, so an empty map does not commit a render.
			setPlacements((previous) => (previous.size > 0 ? EMPTY_PLACEMENTS : previous));
			return;
		}

		const measurementTargets = descriptors.flatMap(({ descriptor, side }) => {
			const { blockControlsContext } = descriptor;
			const targetNodeElement = editorView.nodeDOM(blockControlsContext.targetNode.pos);
			const targetElementRoot =
				targetNodeElement instanceof HTMLElement
					? targetNodeElement
					: targetNodeElement?.parentElement;
			if (!targetElementRoot) {
				return [];
			}
			return [
				{
					descriptor,
					side,
					targetElement: getNodeContentElement(
						targetElementRoot,
						blockControlsContext.targetNode.type.name,
					),
					targetElementRoot,
				},
			];
		});
		const offsetParent = editorView.dom.offsetParent;
		const isDocumentOffsetParent = !offsetParent || offsetParent === getDocument()?.body;
		const scrollingOffsetParent =
			offsetParent instanceof HTMLElement && !isDocumentOffsetParent ? offsetParent : undefined;

		const updatePositions = () => {
			animationFrameRef.current = undefined;
			const offsetParentRect = offsetParent?.getBoundingClientRect();
			const offsetParentScrollTop = scrollingOffsetParent?.scrollTop ?? window.scrollY;
			const offsetParentScrollLeft = scrollingOffsetParent?.scrollLeft ?? window.scrollX;
			const nextPlacements = new Map<string, SurfaceWrapperPlacement>();

			for (const { descriptor, side, targetElement, targetElementRoot } of measurementTargets) {
				if (!targetElementRoot.isConnected || !targetElement.isConnected) {
					continue;
				}
				const { blockControlsContext, isTopLevel } = descriptor;
				const options = {
					layout: targetElementRoot.getAttribute('layout') ?? '',
					nodeRect: targetElement.getBoundingClientRect(),
					nodeType: blockControlsContext.targetNode.type.name,
					nodeTypeWithLevel: getNodeTypeWithLevel(blockControlsContext.targetNode.node),
					parentNodeType:
						blockControlsContext.targetNode.parentType === 'doc'
							? undefined
							: blockControlsContext.targetNode.parentType,
				};
				const placement =
					side === 'left' && isTopLevel
						? getLeftGutterSurfacePlacement({
								...options,
								leftGutterBoundary: offsetParentRect?.left ?? 0,
							})
						: getSurfacePlacement({ ...options, side });
				nextPlacements.set(
					getSurfaceKey(side, descriptor),
					toMeasuredSurfaceWrapperPlacement(
						getAbsoluteSurfacePlacement({
							offsetParentRect,
							offsetParentScrollLeft,
							offsetParentScrollTop,
							placement,
						}),
					),
				);
			}
			setPlacements(nextPlacements);
		};
		const schedulePositionUpdate = () => {
			if (animationFrameRef.current === undefined) {
				animationFrameRef.current = requestAnimationFrame(updatePositions);
			}
		};

		updatePositions();
		const resizeObserver = new ResizeObserver(schedulePositionUpdate);
		const observedElements = new Set<Element>([editorView.dom]);
		for (const { targetElement } of measurementTargets) {
			observedElements.add(targetElement);
		}
		if (offsetParent instanceof HTMLElement) {
			observedElements.add(offsetParent);
		}
		observedElements.forEach((element) => resizeObserver.observe(element));

		const unbindWindowResize = bind(window, {
			type: 'resize',
			listener: schedulePositionUpdate,
		});
		const unbindWindowScroll = bind(window, {
			type: 'scroll',
			listener: schedulePositionUpdate,
			options: { capture: true, passive: true },
		});
		const visualViewport = window.visualViewport;
		const unbindVisualViewportResize = visualViewport
			? bind(visualViewport, { type: 'resize', listener: schedulePositionUpdate })
			: undefined;
		const unbindVisualViewportScroll = visualViewport
			? bind(visualViewport, { type: 'scroll', listener: schedulePositionUpdate })
			: undefined;
		const unbindTransitionEnd = bind(editorView.dom, {
			type: 'transitionend',
			listener: schedulePositionUpdate,
			options: { capture: true },
		});

		return () => {
			if (animationFrameRef.current !== undefined) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = undefined;
			}
			resizeObserver.disconnect();
			unbindWindowResize();
			unbindWindowScroll();
			unbindVisualViewportResize?.();
			unbindVisualViewportScroll?.();
			unbindTransitionEnd();
		};
	}, [editorView, left, right]);

	return placements;
};
