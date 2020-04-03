import { gridSize } from '@atlaskit/theme/constants';
import { Rectangle } from '@atlaskit/media-ui';

export const DEFAULT_VISIBLE_PREDEFINED_AVATARS = 5;
export const AVATAR_DIALOG_WIDTH = 375;
export const AVATAR_DIALOG_HEIGHT = 470;
export const PREDEFINED_AVATARS_VIEW_WIDTH = 343;
export const PREDEFINED_AVATARS_VIEW_HEIGHT = 290;

export const CONTAINER_SIZE = gridSize() * 32;
export const CONTAINER_INNER_SIZE = gridSize() * 25;
export const CONTAINER_PADDING = (CONTAINER_SIZE - CONTAINER_INNER_SIZE) / 2;

export const CONTAINER_RECT = new Rectangle(CONTAINER_SIZE, CONTAINER_SIZE);
