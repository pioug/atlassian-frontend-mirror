import { MessageDescriptor } from 'react-intl-next';

import { CardState } from '../../state/store/types';
import { SmartLinkSize, SmartLinkTheme } from '../../constants';
import { CardAppearance } from '../../view/Card';
import { CardProviderRenderers } from '../../state/context/types';

export type FlexibleCardProps = {
  /* Determines the appearance of the Smart Link. */
  appearance?: CardAppearance;
  cardState: CardState;
  onAuthorize?: () => void;
  /* Any additional renderers required by Flexible UI. Currently used by icon to render Emoji. */
  renderers?: CardProviderRenderers;
  testId?: string;
  /* Determines the appearance of Flexible UI. */
  ui?: FlexibleUiOptions;
  /* Determines the URL of the Smart Link. */
  url: string;
  /* Determines the onClick behaviour of Flexible UI. This will proxy to the TitleBlock if supplied. */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
};

export type FlexibleUiOptions = {
  /* Determines whether the entire Smart Link container should be clickable. */
  clickableContainer?: boolean;
  /* Determines whether to hide elevation styling. */
  hideElevation?: boolean;
  /* Determines whether to hide css padding styling. */
  hidePadding?: boolean;
  /* Determines whether to hide css background color styling. */
  hideBackground?: boolean;
  /* Determines the default padding and sizing of the underlying blocks and elements within Flexible UI. */
  size?: SmartLinkSize;
  /* Determines the default theme of the Flexible UI. */
  theme?: SmartLinkTheme;
};

/* Retry options used if Smart Link resolves to an errored state. */
export type RetryOptions = {
  /* Determines the error message to show. */
  descriptor?: MessageDescriptor;
  /* Determines the onClick behaviour of the error message. */
  onClick?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  values?: Record<string, string>;
};
