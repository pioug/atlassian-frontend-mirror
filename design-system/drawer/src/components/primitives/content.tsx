/** @jsx jsx */

import { css, type CSSObject, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type ContentProps } from '../types';

const defaultStyles: CSSObject = {
  flex: 1,
  overflow: 'auto',
  marginTop: token('space.300', '24px'),
};

const contentCSS = (): CSSObject => defaultStyles;

const Content = ({ cssFn, ...props }: ContentProps) => (
  /**
   * I noticed the implementation at @atlaskit/checkbox would send the props to cssFn rather
   * than the defaultStyles as the overrides guide suggests. I went with what the overrides
   * guide suggested as it made more sense as a transformer of the current styles rather than
   * a complete override with no chance of partially changing styles.
   */

  // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @repo/internal/react/no-unsafe-spread-props
  <div css={css(cssFn(defaultStyles))} {...props} />
);

export default {
  component: Content,
  cssFn: contentCSS,
};
