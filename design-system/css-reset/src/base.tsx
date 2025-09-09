import { colors, typography } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

import evaluateInner from './utils/evaluate-inner';

const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
const codeFontFamily = `ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace`;

/* TODO body line height should be 1.25rem */
export default evaluateInner`
  body,
  html {
    height: 100%;
    width: 100%;
  }

  body {
    background-color: ${token('elevation.surface', '#fff')};
    color: ${token('color.text', colors.N800)};
    font: ${token('font.body', `normal 400 14px/1.42857142857143 ${fontFamily}`)};
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
    margin: ${token('space.150', '12px')} 0 0 0;
  }

  /* Links */
  a {
    color: ${token('color.link', colors.B400)};
    text-decoration: none;
  }
  a:hover {
    color: ${token('color.link', colors.B300)};
    text-decoration: underline;
  }
  a:active {
    color: ${token('color.link.pressed', colors.B500)};
  }
  a:focus-visible {
    outline: ${token('border.width.focused', '2px')} solid ${token(
			'color.border.focused',
			colors.B200,
		)};
    outline-offset: ${token('space.025', '2px')};
  }
  @supports not selector(*:focus-visible) {
    a:focus {
      outline: ${token('border.width.focused', '2px')} solid ${token(
				'color.border.focused',
				colors.B100,
			)};
      outline-offset: ${token('space.025', '2px')};
    }
  }
  /* Headings */
  h1 {
    font: ${token(
			'font.heading.xlarge',
			`600 2.0714285714285716em/1.103448275862069 ${fontFamily}`,
		)};
    color: ${token('color.text')};
    margin-top: ${token('space.500')};
  }
  h2 {
    font: ${token(
			'font.heading.large',
			`500 1.7142857142857142em/1.1666666666666667 ${fontFamily}`,
		)};
    color: ${token('color.text')};
    margin-top: ${token('space.500')};
  }
  h3 {
    font: ${token('font.heading.medium', `500 1.4285714285714286em/1.2 ${fontFamily}`)};
    color: ${token('color.text')};
    margin-top: 28px;
  }
  h4 {
    font: ${token('font.heading.small', `600 1.1428571428571428em/1.25 ${fontFamily}`)};
    color: ${token('color.text')};
    margin-top: ${token('space.300')};
  }
  h5 {
    font: ${token('font.heading.xsmall', `600 1em/1.1428571428571428 ${fontFamily}`)};
    color: ${token('color.text')};
    margin-top: ${token('space.200')};
  }
  h6 {
    font: ${token(
			'font.heading.xxsmall',
			`600 0.8571428571428571em/1.3333333333333333 ${fontFamily}`,
		)};
    color: ${token('color.text')};
    margin-top: ${token('space.250')};
    text-transform: uppercase;
  }

  /* Lists */
  ul,
  ol,
  dl {
    padding-left: ${token('space.500', '40px')};
  }

  dd,
  dd + dt,
  li + li {
    margin-top: ${token('space.050', '4px')};
  }

  ul ul:not(:first-child),
	ul style:first-child ~ * + ul,
  ol ul:not(:first-child),
	ol style:first-child ~ * + ul,
  ul ol:not(:first-child),
	ul style:first-child ~ * + ol,
  ol ol:not(:first-child),
	ol style:first-child ~ * + ol {
    margin-top: ${token('space.050', '4px')};
  }

  /* remove top margin for first element */
  p:first-child,
  style:first-child + p,
  ul:first-child,
  style:first-child + ul,
  ol:first-child,
  style:first-child + ol,
  dl:first-child,
  style:first-child + dl,
  h1:first-child,
  style:first-child + h1,
  h2:first-child,
  style:first-child + h2,
  h3:first-child,
  style:first-child + h3,
  h4:first-child,
  style:first-child + h4,
  h5:first-child,
  style:first-child + h5,
  h6:first-child,
  style:first-child + h6,
  blockquote:first-child,
  style:first-child + blockquote,
  pre:first-child,
  style:first-child + pre,
  form:first-child,
  style:first-child + form,
  table:first-child,
  style:first-child + table {
    margin-top: 0;
  }

  /* Quotes */
  blockquote,
  q {
    color: inherit;
  }
  blockquote {
    border: none;
    padding-left: ${token('space.500', '40px')};
  }
  [dir='rtl'] blockquote {
    padding-left: 0;
    padding-right: ${token('space.500', '40px')};
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
    font: ${token('font.body.small', typography.fontFallback.body.small)};
  }

  code,
  kbd {
    font-family: ${token('font.family.code', `${codeFontFamily}`)};
  }

  var,
  address,
  dfn,
  cite {
    font-style: italic;
  }

  abbr {
    border-bottom: 1px ${token('color.border', '#ccc')} dotted;
    cursor: help;
  }

  @supports (color-scheme: dark) and (color-scheme: light) {
    [data-color-mode="light"] {
      color-scheme: light;
    }
    [data-color-mode="dark"] {
      color-scheme: dark;
    }
  }
`;
