import React from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Tooltip, { TooltipPrimitive } from '../../src';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: ${token('border.radius', '4px')};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box;
  padding: ${token('space.100', '8px')} ${token('space.150', '12px')};
`;

const TooltipCustomizationExample = () => (
  <Tooltip
    component={InlineDialog}
    content="This tooltip is styled like an inline dialog"
  >
    {(tooltipProps) => <Button {...tooltipProps}>Hover Over Me</Button>}
  </Tooltip>
);

export default TooltipCustomizationExample;
