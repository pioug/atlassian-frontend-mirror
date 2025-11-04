import { useEffect, useRef, useCallback } from 'react';
import {
	type RangeType,
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { isRangeInsideOfRendererContainer } from './utils';
import { useAnnotationManagerDispatch } from '../contexts/AnnotationManagerContext';

type Props = {
	rendererRef: React.RefObject<HTMLDivElement>;
};

export const useUserSelectionRange = (
	props: Props,
): [RangeType, Range | null, Range | null, () => void] => {
	const {
		rendererRef: { current: rendererDOM },
	} = props;
	const selectionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const { clearSelectionRange, setSelectionRange } = useAnnotationRangeDispatch();
	const { range, type, selectionDraftRange } = useAnnotationRangeState();
	const { annotationManager } = useAnnotationManagerDispatch();
	const lastRangeRef = useRef<Range | null>(null);
	const isAnnotationManagerEnabled = !!annotationManager;

	const onSelectionChange = useCallback(
		(event: Event) => {
			if (selectionTimeoutRef.current) {
				clearTimeout(selectionTimeoutRef.current);
			}

			selectionTimeoutRef.current = setTimeout(() => {
				const sel = document.getSelection();

				if (!sel || sel.type !== 'Range' || sel.rangeCount !== 1) {
					lastRangeRef.current = null; // Clear last range if selection is invalid
					if (isAnnotationManagerEnabled) {
						clearSelectionRange();
					}
					return;
				}

				let _range = sel.getRangeAt(0);

				// Skip if the selection hasn't changed
				if (
					lastRangeRef.current &&
					_range.compareBoundaryPoints(Range.START_TO_START, lastRangeRef.current) === 0 &&
					_range.compareBoundaryPoints(Range.END_TO_END, lastRangeRef.current) === 0
				) {
					return;
				}

				if (rendererDOM && isRangeInsideOfRendererContainer(rendererDOM, _range)) {
					const { startContainer, endContainer } = _range;

					const isTripleClick = endContainer.nodeType !== Node.TEXT_NODE;

					if (isTripleClick) {
						let p: Node | null = startContainer;
						while (p && p.nodeName !== 'P' && p !== rendererDOM) {
							p = p.parentNode;
						}

						if (p && p.nodeName === 'P' && p instanceof Element) {
							const range = document.createRange();

							range.selectNodeContents(p);

							sel.removeAllRanges();
							sel.addRange(range);
							_range = sel.getRangeAt(0);
						}
					}
					setSelectionRange(_range.cloneRange());
					lastRangeRef.current = _range;
				}
			}, 100);
		},
		[rendererDOM, setSelectionRange, clearSelectionRange, isAnnotationManagerEnabled],
	);

	useEffect(() => {
		if (!document || !rendererDOM) {
			return;
		}
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener('selectionchange', onSelectionChange);

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			document.removeEventListener('selectionchange', onSelectionChange);
			clearSelectionRange();
		};
	}, [rendererDOM, onSelectionChange, clearSelectionRange]);

	return [type, range, selectionDraftRange, clearSelectionRange];
};
