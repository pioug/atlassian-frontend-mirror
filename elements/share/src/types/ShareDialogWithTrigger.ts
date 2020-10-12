// eslint-disable-next-line import/no-extraneous-dependencies
import { Placement } from '@atlaskit/popper';
import { TriggerProps } from '@atlaskit/popup';

import { ShareError } from './ShareContentState';

export type RenderCustomTriggerButton = (
  args: {
    error?: ShareError;
    isSelected?: boolean;
    onClick: () => void;
  },
  triggerProps: TriggerProps,
) => React.ReactNode;

export type DialogPlacement = Placement;

/**
 * Ideally, this would be Pick<PopupProps, ''>, but that doesn't play well
 * with the demo page and clearly visible options on that page.
 */
export type DialogBoundariesElement = 'viewport' | 'window' | 'scrollParent';
