import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { panelC1Stage0 as panelC1Factory } from '../../next-schema/generated/nodeTypes';
import { createPanelNodeSpecOptions } from './create-panel-node-spec-options';

/**
 * @name extended_panel_c1
 *
 * Depth-level-1 variant of panel. Allows all standard panel content
 * plus table nodes. Derives its parseDOM/toDOM behaviour from the same
 * createPanelNodeSpecOptions helper as extendedPanel so that allowCustomPanel
 * and generateLocalId propagate identically.
 */
export const extendedPanelC1 = (allowCustomPanel: boolean): NodeSpec =>
	panelC1Factory(createPanelNodeSpecOptions(allowCustomPanel));
