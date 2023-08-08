/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@emotion/react';

import { media } from '@atlaskit/primitives/responsive';
import { token } from '@atlaskit/tokens';

const cardStyles = css({
  padding: token('space.050', '4px'),
  borderColor: token('color.border.discovery', 'blue'),
  borderStyle: 'solid',
  borderWidth: token('border.width.0', '0px'),
  [media.above.xs]: {
    padding: token('space.100', '8px'),
  },
  [media.above.sm]: {
    padding: token('space.150', '12px'),
    borderWidth: token('border.width', '1px'),
  },
  [media.above.md]: {
    padding: token('space.200', '16px'),
    borderWidth: token('border.width.outline', '2px'),
  },
});

export default () => (
  <div css={cardStyles}>
    Border becomes narrower at smaller breakpoints. Try it out by resizing the
    browser window.
  </div>
);
