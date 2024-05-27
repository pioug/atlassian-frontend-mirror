/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const descriptionStyles = css({
  marginTop: token('space.0', '0px'),
  marginBottom: token('space.300', '24px'),
  color: token('color.text', N800),
});

/**
 * __Description__
 *
 * Description of Empty State.
 *
 * @internal
 */
const Description: FC<{ children: ReactNode }> = ({ children }) => (
  <p css={descriptionStyles}>{children}</p>
);

export default Description;
