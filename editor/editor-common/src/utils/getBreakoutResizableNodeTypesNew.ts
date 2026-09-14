import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

export const getBreakoutResizableNodeTypesNew = (schema: Schema): Set<NodeType> => {
	const {
		expand,
		codeBlock,
		layoutSection,
		syncBlock,
		bodiedSyncBlock,
		rule,
		panel,
		panel_c1,
		extension,
		bodiedExtension,
		multiBodiedExtension,
	} = schema.nodes;

	const breakoutResizableNodeTypes: NodeType[] = [
		expand,
		codeBlock,
		layoutSection,
		syncBlock,
		bodiedSyncBlock,
	];

	if (isExperimentEnabled('platform_editor_lovability_resize_dividers_panels')) {
		breakoutResizableNodeTypes.push(rule, panel, panel_c1);
	}

	if (isExperimentEnabled('platform_editor_lovability_resize_extensions')) {
		breakoutResizableNodeTypes.push(extension, bodiedExtension, multiBodiedExtension);
	}

	return new Set(breakoutResizableNodeTypes);
};
