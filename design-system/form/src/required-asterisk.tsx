/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { R400 } from '@atlaskit/theme/colors';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSize = getGridSize();
const fontFamily = getFontFamily();

const requiredIndicatorStyles = css({
  paddingLeft: `${gridSize / 4}px`,
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
