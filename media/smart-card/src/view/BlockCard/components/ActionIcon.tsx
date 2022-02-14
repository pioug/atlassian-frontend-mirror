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
  left: '50%',
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
        <div data-testid="check-icon" style={spinnerStyles}>
          <CheckIcon size="small" label="check" />
        </div>
      );
    case 'failure':
      return (
        <div data-testid="cross-icon" style={spinnerStyles}>
          <CrossIcon size="small" label="check" />
        </div>
      );
  }
};
