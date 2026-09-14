import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { breakoutResizableNodes } from './breakoutResizableNodes';

const extensionNodes = ['extension', 'bodiedExtension', 'multiBodiedExtension'];

export const getBreakoutResizableNodes = (): string[] => {
	let breakoutResizableNodesList = breakoutResizableNodes;

	if (isExperimentEnabled('platform_editor_lovability_resize_dividers_panels')) {
		breakoutResizableNodesList = [...breakoutResizableNodesList, 'rule', 'panel', 'panel_c1'];
	}

	if (isExperimentEnabled('platform_editor_lovability_resize_extensions')) {
		breakoutResizableNodesList = [...breakoutResizableNodesList, ...extensionNodes];
	}

	return breakoutResizableNodesList;
};
