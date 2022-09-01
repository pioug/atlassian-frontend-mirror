/**
 * Adapted straight from react-mui, with a small change.
 * @see https://www.unpkg.com/browse/react-gui@0.2.1/src/modules/getAccessibilityElementWithSideEffect.js
 */
const roleToElementType = {
  article: 'article',
  banner: 'header',
  blockquote: 'blockquote',
  button: 'button',
  code: 'code',
  complementary: 'aside',
  contentinfo: 'footer',
  deletion: 'del',
  emphasis: 'em',
  figure: 'figure',
  insertion: 'ins',
  form: 'form',
  link: 'a',
  list: 'ul',
  listitem: 'li',
  main: 'main',
  navigation: 'nav',
  region: 'section',
  strong: 'strong',
  presentation: 'div',
  group: 'fieldset',
} as const;

type RoleMap = typeof roleToElementType;

export type Role = keyof RoleMap;
export type SupportedElements = RoleMap[Role] & keyof JSX.IntrinsicElements;

export default roleToElementType;
