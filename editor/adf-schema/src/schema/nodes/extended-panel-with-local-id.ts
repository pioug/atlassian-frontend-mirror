import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { panel as panelFactory } from '../../next-schema/generated/nodeTypes';
import { createPanelNodeSpecOptions } from './create-panel-node-spec-options';

export const extendedPanelWithLocalId = (allowCustomPanel: boolean): NodeSpec =>
	panelFactory(createPanelNodeSpecOptions(allowCustomPanel, true));
