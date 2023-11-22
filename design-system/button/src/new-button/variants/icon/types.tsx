import React from 'react';

import { type IconProps, type Size } from '@atlaskit/icon/types';

import { type IconButtonAppearance } from '../types';

export type CommonIconButtonProps = {
  /**
   * The button style variation
   */
  appearance?: IconButtonAppearance;
  /**
   * Places an icon within the button
   */
  icon: React.ComponentType<IconProps>;
  /**
   * Provide an accessible label, often used by screen readers
   */
  label: string;
  /**
   * Set the size of the icon
   *
   * Set to UNSAFE as it will be removed in future in favour of a 100% bounded API
   */
  UNSAFE_size?: Size;
};
