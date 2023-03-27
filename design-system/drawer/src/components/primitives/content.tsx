/** @jsx jsx */

import { css, CSSObject, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { ContentProps } from '../types';

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

  // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage, @repo/internal/react/no-unsafe-spread-props, @repo/internal/react/use-primitives
  <div css={css(cssFn(defaultStyles))} {...props} />
);

export default {
  component: Content,
  cssFn: contentCSS,
};
