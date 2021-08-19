// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  codeFontFamily,
  colors,
  fontFamily,
  gridSize,
  typography,
} from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

import evaluateInner from './utils/evaluate-inner';

export default evaluateInner`
  body,
  html {
    height: 100%;
    width: 100%;
  }

  body {
    background-color: ${token('color.background.default', '#fff')};
    color: ${token('color.text.highEmphasis', colors.N800)};
    font-family: ${fontFamily};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.42857142857143;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    text-decoration-skip-ink: auto;
  }

  /* Default margins */
  p,
  ul,
  ol,
  dl,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  blockquote,
  pre,
  form,
  table {
    margin: ${gridSize() * 1.5}px 0 0 0;
  }

  /* Links */
  a {
    color: ${token('color.text.link.resting', colors.B400)};
    text-decoration: none;
  }
  a:hover {
    color: ${token('color.text.link.resting', colors.B300)};
    text-decoration: underline;
  }
  a:active {
    color: ${token('color.text.link.pressed', colors.B500)};
  }
  a:focus {
    outline: 2px solid ${token('color.border.focus', colors.B100)};
    outline-offset: 2px;
  }

  /* Headings */
  h1 {
    ${typography.h800()}
  }
  h2 {
    ${typography.h700()}
  }
  h3 {
    ${typography.h600()}
  }
  h4 {
    ${typography.h500()}
  }
  h5 {
    ${typography.h400()}
  }
  h6 {
    ${typography.h300()}
  }

  /* Lists */
  ul,
  ol,
  dl {
    padding-left: ${gridSize() * 5}px;
  }
  [dir='rtl']ul,
  [dir='rtl']ol,
  [dir='rtl']dl {
    padding-left: 0;
    padding-right: ${gridSize() * 5}px;
  }

  dd,
  dd + dt,
  li + li {
    margin-top: ${gridSize() / 2}px;
  }
  ul ul:not(:first-child),
  ol ul:not(:first-child),
  ul ol:not(:first-child),
  ol ol:not(:first-child) {
    margin-top: ${gridSize() / 2}px;
  }

  /* remove top margin for first element */
  p:first-child,
  ul:first-child,
  ol:first-child,
  dl:first-child,
  h1:first-child,
  h2:first-child,
  h3:first-child,
  h4:first-child,
  h5:first-child,
  h6:first-child,
  blockquote:first-child,
  pre:first-child,
  form:first-child,
  table:first-child {
    margin-top: 0;
  }

  /* Quotes */
  blockquote,
  q {
    color: inherit;
  }
  blockquote {
    border: none;
    padding-left: ${gridSize() * 5}px;
  }
  [dir='rtl'] blockquote {
    padding-left: 0;
    padding-right: ${gridSize() * 5}px;
  }

  blockquote::before,
  q::before {
    content: '\\201C';
  }

  blockquote::after,
  q::after {
    content: '\\201D';
  }

  blockquote::before {
    float: left;
    /* to keep the quotes left of any child elements like blockquote > p */
    margin-left: -1em;
    text-align: right;
    width: 1em;
  }
  [dir='rtl'] blockquote::before {
    float: right;
    margin-right: -1em;
    text-align: left;
  }

  blockquote > :last-child {
    display: inline-block; /* so the quotes added via pseudos follow it immediately. */
  }

  /* Other typographical elements */
  small {
    ${typography.h100()}
    font-weight: normal;
  }

  code,
  kbd {
    font-family: ${codeFontFamily};
  }

  var,
  address,
  dfn,
  cite {
    font-style: italic;
  }

  abbr {
    border-bottom: 1px ${token('color.border.neutral', '#ccc')} dotted;
    cursor: help;
  }
`;
