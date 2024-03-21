import React from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Tooltip, { TooltipPrimitive } from '../../src';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: ${token('border.radius', '4px')};
  box-shadow: ${token('elevation.shadow.overlay')};
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: ${token('color.text')};
  max-height: 300px;
  max-width: 300px;
  padding: ${token('space.100', '8px')} ${token('space.150', '12px')};
`;

export default () => (
  <Tooltip component={InlineDialog} content="This is a tooltip">
    {(tooltipProps) => (
      <Button appearance="primary" {...tooltipProps}>
        Hover over me
      </Button>
    )}
  </Tooltip>
);
