import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { panel as panelFactory } from '../../next-schema/generated/nodeTypes';
import { createPanelNodeSpecOptions } from './create-panel-node-spec-options';

/**
 * @name extended_panel
 *
 * it allows more content to be nested as compared to panel node.
 * Specifically, it allows Media, action, code-block, rule and decision nodes in
 * addition to content allowed inside panel
 */
export const extendedPanel = (allowCustomPanel: boolean): NodeSpec =>
	panelFactory(createPanelNodeSpecOptions(allowCustomPanel));
