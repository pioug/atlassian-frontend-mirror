import React from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Tooltip, { TooltipPrimitive } from '../src';

const InlineDialog = styled(TooltipPrimitive)({
  background: 'white',
  borderRadius: token('border.radius', '4px'),
  boxShadow: token('elevation.shadow.overlay'),
  boxSizing: 'content-box',
  color: token('color.text'),
  maxHeight: '300px',
  maxWidth: '300px',
  padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});

export default () => (
  <Tooltip component={InlineDialog} content="This is a tooltip">
    {(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
  </Tooltip>
);
