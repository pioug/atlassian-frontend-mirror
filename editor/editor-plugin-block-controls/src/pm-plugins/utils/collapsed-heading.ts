import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';

/** Document range containing a heading and all content in its section. */
export type CollapsedHeadingRange = {
	from: number;
	to: number;
};

/** Returns the full section range when the heading at this position is collapsed. */
export const getCollapsedHeadingRange = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	headingPos: number,
): CollapsedHeadingRange | undefined => {
	const sectionEnd = api?.blockCollapse?.sharedState
		.currentState()
		?.collapsedSectionEnds.get(headingPos);

	return sectionEnd === undefined ? undefined : { from: headingPos, to: sectionEnd };
};

/** Returns whether the heading at this position has a collapsed section. */
export const isCollapsedHeading = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	headingPos: number,
): boolean =>
	api?.blockCollapse?.sharedState.currentState()?.collapsedSectionEnds.has(headingPos) ?? false;

/** Selects a collapsed section for drag or block-menu operations, optionally expanding it. */
export const prepareCollapsedHeadingSelection = ({
	api,
	expand,
	headingPos,
	tr,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	expand: boolean;
	headingPos: number;
	tr: Transaction;
}): boolean => {
	const range = getCollapsedHeadingRange(api, headingPos);
	if (!range) {
		return false;
	}

	if (expand) {
		api?.blockCollapse?.commands.expandHeading(headingPos)({ tr });
	}
	api?.blockControls?.commands.setMultiSelectPositions(range.from, range.to)({ tr });
	return true;
};

/** Preserves collapse for root moves and expands headings moved into nested containers. */
export const updateCollapsedHeadingAfterMove = ({
	api,
	destinationPos,
	isNested,
	tr,
	wasCollapsed,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	destinationPos: number;
	isNested: boolean;
	tr: Transaction;
	wasCollapsed: boolean;
}): void => {
	if (!wasCollapsed) {
		return;
	}

	if (isNested) {
		api?.blockCollapse?.commands.expandHeading(destinationPos)({ tr });
		return;
	}

	api?.blockCollapse?.commands.collapseHeadingsAtPositions([destinationPos])({ tr });
};
