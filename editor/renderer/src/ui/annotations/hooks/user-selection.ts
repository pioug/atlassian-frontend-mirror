import { useContext, useEffect } from 'react';
import {
  useAnnotationRangeDispatch,
  useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { AnnotationsDraftContext } from '../context';
import { isRangeInsideOfRendererContainer } from './utils';

type Props = {
  rendererRef: React.RefObject<HTMLDivElement>;
};

export const useUserSelectionRange = (
  props: Props,
): [Range | null, () => void] => {
  const {
    rendererRef: { current: rendererDOM },
  } = props;
  const { clearSelectionRange, setRange } = useAnnotationRangeDispatch();
  const { range, type } = useAnnotationRangeState();
  const annotationDraftPosition = useContext(AnnotationsDraftContext);
  const hasAnnotationDraft = !!annotationDraftPosition;

  useEffect(() => {
    if (!document || !rendererDOM) {
      return;
    }

    const onSelectionChange = (event: Event) => {
      const sel = document.getSelection();

      if (
        !sel ||
        sel.type !== 'Range' ||
        sel.rangeCount !== 1 ||
        hasAnnotationDraft
      ) {
        return;
      }

      const _range = sel.getRangeAt(0);

      if (
        rendererDOM &&
        isRangeInsideOfRendererContainer(rendererDOM, _range)
      ) {
        setRange(_range.cloneRange());
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      clearSelectionRange();
    };
  }, [rendererDOM, hasAnnotationDraft, setRange, clearSelectionRange]);

  return [type === 'selection' ? range : null, clearSelectionRange];
};
