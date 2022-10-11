/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { md } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';
import { toAbsolutePath } from './index';

const styles = css`
  code:not([class]) {
    border-radius: 3px;
    display: inline-block;
    font-size: 12px;
    margin: 2px 0;
    padding: 0 0.2em;
    background-color: ${token('color.background.neutral', '#091E420F')};
    color: ${token('color.text', '#172B4D')};
  }
`;

const customMd = md.customize({
  renderers: {
    link: (props: { href?: string; title?: string; children?: object }) => {
      const { href, title, children } = props;
      const url = toAbsolutePath(href);
      return React.createElement('a', { href: url, title }, children);
    },
  },
});

const withCustomStyles = (tag: Function) => (
  strings: TemplateStringsArray,
  ...args: React.ReactNode[]
) => <div css={styles}>{tag(strings, ...args)}</div>;

export default withCustomStyles(customMd);
