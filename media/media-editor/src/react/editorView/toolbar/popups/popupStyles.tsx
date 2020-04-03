import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

// TODO Extract common part from these:

export const LineWidthPopupContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-wrap: wrap;
  right: 270px;
  padding: 9px;
  margin: -28px -20px; // Compensation for default big padding that inline dialog comes with
`;

export const ColorPopupContentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 144px;
  padding: 8px;
  margin: -16px -24px; // Compensation for default big padding that inline dialog comes with
`;

export const ShapePopupContentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 128px;
  padding: 8px;
  margin: -20px -32px; // Compensation for default big padding that inline dialog comes with
  > * {
    text-align: left;
    border-radius: 0;
  }
`;
