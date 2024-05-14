import React from 'react';

import Button from '@atlaskit/button/new';
import Inline from '@atlaskit/primitives/inline';
import Stack from '@atlaskit/primitives/stack';

import Tooltip from '../../src';

export default () => (
  <Stack space="space.100">
    <Stack space="space.100">
      <p>Tooltip is interactive</p>
      <Inline space="space.100">
        <Tooltip content="This is a tooltip" position="right">
          {(tooltipProps) => (
            <Button appearance="primary" {...tooltipProps}>
              Hover me first
            </Button>
          )}
        </Tooltip>
        <Button>Hover me second</Button>
      </Inline>
    </Stack>
    <Stack space="space.100">
      <p>Tooltip is not interactive</p>
      <Inline space="space.100">
        <Tooltip
          content="This is a tooltip"
          position="right"
          ignoreTooltipPointerEvents
        >
          {(tooltipProps) => (
            <Button appearance="primary" {...tooltipProps}>
              Hover me first
            </Button>
          )}
        </Tooltip>
        <Button>Hover me second</Button>
      </Inline>
    </Stack>
  </Stack>
);
