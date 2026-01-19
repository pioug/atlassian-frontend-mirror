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
	isTopLevelNode?: boolean;
	layout?: string;
}

export const shouldExtensionBreakout = ({
	layout,
	isTopLevelNode = true,
	editorAppearance,
}: ShouldExtensionBreakoutArgs) => {
	if (!layout || !breakoutLayouts.has(layout)) {
		return false;
	}

	if (!isTopLevelNode) {
		return false;
	}

	return shouldRespectBreakoutForAppearance(editorAppearance);
};
