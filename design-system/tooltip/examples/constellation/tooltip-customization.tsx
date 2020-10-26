import React from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/standard-button';

import Tooltip, { TooltipPrimitive } from '../../src';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box;
  padding: 8px 12px;
`;

const TooltipCustomizationExample = () => (
  <Tooltip
    component={InlineDialog}
    content="This tooltip is styled like an inline dialog"
  >
    <Button>Hover Over Me</Button>
  </Tooltip>
);

export default TooltipCustomizationExample;
