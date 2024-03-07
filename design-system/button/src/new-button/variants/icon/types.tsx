import {
  type IconButtonAppearance,
  type IconButtonSpacing,
  type IconProp,
  type IconSize,
} from '../types';

export type CommonIconButtonProps = {
  /**
   * The button style variation.
   */
  appearance?: IconButtonAppearance;
  /**
   * Places an icon within the button.
   */
  icon: IconProp;
  /**
   * Provide an accessible label, often used by screen readers.
   */
  label: string;
  // Prevent duplicate labels being added.
  'aria-label'?: never;
  /**
   * Set the shape of the icon, defaults to square with rounded corners.
   */
  shape?: 'default' | 'circle';
  /**
   * Controls the amount of padding in the button.
   */
  spacing?: IconButtonSpacing;
  /**
   * Set the size of the icon. `medium` is default, so it does not need to be specified.
   * This is UNSAFE as it will be removed in future in favor of a 100% bounded API.
   */
  UNSAFE_size?: IconSize;
};
