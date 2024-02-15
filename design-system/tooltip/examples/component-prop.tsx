import React from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Tooltip, { TooltipPrimitive } from '../src';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: ${token('border.radius', '4px')};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  max-height: 300px;
  max-width: 300px;
  padding: ${token('space.100', '8px')} ${token('space.150', '12px')};
`;

export default () => (
  <Tooltip component={InlineDialog} content="This is a tooltip">
    {(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
  </Tooltip>
);
