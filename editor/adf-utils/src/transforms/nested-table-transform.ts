export const NESTED_TABLE_EXTENSION_TYPE = 'com.atlassian.confluence.migration',
	NESTED_TABLE_EXTENSION_KEY = 'nested-table';

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isNestedTableExtension } from './is-nested-table-extension';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { transformNestedTablesIncomingDocument } from './transform-nested-tables-incoming-document';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { transformNestedTableNodeOutgoingDocument } from './transform-nested-table-node-outgoing-document';
