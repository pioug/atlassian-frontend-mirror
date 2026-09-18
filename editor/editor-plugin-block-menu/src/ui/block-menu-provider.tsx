import React, { useCallback, createContext, useContext, useRef } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import {
	getBlockMenuAnchorMetrics,
	type BlockMenuAnchorMetrics,
} from './utils/fixBlockMenuPositionAndScroll';

export type Direction = 'moveUp' | 'moveDown';

type BlockMenuProviderProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
	editorView: EditorView | undefined;
};

export type BlockMenuContextType = {
	/**
	 * Drag handle and popup geometry as laid out when the menu opened.
	 */
	anchorMetricsRef: React.MutableRefObject<BlockMenuAnchorMetrics | undefined>;
	getFirstSelectedDomNode: () => Element | undefined;
	/**
	 * The top level block a move transaction has just moved.
	 */
	getMovedBlockDomNode: () => Element | undefined;
	/**
	 * The top level block the block menu is open for, which is what the drag handle is anchored to.
	 */
	getSelectedBlockDomNode: () => Element | undefined;
	moveDownRef: React.MutableRefObject<HTMLButtonElement | null>;
	moveUpRef: React.MutableRefObject<HTMLButtonElement | null>;
	/**
	 * Callback for when the dropdown is open/closed. Receives an object with `isOpen` state.
	 *
	 * If the dropdown was closed programmatically, the `event` parameter will be `null`.
	 */
	onDropdownOpenChanged: (isOpen: boolean) => void;
};

const BlockMenuContext = createContext<BlockMenuContextType>({
	onDropdownOpenChanged: () => {},
	moveDownRef: React.createRef<HTMLButtonElement>(),
	moveUpRef: React.createRef<HTMLButtonElement>(),
	getFirstSelectedDomNode: () => undefined,
	getMovedBlockDomNode: () => undefined,
	getSelectedBlockDomNode: () => undefined,
	anchorMetricsRef: { current: undefined } as React.MutableRefObject<
		BlockMenuAnchorMetrics | undefined
	>,
});

export const useBlockMenu = (): BlockMenuContextType => {
	const context = useContext(BlockMenuContext);

	if (!context) {
		throw new Error('useBlockMenu must be used within BlockMenuProvider');
	}

	return context;
};

export const BlockMenuProvider = ({
	children,
	api,
	editorView,
}: BlockMenuProviderProps): React.JSX.Element => {
	const moveUpRef = useRef<HTMLButtonElement | null>(null);
	const moveDownRef = useRef<HTMLButtonElement | null>(null);
	const anchorMetricsRef = useRef<BlockMenuAnchorMetrics | undefined>(undefined);

	const getFirstSelectedDomNode = useCallback(() => {
		const from = api?.selection?.sharedState.currentState()?.selection?.from;

		if (from !== undefined) {
			const nodeDOM = editorView?.nodeDOM(from);
			if (nodeDOM instanceof Element) {
				return nodeDOM;
			}
		}
	}, [api, editorView]);

	const getTopLevelBlockDomNodeAt = useCallback(
		(from: number): Element | undefined => {
			if (!editorView) {
				return;
			}

			const nodeDOM = editorView.nodeDOM(from);
			const domAtPos = nodeDOM instanceof Element ? nodeDOM : editorView.domAtPos(from).node;
			const element = domAtPos instanceof Element ? domAtPos : domAtPos.parentElement;
			if (!element || !editorView.dom.contains(element)) {
				return;
			}

			let block = element;
			while (block.parentElement && block.parentElement !== editorView.dom) {
				block = block.parentElement;
			}
			return block;
		},
		[editorView],
	);

	const getSelectedBlockDomNode = useCallback((): Element | undefined => {
		const blockControlsState = api?.blockControls?.sharedState.currentState();
		// The editor selection is not necessarily in the block the menu was opened for.
		const from =
			blockControlsState?.activeNode?.pos ??
			blockControlsState?.menuTriggerByNode?.pos ??
			blockControlsState?.preservedSelection?.from;
		return from === undefined ? undefined : getTopLevelBlockDomNodeAt(from);
	}, [api, getTopLevelBlockDomNodeAt]);

	const getMovedBlockDomNode = useCallback((): Element | undefined => {
		// A move transaction maps its preserved selection onto the node it just moved, so this is
		// where that node ended up - unlike the block menu state, which keeps stale positions.
		const from = editorView?.state.selection.from;
		return from === undefined ? undefined : getTopLevelBlockDomNodeAt(from);
	}, [editorView, getTopLevelBlockDomNodeAt]);

	const onDropdownOpenChanged = useCallback(
		(isOpen: boolean) => {
			anchorMetricsRef.current = undefined;

			if (isOpen) {
				if (fg('platform_editor_blocks_patch_8')) {
					// The popup lays itself out next to the drag handle over the next frame or two.
					let remainingFrames = 3;
					const captureAnchorMetrics = () => {
						requestAnimationFrame(() => {
							anchorMetricsRef.current = getBlockMenuAnchorMetrics(getSelectedBlockDomNode());
							remainingFrames -= 1;
							if (!anchorMetricsRef.current && remainingFrames > 0) {
								captureAnchorMetrics();
							}
						});
					};
					captureAnchorMetrics();
				}
				return;
			}

			// On Dropdown closed, return focus to editor
			setTimeout(
				() =>
					requestAnimationFrame(() => {
						api?.core.actions.focus({ scrollIntoView: false });
					}),
				1,
			);
		},
		[api, getSelectedBlockDomNode],
	);

	return (
		<BlockMenuContext.Provider
			// eslint-disable-next-line @atlassian/perf-linting/no-inline-context-value, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			value={{
				onDropdownOpenChanged,
				moveDownRef,
				moveUpRef,
				getFirstSelectedDomNode,
				getMovedBlockDomNode,
				getSelectedBlockDomNode,
				anchorMetricsRef,
			}}
		>
			{children}
		</BlockMenuContext.Provider>
	);
};
