/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { R400 } from '@atlaskit/theme/colors';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const fontFamily = getFontFamily();

const requiredIndicatorStyles = css({
  paddingLeft: token('space.025', '2px'),
  color: token('color.text.danger', R400),
  fontFamily,
});

export default function RequiredAsterisk() {
  return (
    <span css={requiredIndicatorStyles} aria-hidden="true" title="required">
      *
    </span>
  );
}
