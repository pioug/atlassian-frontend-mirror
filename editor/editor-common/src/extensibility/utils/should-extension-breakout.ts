import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

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
	hasBreakoutWidth?: boolean;
	isTopLevelNode?: boolean;
	layout?: string;
}

export const shouldExtensionBreakout = ({
	layout,
	isTopLevelNode = true,
	editorAppearance,
	hasBreakoutMark = false,
	hasBreakoutWidth = false,
}: ShouldExtensionBreakoutArgs): boolean => {
	// the breakout mark wrapper owns the width, so the legacy layout must not size the node too
	if (
		fg('platform_editor_lovability_resize_exts_gracefully') &&
		isExperimentEnabled('platform_editor_lovability_resize_exts_patch_1') &&
		hasBreakoutWidth
	) {
		return false;
	}

	// once platform_editor_lovability_resize_exts_patch_1 is rolled out, we can remove this redundant check.
	// because the previous check should have returned false already for extensions with breakout widths.
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
