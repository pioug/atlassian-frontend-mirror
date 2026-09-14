/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// Entry file in package.json

/**
 * @deprecated Use `import { tableEditing } from '@atlaskit/editor-tables/pm-plugins/table-editing'` instead.
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Compatibility shim for deprecated API
export { tableEditing } from './pm-plugins/table-editing';
/**
 * @deprecated Use `import { tableEditingKey } from '@atlaskit/editor-tables/pm-plugins/plugin-key'` instead.
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Compatibility shim for deprecated API
export { tableEditingKey } from './pm-plugins/plugin-key';
