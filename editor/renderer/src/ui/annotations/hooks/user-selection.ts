import { useEffect, useRef, useCallback } from 'react';
import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import type { RangeType } from '../contexts/AnnotationRangeContext';
import { isRangeInsideOfRendererContainer } from './utils';
import { useAnnotationManagerDispatch } from '../contexts/AnnotationManagerContext';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
		(_event: Event) => {
			if (selectionTimeoutRef.current) {
				clearTimeout(selectionTimeoutRef.current);
			}

			/*
			 * The 100ms debounce batches rapid `selectionchange` events during user drag/extend
			 * operations into a single React update. When the nudge button triggers a programmatic
			 * `addRange`, it fires exactly ONE `selectionchange` — no batching needed. Skipping the
			 * debounce ensures annotation position is computed synchronously so the first click
			 * applies the yellow highlight immediately. `data-nudge-selection-active` is set
			 * exclusively by the Confluence comment nudge feature and is double-gated:
			 * (1) `expValEquals('confluence_comment_nudgebar_improvement', ...)` — explicit experiment
			 * gate; (2) `data-nudge-selection-active` — ensures 0ms only fires during an actual nudge
			 * click, not on every selectionchange for experiment-ON users. Zero behavioral change for
			 * other products or experiment-OFF users.
			 */
			const nudgeDelay =
				typeof document !== 'undefined' &&
				document.body?.getAttribute('data-nudge-selection-active') === 'true' &&
				expValEquals('confluence_comment_nudgebar_improvement', 'isEnabled', true)
					? 0
					: 100;
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
			}, nudgeDelay);
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
