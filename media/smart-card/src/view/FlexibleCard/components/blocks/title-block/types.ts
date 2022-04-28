import React from 'react';

import { BlockProps, ElementItem, ActionItem } from '../types';
import { SmartLinkPosition, SmartLinkTheme } from '../../../../../constants';
import { RetryOptions } from '../../../types';
import { LinkProps } from '../../elements/link/types';

export type TitleBlockProps = BlockProps & {
  /* Determines the maximum number of lines for the underlying link text to spread over. Maximum value of 2. */
  maxLines?: number;
  /* An array of elements to display in the TitleBlock. By default elements will be shown to the right of the TitleBlock */
  metadata?: ElementItem[];
  /** Determines the position of the icon in the TitleBlock.
   * Top: Icon will be rendered in the "top" left of the TitleBlock
   * Center: Icon will be rendered "center" relative to the vertical height of the TitleBlock.
   * If direction is Horizontal, icon will be rendered in the center relative to the horizontal width of the TitleBlock.
   */
  position?: SmartLinkPosition;
  /* The options that determine the retry behaviour when a Smart Link errors. */
  retry?: RetryOptions;
  /* An array of elements to display below the Title text. */
  subtitle?: ElementItem[];
  /* An array of actions to display in the TitleBlock. By default will be shown on the most left of the TitleBlock */
  actions?: ActionItem[];
  /* The theme of the Title text. Can be Black or Link (default URL blue) */
  theme?: SmartLinkTheme;
  /* The text to display in the Title. Overrides any text that is retreived from the Smart Link. */
  text?: string;
  /* Determines whether TitleBlock will hide actions until the user is hovering over the Smart Link. */
  showActionOnHover?: boolean;
  /* Determines the onClick behaviour of the Link. By default used for analytics. */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /* Determines the href target behaviour of the Link. */
  anchorTarget?: LinkProps['target'];
};

export type TitleBlockViewProps = TitleBlockProps & {
  actionGroup?: React.ReactNode;
  title: React.ReactNode;
};
