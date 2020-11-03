/** Exists in its own module to allow mocking in unit tests */
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
