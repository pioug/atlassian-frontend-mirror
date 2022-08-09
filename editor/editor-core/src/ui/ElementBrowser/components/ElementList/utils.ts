import {
  ELEMENT_LIST_PADDING,
  FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS,
  SCROLLBAR_WIDTH,
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
    containerWidth - (scrollbarWidth + ELEMENT_LIST_PADDING);
  return {
    availableWidth,
    columnCount,
  };
}

let CALCULATED_SCROLLBAR_WIDTH: number;

export function getScrollbarWidth(): number {
  if (!CALCULATED_SCROLLBAR_WIDTH) {
    const container = document.createElement('div');
    container.style.visibility = 'hidden';
    container.style.overflow = 'scroll';
    document.body.appendChild(container);

    const innerContainer = document.createElement('div');
    container.appendChild(innerContainer);

    const scrollbarWidth = container.offsetWidth - innerContainer.offsetWidth;

    container.parentNode?.removeChild(container);

    if (scrollbarWidth) {
      CALCULATED_SCROLLBAR_WIDTH = scrollbarWidth;
      return scrollbarWidth;
    }

    return SCROLLBAR_WIDTH;
  } else {
    return CALCULATED_SCROLLBAR_WIDTH;
  }
}
