import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { panelC1Stage0 as panelC1Factory } from '../../next-schema/generated/nodeTypes';
import { createPanelNodeSpecOptions } from './create-panel-node-spec-options';

export const extendedPanelC1WithLocalId = (allowCustomPanel: boolean): NodeSpec =>
	panelC1Factory(createPanelNodeSpecOptions(allowCustomPanel, true));
