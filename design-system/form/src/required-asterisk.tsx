/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
  color: token('color.text.danger', R400),
  fontFamily: token('font.family.body'),
  paddingInlineStart: token('space.025'),
});

export default function RequiredAsterisk() {
  return (
    <span css={requiredIndicatorStyles} aria-hidden="true" title="required">
      *
    </span>
  );
}
