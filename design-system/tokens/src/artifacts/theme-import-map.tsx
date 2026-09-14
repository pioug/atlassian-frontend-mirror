/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file contains a dynamic import for each theme this package exports.
 * Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
 * This allows users to compose their themes and only use the tokens that are requested.
 * When a new theme is created, the import should automatically be added to the map
 *
 * @codegen <<SignedSource::3d041793de6aed48f20cb5e398199413>>
 * @codegenCommand yarn build tokens
 */

import { type ThemeIds, type ThemeOverrideIds } from '../theme-config';

const themeImportsMap: Record<ThemeIds | ThemeOverrideIds, () => Promise<{ default: string }>> = {
  'light': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light" */
      './themes/atlassian-light'
    ),
  'light-future': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light-future" */
      './themes/atlassian-light-future'
    ),
  'light-finesse': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light-finesse" */
      './themes/atlassian-light-finesse'
    ),
  'light-increased-contrast-finesse': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light-increased-contrast-finesse" */
      './themes/atlassian-light-increased-contrast-finesse'
    ),
  'light-increased-contrast': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light-increased-contrast" */
      './themes/atlassian-light-increased-contrast'
    ),
  'dark': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark" */
      './themes/atlassian-dark'
    ),
  'dark-future': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-future" */
      './themes/atlassian-dark-future'
    ),
  'dark-finesse': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-finesse" */
      './themes/atlassian-dark-finesse'
    ),
  'dark-increased-contrast-finesse': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-increased-contrast-finesse" */
      './themes/atlassian-dark-increased-contrast-finesse'
    ),
  'dark-increased-contrast': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-increased-contrast" */
      './themes/atlassian-dark-increased-contrast'
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
  'typography-finesse': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-typography-finesse" */
      './themes/atlassian-typography-finesse'
    ),
  'shape': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-shape" */
      './themes/atlassian-shape'
    ),
  'motion': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-motion" */
      './themes/atlassian-motion'
    ),
};

export { themeImportsMap as themeImportMap };
export default themeImportsMap;
  