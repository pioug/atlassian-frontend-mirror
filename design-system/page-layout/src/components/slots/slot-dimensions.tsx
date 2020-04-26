/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

export default ({
  variableName,
  value,
}: {
  variableName: string;
  value?: number;
}) => (
  <Global
    styles={css`
      :root {
        --${variableName}: ${value}px;
      }
   `}
  />
);
