import { useCallback, useEffect, useState } from 'react';

export const isRangeInsideOfRendererContainer = (
  rendererDOM: HTMLElement,
  range: Range,
) => {
  const sourceRange = document.createRange();
  sourceRange.selectNode(rendererDOM);

  const isSelectionStartsAfterRenderer =
    range.compareBoundaryPoints(Range.START_TO_START, sourceRange) === 1;
  const isSelectionStartsBeforeRenderer =
    range.compareBoundaryPoints(Range.START_TO_END, sourceRange) === 1;
  const isSelectionEndsAfterRenderer =
    range.compareBoundaryPoints(Range.END_TO_END, sourceRange) === 1;

  return (
    isSelectionStartsAfterRenderer &&
    isSelectionStartsBeforeRenderer &&
    !isSelectionEndsAfterRenderer
  );
};

type Props = {
  rendererRef: React.RefObject<HTMLDivElement>;
};

export const useUserSelectionRange = (
  props: Props,
): [Range | null, () => void] => {
  const { rendererRef } = props;
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    const { current: rendererDOM } = rendererRef;
    if (!document || !rendererDOM) {
      return;
    }

    const onMouseUpEvent = (event: Event) => {
      const sel = document.getSelection();

      if (!sel || sel.type !== 'Range' || sel.rangeCount !== 1) {
        return;
      }

      const _range = sel.getRangeAt(0);

      if (isRangeInsideOfRendererContainer(rendererDOM, _range)) {
        const clonedRange = document.createRange();
        clonedRange.setStart(_range.startContainer, _range.startOffset);
        clonedRange.setEnd(_range.endContainer, _range.endOffset);

        setRange(clonedRange);
      }
    };

    document.addEventListener('selectionchange', onMouseUpEvent);

    return () => {
      document.removeEventListener('selectionchange', onMouseUpEvent);
    };
  }, [rendererRef, range]);

  const clearRange = useCallback(() => {
    setRange(null);
  }, []);

  return [range, clearRange];
};
