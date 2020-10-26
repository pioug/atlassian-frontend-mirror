import React from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/standard-button';

import Tooltip, { TooltipPrimitive } from '../src';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  max-height: 300px;
  max-width: 300px;
  padding: 8px 12px;
`;

export default () => (
  <Tooltip component={InlineDialog} content="Hello World">
    <Button>Hover Over Me</Button>
  </Tooltip>
);
