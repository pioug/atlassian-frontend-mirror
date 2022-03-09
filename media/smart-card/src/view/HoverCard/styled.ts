import styled from '@emotion/styled';
import { TooltipPrimitive } from '@atlaskit/tooltip';

export const HoverCardContainer = styled(TooltipPrimitive)`
  background: none;
  border-width: 0;
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  max-width: 500px;
  padding: 0;
`;
