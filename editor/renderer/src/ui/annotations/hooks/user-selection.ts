import { useEffect, useRef, useCallback } from 'react';
import {
	type RangeType,
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { isRangeInsideOfRendererContainer } from './utils';
import { isRoot } from '../../../steps';
import { fg } from '@atlaskit/platform-feature-flags';
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
			if (fg('platform_renderer_triple_click_selects_paragraph')) {
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

					// Skip if the selection hasn’t changed
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
			} else {
				if (selectionTimeoutRef.current) {
					clearTimeout(selectionTimeoutRef.current);
				}

				selectionTimeoutRef.current = setTimeout(() => {
					const sel = document.getSelection();

					if (!sel || sel.type !== 'Range' || sel.rangeCount !== 1) {
						if (isAnnotationManagerEnabled) {
							clearSelectionRange();
						}
						return;
					}

					const _range = sel.getRangeAt(0);

					if (rendererDOM && isRangeInsideOfRendererContainer(rendererDOM, _range)) {
						const { startContainer, endContainer, commonAncestorContainer } = _range;
						const parentNode = startContainer.parentNode;

						// ED-23493
						// On triple-click in Chrome and Safari, the native Selection API's range has endContainer as a non-text node
						// and commonAncestorContainer as root level div.ak-renderer-document when the node is followed by div or hr.

						// Triple clicks are the only case that can cause the endContainer to be a non-text node
						// Same check for highlight range logic in confluence/next/packages/comments-util/src/domUtils.ts Line 180
						const isTripleClick = endContainer.nodeType !== Node.TEXT_NODE;

						// isAnnotationAllowedOnRange range validation is checking if the parent container is root element and disable the comment if it is.
						// platform/packages/editor/renderer/src/steps/index.ts Line 180

						// This workaround ensures the endContainer is set to a text node when endContainer is non-text and the parent container is the root element
						if (
							isTripleClick &&
							commonAncestorContainer &&
							commonAncestorContainer.nodeType === Node.ELEMENT_NODE &&
							// Ignored via go/ees005
							// eslint-disable-next-line @atlaskit/editor/no-as-casting
							isRoot(commonAncestorContainer as HTMLElement) &&
							parentNode?.nodeName === 'P' // ignore if the parent node is strong, em, etc.
						) {
							const lastChild =
								parentNode?.lastChild && parentNode?.lastChild?.nodeType === Node.TEXT_NODE
									? parentNode?.lastChild
									: parentNode?.lastChild?.childNodes[0];

							_range.setEnd(lastChild as Node, (lastChild as Text).length || 0);
						}
						setSelectionRange(_range.cloneRange());
					}
				}, 250);
			}
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
