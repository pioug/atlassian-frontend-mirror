import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import UNSAFE_PRESSABLE from '../src/components/pressable';

export default function DisabledWithTooltip() {
  return (
    // Tooltip should not display
    <Tooltip content="Tooltip content">
      <UNSAFE_PRESSABLE testId="pressable-disabled-with-tooltip" isDisabled>
        Disabled
      </UNSAFE_PRESSABLE>
    </Tooltip>
  );
}
