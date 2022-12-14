/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { R500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
  paddingLeft: token('space.025', '2px'),
  color: token('color.text.danger', R500),
});

export default function RequiredIndicator() {
  return (
    <span css={requiredIndicatorStyles} aria-hidden>
      *
    </span>
  );
}
