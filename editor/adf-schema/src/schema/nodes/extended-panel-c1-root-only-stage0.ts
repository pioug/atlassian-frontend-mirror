import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { extendedPanelC1WithLocalId } from './extended-panel-c1-with-local-id';

export const extendedPanelC1RootOnlyStage0 = (allowCustomPanel: boolean): NodeSpec => {
	const panelNodeSpec = extendedPanelC1WithLocalId(allowCustomPanel);

	return {
		...panelNodeSpec,
		marks: `breakout ${panelNodeSpec.marks}`,
	};
};
