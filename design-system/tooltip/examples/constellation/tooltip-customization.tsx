import React from 'react';

import styled from 'styled-components';

import Button from '@atlaskit/button';

import Tooltip from '../../src';
import { TooltipPrimitive } from '../../src/styled';

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
