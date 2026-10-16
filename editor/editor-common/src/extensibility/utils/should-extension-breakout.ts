import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { EditorAppearance } from '../../types';

const breakoutLayouts = new Set(['full-width', 'wide']);

const shouldRespectBreakoutForAppearance = (appearance?: EditorAppearance) => {
	if (!appearance) {
		return true;
	}

	if (appearance === 'full-width') {
		return false;
	}

	if (appearance === 'max') {
		return false;
	}

	return true;
};

interface ShouldExtensionBreakoutArgs {
	editorAppearance?: EditorAppearance;
	hasBreakoutMark?: boolean;
	isTopLevelNode?: boolean;
	layout?: string;
}

export const shouldExtensionBreakout = ({
	layout,
	isTopLevelNode = true,
	editorAppearance,
	hasBreakoutMark = false,
}: ShouldExtensionBreakoutArgs): boolean => {
	// the breakout mark wrapper owns the width, so the legacy layout must not size the node too
	if (hasBreakoutMark && isExperimentEnabled('platform_editor_lovability_resize_extensions')) {
		return false;
	}

	if (!layout || !breakoutLayouts.has(layout)) {
		return false;
	}

	if (!isTopLevelNode) {
		return false;
	}

	return shouldRespectBreakoutForAppearance(editorAppearance);
};
