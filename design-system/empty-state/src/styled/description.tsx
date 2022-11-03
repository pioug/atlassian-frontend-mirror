/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const descriptionStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  marginTop: token('spacing.scale.0', '0px'),
  // TODO Delete this comment after verifying spacing token -> previous value ``${getGridSize() * 3}px``
  marginBottom: token('spacing.scale.300', '24px'),
  color: token('color.text', N800),
});

/**
 * __Description__
 *
 * Description of Empty State.
 *
 * @internal
 */
const Description: FC = ({ children }) => (
  <p css={descriptionStyles}>{children}</p>
);

export default Description;
