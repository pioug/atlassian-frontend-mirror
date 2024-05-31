import { useEffect, useRef } from 'react';
import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { isRangeInsideOfRendererContainer } from './utils';

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
