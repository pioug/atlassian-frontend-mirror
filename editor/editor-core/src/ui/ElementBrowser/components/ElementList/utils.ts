import {
  ELEMENT_LIST_PADDING,
  FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS,
} from '../../constants';

export function getColumnCount(clientWidth: number): number {
  const { small, medium, large } = FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS;
  switch (true) {
    case clientWidth < small:
      return 1;
    case clientWidth >= small && clientWidth < medium:
      return Math.floor(clientWidth / 200);
    case clientWidth >= large:
      return Math.floor(clientWidth / 248);
    default:
      return Math.floor(clientWidth / 220);
  }
}

type DatumReturnType = {
  availableWidth: number;
  columnCount: number;
};

type Options = {
  gutterSize: number;
  scrollbarWidth: number;
};

export function generateVirtualizedContainerDatum(
  containerWidth: number,
  options: Options,
): DatumReturnType {
  const { scrollbarWidth } = options;
  const columnCount = getColumnCount(containerWidth);
  const availableWidth =
    containerWidth - (scrollbarWidth + ELEMENT_LIST_PADDING * 2);
  return {
    availableWidth,
    columnCount,
  };
}
