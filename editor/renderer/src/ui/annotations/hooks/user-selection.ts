import { useEffect, useRef } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { isRangeInsideOfRendererContainer } from './utils';
import { isRoot } from '../../../steps';

type Props = {
	rendererRef: React.RefObject<HTMLDivElement>;
};

export const useUserSelectionRange = (props: Props): [Range | null, Range | null, () => void] => {
	const {
		rendererRef: { current: rendererDOM },
	} = props;
	const selectionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const { clearRange, setRange } = useAnnotationRangeDispatch();
	const { range, draftRange, type } = useAnnotationRangeState();

	useEffect(() => {
		if (!document || !rendererDOM) {
			return;
		}

		const onSelectionChange = (event: Event) => {
			if (selectionTimeoutRef.current) {
				clearTimeout(selectionTimeoutRef.current);
			}

			selectionTimeoutRef.current = setTimeout(() => {
				const sel = document.getSelection();

				if (!sel || sel.type !== 'Range' || sel.rangeCount !== 1) {
					return;
				}

				const _range = sel.getRangeAt(0);

				if (rendererDOM && isRangeInsideOfRendererContainer(rendererDOM, _range)) {
					if (fg('platform_editor_allow_annotation_triple_click')) {
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
							isRoot(commonAncestorContainer as HTMLElement) &&
							parentNode?.nodeName === 'P' // ignore if the parent node is strong, em, etc.
						) {
							const lastChild =
								parentNode?.lastChild && parentNode?.lastChild?.nodeType === Node.TEXT_NODE
									? parentNode?.lastChild
									: parentNode?.lastChild?.childNodes[0];

							_range.setEnd(lastChild as Node, (lastChild as Text).length || 0);
						}
					}
					setRange(_range.cloneRange());
				}
			}, 250);
		};

		document.addEventListener('selectionchange', onSelectionChange);

		return () => {
			document.removeEventListener('selectionchange', onSelectionChange);
			clearRange();
		};
	}, [rendererDOM, setRange, clearRange]);

	return [type === 'selection' ? range : null, draftRange, clearRange];
};
