import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import { Pressable } from '../src';

export default function DisabledWithTooltip() {
  return (
    // Tooltip should not display
    <Tooltip content="Tooltip content">
      <Pressable testId="pressable-disabled-with-tooltip" isDisabled>
        Disabled
      </Pressable>
    </Tooltip>
  );
}
