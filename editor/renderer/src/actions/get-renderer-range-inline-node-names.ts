import { getRangeInlineNodeNames } from '@atlaskit/editor-common/utils';
import type RendererActions from './index';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export function getRendererRangeInlineNodeNames({
	actions,
	pos,
}: {
	actions: RendererActions;
	/**
	 * documentPosition is caclulated by `actions.getPositionFromRange`
	 * where `false` means that the selection is not able to be calculated.
	 */
	pos?: { from: number; to: number } | false;
}) {
	if (!getBooleanFF('platform.editor.allow-inline-comments-for-inline-nodes-round-2_ctuxz')) {
		return undefined;
	}

	const { doc } = actions;
	if (!pos || !doc) {
		return undefined;
	}

	const inlineNodeNames = getRangeInlineNodeNames({ doc, pos });

	return inlineNodeNames;
}
