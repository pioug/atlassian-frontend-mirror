/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';

const separator = css`
  background: ${N30};
  width: 1px;
  height: 20px;
  margin: 0 4px;
  align-self: center;
`;

export default () => <div css={separator} className="separator" />;
