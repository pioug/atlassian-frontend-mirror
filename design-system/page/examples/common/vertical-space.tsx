/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const verticalSpaceStyles = css({
  marginBottom: token('space.300', '24px'),
});

const VerticalSpace = () => <div css={verticalSpaceStyles} />;

export default VerticalSpace;
