import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { extendedPanelWithLocalId } from './extended-panel-with-local-id';

/**
 * @name extended_panel_root_only
 */
export const extendedPanelRootOnlyStage0 = (allowCustomPanel: boolean): NodeSpec => {
	const panelNodeSpec = extendedPanelWithLocalId(allowCustomPanel);

	return {
		...panelNodeSpec,
		marks: `breakout ${panelNodeSpec.marks}`,
	};
};
