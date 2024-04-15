import { type TooltipProps } from '@atlaskit/tooltip';

import {
  type IconButtonAppearance,
  type IconButtonSpacing,
  type IconProp,
  type IconSize,
} from '../types';

export type CommonIconButtonProps = {
  // Prevent duplicate labels being added.
  'aria-label'?: never;
  /**
   * The button style variation.
   */
  appearance?: IconButtonAppearance;
  /**
   * Places an icon within the button.
   */
  icon: IconProp;
  /**
   * Conditionally show a spinner over the top of a button.
   */
  isLoading?: boolean;
  /**
   * Prevent a tooltip from showing. Use sparingly.
   */
  isTooltipDisabled?: boolean;
  /**
   * Provide an accessible label, often used by screen readers.
   */
  label: React.ReactNode;
  /**
   * Set the shape of the icon, defaults to square with rounded corners.
   */
  shape?: 'default' | 'circle';
  /**
   * Controls the amount of padding in the button.
   */
  spacing?: IconButtonSpacing;
  /**
   * Props passed down to the Tooltip component.
   */
  tooltip?: Partial<Omit<TooltipProps, 'children'>>;
  /**
   * @deprecated Prefer `icon` render prop for icon customizations.
   *
   * Set the size of the icon. `medium` is default, so it does not need to be specified.
   * This is UNSAFE as it will be removed in future in favor of a 100% bounded API.
   */
  UNSAFE_size?: IconSize;
};
