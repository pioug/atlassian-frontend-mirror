export { getChangedNodes } from './utils/document';
export { validateNodes } from './utils/nodes';
export { toJSON } from './utils';
export { default as Extension } from './plugins/extension/ui/Extension';
export { default as ExtensionNodeWrapper } from './plugins/extension/ui/Extension/ExtensionNodeWrapper';
export { ExtensionNode } from './plugins/extension/nodeviews/extension';
export { pluginKey as tablePluginKey } from '@atlaskit/editor-plugin-table/plugin-key';
export const EmitterEvents = { TABLE_DELETED: 'TABLE_DELETED' };
