/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file contains a dynamic import for each theme this package exports.
 * Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
 * This allows users to compose their themes and only use the tokens that are requested.
 * When a new theme is created, the import should automatically be added to the map
 *
 * @codegen <<SignedSource::ca8d4c1cc14d5ffdeec544d1087312a4>>
 * @codegenCommand yarn build tokens
 */

import { ThemeIds, ThemeOverrideIds } from '../theme-config';

const themeImportsMap: Record<ThemeIds | ThemeOverrideIds, () => Promise<{ default: string }>> = {
  'light': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light" */
      './themes/atlassian-light'
    ),
  'dark': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark" */
      './themes/atlassian-dark'
    ),
  'legacy-light': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-legacy-light" */
      './themes/atlassian-legacy-light'
    ),
  'legacy-dark': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-legacy-dark" */
      './themes/atlassian-legacy-dark'
    ),
  'spacing': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-spacing" */
      './themes/atlassian-spacing'
    ),
  'typography': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-typography" */
      './themes/atlassian-typography'
    ),
  'shape': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-shape" */
      './themes/atlassian-shape'
    ),
  'dark-iteration': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-iteration" */
      './themes/atlassian-dark-iteration'
    ),
  'light-new-input-border': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light-new-input-border" */
      './themes/atlassian-light-new-input-border'
    ),
  'dark-new-input-border': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-new-input-border" */
      './themes/atlassian-dark-new-input-border'
    ),
};

export default themeImportsMap;
  