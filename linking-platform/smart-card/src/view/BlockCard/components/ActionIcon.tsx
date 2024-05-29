import React from 'react';
import CheckIcon from '@atlaskit/icon/glyph/check';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import type { ActionState } from './Action';

/*
  These styles are taken fro the spinner style for button. There was not an
  easy way to share tehm between the two components.
*/
export const spinnerStyles = {
  display: 'flex',
  position: 'absolute',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
  left: '50%',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
  top: '50%',
  transform: 'translate(-50%, -50%)',
} as const;

export const ActionIcon = ({ state }: { state: ActionState }) => {
  switch (state) {
    case 'init':
    case 'loading':
      return null;
    case 'success':
      return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        <div data-testid="check-icon" style={spinnerStyles}>
          <CheckIcon size="small" label="check" />
        </div>
      );
    case 'failure':
      return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        <div data-testid="cross-icon" style={spinnerStyles}>
          <CrossIcon size="small" label="check" />
        </div>
      );
  }
};
