export { getChangedNodes } from '@atlaskit/editor-common/utils';
export { validateNodes } from './utils/nodes';
export { toJSON } from './utils';
export { default as Extension } from './plugins/extension/ui/Extension';
export { default as ExtensionNodeWrapper } from './plugins/extension/ui/Extension/ExtensionNodeWrapper';
export { ExtensionNode } from './plugins/extension/nodeviews/extension';

import { pluginKey as tablePluginKeyInner } from '@atlaskit/editor-plugin-table/plugin-key';

/**
 * @deprecated [ED-14688] - used during the table viz project and not used anymore
 * will be removed in a future version of `@atlaskit/editor-core`
 */
const tablePluginKey = tablePluginKeyInner;

export { tablePluginKey };

export const EmitterEvents = { TABLE_DELETED: 'TABLE_DELETED' };
