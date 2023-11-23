import { type Size } from '@atlaskit/icon/types';

import { type IconButtonAppearance, type IconProp } from '../types';

export type CommonIconButtonProps = {
  /**
   * The button style variation
   */
  appearance?: IconButtonAppearance;
  /**
   * Places an icon within the button
   */
  icon: IconProp;
  /**
   * Provide an accessible label, often used by screen readers
   */
  label: string;
  /**
   * Set the size of the icon
   *
   * This is UNSAFE as it will be removed in future in favor of a 100% bounded API
   */
  UNSAFE_size?: Size;
};
