/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';

import { type Instruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/list-item';
import {
	draggable,
	dropTargetForElements,
	type ElementGetFeedbackArgs,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { DragPreview } from './drag-preview';
import { DropIndicator } from './drop-indicator';
import { attachInstruction, extractInstruction } from './hitbox';

type TInternalState =
	| {
			type: 'idle';
	  }
	| {
			type: 'preview';
			container: HTMLElement;
			ui: {
				elemBefore?: ReactNode;
				content: ReactNode;
			};
	  }
	| {
			type: 'dragging';
	  }
	| {
			type: 'is-over';
			instruction: Instruction | null;
	  };

export type TMenuItemDragAndDropState =
	| Exclude<TInternalState, { type: 'preview' }>
	| {
			type: 'preview';
	  };

const idle: TInternalState = { type: 'idle' };

type TPDNDDraggableArgs = Required<Parameters<typeof draggable>[0]>;
type TPDNDDropTargetArgs = Required<Parameters<typeof dropTargetForElements>[0]>;

type TDraggableArgs = {
	// Giving this function the same parameters as `getDraggableInitialData`
	getDragPreviewPieces: (args: Parameters<TPDNDDraggableArgs['getInitialData']>[0]) => {
		elemBefore?: ReactNode;
		content: ReactNode;
	};
	getInitialData: (
		args: Parameters<TPDNDDraggableArgs['getInitialData']>[0],
	) => Record<string | symbol, unknown>;

	canDrag?: TPDNDDraggableArgs['canDrag'];
};

type TDropTargetArgs = {
	getOperations: (
		args: Parameters<TPDNDDropTargetArgs['getData']>[0],
	) => Parameters<typeof attachInstruction>[1]['operations'];
	getData: TPDNDDropTargetArgs['getData'];
	canDrop: TPDNDDropTargetArgs['canDrop'];
};

/**
 * A convenience helper for setting up drag and drop for menu items
 *
 * - Don't include the `draggable` property if you don't want the menu item to be a draggable
 * - Don't include the `dropTarget` property if you don't want the menu item to be a drop target
 */
export function useMenuItemDragAndDrop({
	draggable: draggableArgs,
	dropTarget: dropTargetArgs,
}: {
	draggable?: TDraggableArgs;
	dropTarget?: TDropTargetArgs;
}) {
	const draggableAnchorRef = useRef<HTMLAnchorElement | null>(null);
	const draggableButtonRef = useRef<HTMLButtonElement | null>(null);
	const dropTargetRef = useRef<HTMLDivElement | null>(null);
	const [internalState, setInternalState] = useState<TInternalState>(idle);

	const getDraggableElement = useCallback(() => {
		return draggableAnchorRef.current ?? draggableButtonRef.current ?? null;
	}, []);

	// Set up draggable
	useEffect(() => {
		// Don't set up a draggable if there are no draggable args
		if (!draggableArgs) {
			return;
		}
		const element = getDraggableElement();
		invariant(element, `draggableAnchorRef or draggableButtonRef not set`);

		return draggable({
			element,
			getInitialData: draggableArgs.getInitialData,
			canDrag: draggableArgs.canDrag,
			onGenerateDragPreview({ nativeSetDragImage, source, location }) {
				setCustomNativeDragPreview({
					nativeSetDragImage,
					getOffset: pointerOutsideOfPreview({
						x: token('space.200'),
						y: token('space.100'),
					}),
					render({ container }) {
						const args: ElementGetFeedbackArgs = {
							dragHandle: source.dragHandle,
							element: source.element,
							input: location.current.input,
						};
						setInternalState({
							type: 'preview',
							container,
							ui: draggableArgs.getDragPreviewPieces(args),
						});
					},
				});
			},
			onDragStart() {
				setInternalState({ type: 'dragging' });
			},
			onDrop() {
				setInternalState(idle);
			},
		});
	}, [draggableArgs, getDraggableElement]);

	// Set up drop target
	useEffect(() => {
		if (!dropTargetArgs) {
			return;
		}

		// Don't need to provide a draggable element to have a drop target.
		// Using this element in our `canDrop` check
		const draggableElement = getDraggableElement();

		const dropTarget = dropTargetRef.current;
		invariant(dropTarget, `dropTargetRef was not set`);

		return dropTargetForElements({
			element: dropTarget,
			// cannot drop on self
			canDrop: (args): boolean => {
				// cannot drop on self
				if (args.source.element === draggableElement) {
					return false;
				}
				if (dropTargetArgs.canDrop) {
					return dropTargetArgs.canDrop(args);
				}
				return true;
			},
			// menu items are always sticky, and the GroupDropIndicator should clear stickiness
			getIsSticky: () => true,
			getData(args) {
				const data = dropTargetArgs.getData?.(args) ?? {};
				const operations = dropTargetArgs.getOperations(args);
				return attachInstruction(data, {
					input: args.input,
					element: args.element,
					operations,
				});
			},
			onDragStart({ self }) {
				const instruction: Instruction | null = extractInstruction(self.data);
				setInternalState({ type: 'is-over', instruction });
			},
			onDrag({ self }) {
				const instruction: Instruction | null = extractInstruction(self.data);
				setInternalState((current) => {
					if (
						current.type === 'is-over' &&
						instruction?.operation === current.instruction?.operation &&
						instruction?.blocked === current.instruction?.blocked
					) {
						return current;
					}
					return { type: 'is-over', instruction };
				});
			},
			onDragLeave() {
				setInternalState(idle);
			},
			onDrop() {
				setInternalState(idle);
			},
			onDragEnter({ self }) {
				const instruction: Instruction | null = extractInstruction(self.data);
				setInternalState({ type: 'is-over', instruction });
			},
		});
	}, [dropTargetArgs, getDraggableElement]);

	const dragPreview: ReactNode = (() => {
		if (internalState.type !== 'preview') {
			return null;
		}

		return createPortal(
			<DragPreview elemBefore={internalState.ui.elemBefore}>
				{internalState.ui.content}
			</DragPreview>,
			internalState.container,
		);
	})();

	const dropIndicator = internalState.type === 'is-over' && internalState.instruction && (
		<DropIndicator instruction={internalState.instruction} />
	);

	const state: TMenuItemDragAndDropState = useMemo(() => {
		if (internalState.type === 'preview') {
			return { type: 'preview' };
		}
		// returning a new object to avoid modification of our `internalState` object
		return { ...internalState };
	}, [internalState]);

	return {
		state,
		draggableButtonRef,
		dropTargetRef,
		draggableAnchorRef,
		dragPreview,
		dropIndicator,
	};
}
