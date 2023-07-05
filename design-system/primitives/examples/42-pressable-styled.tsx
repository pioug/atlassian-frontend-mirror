/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { Pressable } from '../src';

const pressableStyles = css({
  borderRadius: token('border.radius.100', '3px'),
  color: token('color.text.inverse', '#FFF'),
});

export default function Styled() {
  return (
    <Pressable
      testId="pressable-styled"
      backgroundColor="color.background.brand.bold"
      padding="space.100"
      css={pressableStyles}
    >
      Press me
    </Pressable>
  );
}
