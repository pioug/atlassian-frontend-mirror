import React from 'react';
import styled from '@emotion/styled';
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';
import { Box, xcss } from '@atlaskit/primitives';

import type { AIIndicatorTooltipProps } from './types';

const AIIndicatorTooltipPrimitive = styled(TooltipPrimitive)`
  border-radius: ${token('border.radius', '3px')};
  background-color: ${token('elevation.surface.raised', 'white')};
  box-shadow: ${token(
    'elevation.shadow.overlay',
    '0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
  )};
  box-sizing: content-box;
  padding: ${token('space.200', '16px')};
  max-width: 350px;
`;

const triggerStyles = xcss({ display: 'inline-flex' });

const AIIndicatorTooltip: React.FC<AIIndicatorTooltipProps> = ({
  content,
  trigger,
}) => {
  return (
    <Tooltip
      component={AIIndicatorTooltipPrimitive}
      content={content}
      tag="span"
    >
      {(tooltipProps) => (
        <Box xcss={triggerStyles} {...tooltipProps}>
          {trigger}
        </Box>
      )}
    </Tooltip>
  );
};

export default AIIndicatorTooltip;
