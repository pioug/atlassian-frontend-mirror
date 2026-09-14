/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import { jsx } from '@atlaskit/css';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import { BLOCK_CONTROLS_LEFT_SURFACE } from '@atlaskit/editor-common/block-controls/surface-keys';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { isCSSAnchorSupported } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import { willSurfaceRender } from '@atlaskit/editor-ui-control-model/surface-renderer';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getNodeTypeWithLevel } from '../pm-plugins/decorations-common';

import { BlockControlsLeftSurface } from './block-controls-left-surface';
import {
	createBlockControlsSurfaceContext,
	createBlockControlsSurfaceContextForPosition,
} from './block-controls-surface-context';
import { getBlockControlsSurfaceTargets } from './block-controls-surface-targets';
import { getNodeContentElement, hasInnerContentContainer } from './utils/get-node-content-element';
import {
	getAbsoluteSurfacePlacement,
	getAnchoredSurfacePlacement,
	getSurfacePlacement,
	toMeasuredSurfaceWrapperPlacement,
	type SurfaceWrapperPlacement,
} from './utils/get-surface-placement';
import { hasSurfaceControls } from './utils/has-surface-controls';

const EMPTY_SURFACE_POSITIONS: readonly number[] = [];
const EMPTY_SURFACE_COMPONENTS: [] = [];
const EMPTY_MEASURED_SURFACES: never[] = [];

type Props = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	editorView: EditorView;
};

export const BlockControlsLeftSurfaces = ({ api, editorView }: Props): React.JSX.Element | null => {
	const { activeNode, surfaceNodePositions } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		(states) => ({
			activeNode: states.blockControlsState?.activeNode,
			surfaceNodePositions:
				states.blockControlsState?.surfaceNodePositions ?? EMPTY_SURFACE_POSITIONS,
		}),
	);
	const components =
		api.uiControlRegistry?.actions.getComponents(BLOCK_CONTROLS_LEFT_SURFACE) ??
		EMPTY_SURFACE_COMPONENTS;
	const targets = useMemo(
		() => getBlockControlsSurfaceTargets(activeNode, surfaceNodePositions),
		[activeNode, surfaceNodePositions],
	);
	const surfaces = useMemo(
		() =>
			targets.flatMap((target) => {
				const context =
					target.source === 'stored'
						? createBlockControlsSurfaceContextForPosition(
								editorView.state,
								target.position,
								activeNode,
							)
						: createBlockControlsSurfaceContext(editorView, activeNode, target.source);
				if (!context) {
					return [];
				}
				const surfaceContext = createSurfaceContext(BLOCK_CONTROL_UI_CONTEXT, context);
				if (
					!hasSurfaceControls(components) ||
					!willSurfaceRender(components, BLOCK_CONTROLS_LEFT_SURFACE, surfaceContext)
				) {
					return [];
				}
				// Resolved here rather than in the measurement effect so an anchored surface is placed
				// in the same render that creates it — it never needs a second pass to find its node.
				//
				// At the moment, we only expect top-level nodes to have persistent controls.
				// See surfaceAnchorStyles in global-styles
				const anchorName =
					isCSSAnchorSupported() &&
					context.targetNode.parentType === 'doc' &&
					!hasInnerContentContainer(context.targetNode.type.name)
						? api.core?.actions.getAnchorIdForNode(context.targetNode.node, context.targetNode.pos)
						: undefined;
				return [{ ...target, anchorName, blockControlsContext: context, surfaceContext }];
			}),
		[activeNode, api, components, editorView, targets],
	);
	/**
	 * Placements that need no measuring, so they are derived rather than stored: every inset is an
	 * `anchor()` the browser re-resolves on every layout change.
	 */
	const anchoredPlacements = useMemo(
		() =>
			new Map<number, SurfaceWrapperPlacement>(
				surfaces.flatMap(({ anchorName, blockControlsContext, position }) =>
					anchorName
						? [
								[
									position,
									getAnchoredSurfacePlacement({
										anchorName,
										nodeType: blockControlsContext.targetNode.type.name,
										nodeTypeWithLevel: getNodeTypeWithLevel(blockControlsContext.targetNode.node),
										parentNodeType:
											blockControlsContext.targetNode.parentType === 'doc'
												? undefined
												: blockControlsContext.targetNode.parentType,
										side: 'left',
									}),
								] as const,
							]
						: [],
				),
			),
		[surfaces],
	);
	// Only the surfaces that still need measuring drive the effect below, so a document of anchored
	// blocks binds no scroll or resize listeners at all.
	//
	// The shared empty array matters: `surfaces` gets a new identity on every hover, since
	// `activeNode` is one of its dependencies. Returning a fresh `[]` would give the effect a
	// changed dependency each time and re-run it for nothing, which is the cost the anchored path
	// exists to avoid.
	const measuredSurfaces = useMemo(() => {
		const measured = surfaces.filter(({ anchorName }) => !anchorName);
		return measured.length === 0 ? EMPTY_MEASURED_SURFACES : measured;
	}, [surfaces]);
	const [placements, setPlacements] = useState<ReadonlyMap<number, SurfaceWrapperPlacement>>(
		new Map(),
	);
	const animationFrameRef = useRef<number | undefined>(undefined);

	useLayoutEffect(() => {
		if (measuredSurfaces.length === 0) {
			// Clear only when there is something to clear. Handing React a fresh Map every time would
			// fail its identity check and commit a render to replace one empty map with another.
			setPlacements((previous) => (previous.size > 0 ? new Map() : previous));
			return;
		}

		const measurementTargets = measuredSurfaces.flatMap(({ blockControlsContext, position }) => {
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
					blockControlsContext,
					position,
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
			const nextPlacements = new Map<number, SurfaceWrapperPlacement>();

			for (const {
				blockControlsContext,
				position,
				targetElement,
				targetElementRoot,
			} of measurementTargets) {
				if (!targetElementRoot.isConnected || !targetElement.isConnected) {
					continue;
				}
				const placement = getSurfacePlacement({
					layout: targetElementRoot.getAttribute('layout') ?? '',
					nodeRect: targetElement.getBoundingClientRect(),
					nodeType: blockControlsContext.targetNode.type.name,
					nodeTypeWithLevel: getNodeTypeWithLevel(blockControlsContext.targetNode.node),
					parentNodeType:
						blockControlsContext.targetNode.parentType === 'doc'
							? undefined
							: blockControlsContext.targetNode.parentType,
					side: 'left',
				});
				nextPlacements.set(
					position,
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
	}, [editorView, measuredSurfaces]);

	return (
		<>
			{surfaces.map(({ position, source, surfaceContext }) => (
				<BlockControlsLeftSurface
					api={api}
					components={components}
					forceVisibleOnMouseOut={Boolean(activeNode?.handleOptions?.isFocused)}
					key={position}
					placement={anchoredPlacements.get(position) ?? placements.get(position)}
					source={source}
					surfaceContext={surfaceContext}
				/>
			))}
		</>
	);
};
