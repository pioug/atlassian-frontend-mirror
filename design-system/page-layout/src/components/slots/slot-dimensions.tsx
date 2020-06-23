/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

interface SlotDimensionsProps {
  variableName: string;
  value?: number;
}
export default ({ variableName, value }: SlotDimensionsProps) => (
  <Global
    styles={css`
      :root {
        --${variableName}: ${value}px;
      }
   `}
  />
);
