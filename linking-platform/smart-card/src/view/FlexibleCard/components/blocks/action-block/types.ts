import type { Space } from '@atlaskit/primitives';
import type { ActionName } from '../../../../../constants';
import type { BlockProps } from '../types';

export type ActionBlockProps = {
  /**
   * Callback once action is executed.
   */
  onClick?: (name: ActionName) => {};
  /**
   * Array.Sort function to order the actions
   */
  sort?: (a: ActionName, b: ActionName) => number;
  /**
   * Used to add space along the inline axis (typically horizontal).
   */
  spaceInline?: Space;
} & BlockProps;
