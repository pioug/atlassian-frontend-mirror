/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { R500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { gridSize } from './constants';

const requiredIndicatorStyles = css({
  paddingLeft: gridSize * 0.25,
  color: token('color.text.danger', R500),
});

export default function RequiredIndicator() {
  return (
    <span css={requiredIndicatorStyles} aria-hidden>
      *
    </span>
  );
}
