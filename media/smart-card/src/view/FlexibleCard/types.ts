import { MessageDescriptor } from 'react-intl-next';

import { CardState } from '../../state/store/types';
import { SmartLinkSize, SmartLinkTheme } from '../../constants';
import { CardAppearance } from '../../view/Card';
import { CardProviderRenderers } from '../../state/context/types';

export type FlexibleCardProps = {
  appearance?: CardAppearance;
  cardState: CardState;
  onAuthorize?: () => void;
  renderers?: CardProviderRenderers;
  testId?: string;
  ui?: FlexibleUiOptions;
  url: string;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
};

export type FlexibleUiOptions = {
  hideElevation?: boolean;
  hidePadding?: boolean;
  hideBackground?: boolean;
  size?: SmartLinkSize;
  theme?: SmartLinkTheme;
};

export type RetryOptions = {
  descriptor?: MessageDescriptor;
  onClick?: ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  values?: Record<string, string>;
};
