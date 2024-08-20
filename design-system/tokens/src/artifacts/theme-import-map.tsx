/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file contains a dynamic import for each theme this package exports.
 * Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
 * This allows users to compose their themes and only use the tokens that are requested.
 * When a new theme is created, the import should automatically be added to the map
 *
 * @codegen <<SignedSource::8352f41e09dfe9d45ead708661744456>>
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
  'dark-increased-contrast': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-increased-contrast" */
      './themes/atlassian-dark-increased-contrast'
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
  'typography-adg3': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-typography-adg3" */
      './themes/atlassian-typography-adg3'
    ),
  'shape': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-shape" */
      './themes/atlassian-shape'
    ),
  'typography-modernized': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-typography-modernized" */
      './themes/atlassian-typography-modernized'
    ),
  'typography-refreshed': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-typography-refreshed" */
      './themes/atlassian-typography-refreshed'
    ),
  'light-brand-refresh': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-light-brand-refresh" */
      './themes/atlassian-light-brand-refresh'
    ),
  'dark-brand-refresh': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_atlassian-dark-brand-refresh" */
      './themes/atlassian-dark-brand-refresh'
    ),
};

export default themeImportsMap;
  