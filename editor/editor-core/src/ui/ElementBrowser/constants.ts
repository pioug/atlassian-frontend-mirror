import { gridSize } from '@atlaskit/theme/constants';

export const GRID_SIZE = gridSize();

export const DEVICE_BREAKPOINT_NUMBERS = {
  small: GRID_SIZE * 40,
  medium: GRID_SIZE * 75,
  large: GRID_SIZE * 128,
};

export const FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS = {
  small: GRID_SIZE * 50,
  medium: DEVICE_BREAKPOINT_NUMBERS.medium,
  large: DEVICE_BREAKPOINT_NUMBERS.large,
};

export const SIDEBAR_WIDTH = `${GRID_SIZE * 25}px`;

export const SIDEBAR_HEADING_WRAPPER_HEIGHT = `${GRID_SIZE * 6}px`;
export const SIDEBAR_HEADING_PADDING_LEFT = '12px';

export const INLINE_SIDEBAR_HEIGHT = '54px';

export const SEARCH_ITEM_MARGIN = '12px';
export const SEARCH_ITEM_HEIGHT_WIDTH = '20px';

export const SCROLLBAR_WIDTH = GRID_SIZE;
export const SCROLLBAR_THUMB_COLOR = '#eeeeee';
export const SCROLLBAR_TRACK_COLOR = 'rgba(255, 255, 255, 0)';

export const ELEMENT_LIST_PADDING = 2;

export const MODAL_WRAPPER_PADDING = 16;

export const ELEMENT_ITEM_HEIGHT = 75;
