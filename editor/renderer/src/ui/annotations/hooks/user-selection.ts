import { useContext, useCallback, useEffect, useState } from 'react';
import { AnnotationsDraftContext } from '../context';
import { isRangeInsideOfRendererContainer } from './utils';

type Props = {
  rendererRef: React.RefObject<HTMLDivElement>;
};

export const useUserSelectionRange = (
  props: Props,
): [Range | null, () => void] => {
  const { rendererRef } = props;
  const [range, setRange] = useState<Range | null>(null);
  const annotationDraftPosition = useContext(AnnotationsDraftContext);
  const hasAnnotationDraft = !!annotationDraftPosition;

  useEffect(() => {
    const { current: rendererDOM } = rendererRef;
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

      if (isRangeInsideOfRendererContainer(rendererDOM, _range)) {
        setRange(_range.cloneRange());
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [rendererRef, range, hasAnnotationDraft]);

  const clearRange = useCallback(() => {
    setRange(null);
  }, []);

  return [range, clearRange];
};
