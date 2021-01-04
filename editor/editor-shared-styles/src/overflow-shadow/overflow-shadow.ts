import { css } from 'styled-components';

import { ThemedValue } from '@atlaskit/theme/types';

export const overflowShadow = ({
  background,
  width,
}: {
  background: ThemedValue<string> | string;
  width: string;
}) => css`
/* shadow cover right */ linear-gradient(
  to left,
  ${background} ${width},
  transparent ${width}
),
/* overflow shadow right */
  linear-gradient(
    to left,
    rgba(9, 30, 66, 0.13) 0,
    rgba(99, 114, 130, 0) ${width}
  ),
/* overflow shadow left */
  linear-gradient(
    to right,
    rgba(9, 30, 66, 0.13) 0,
    rgba(99, 114, 130, 0) ${width}
  )
`;
