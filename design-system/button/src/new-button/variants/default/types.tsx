import { type Size } from '@atlaskit/icon/types';

import { type IconProp } from '../types';

export type CommonDefaultButtonProps = {
  /**
   * Places an icon within the button, after the button's text
   */
  iconAfter?: IconProp;
  /**
   * Set the size of the icon after.
   *
   * This is UNSAFE as it will be removed in future in favor of a 100% bounded API
   */
  UNSAFE_iconAfter_size?: Size;
  /**
   * Places an icon within the button, before the button's text
   */
  iconBefore?: IconProp;
  /**
   * Set the size of the icon before.
   *
   * This is UNSAFE as it will be removed in future in favor of a 100% bounded API
   */
  UNSAFE_iconBefore_size?: Size;
  /**
   * Option to fit button width to its parent width
   */
  shouldFitContainer?: boolean;
};
