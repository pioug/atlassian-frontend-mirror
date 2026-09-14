import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { BlockCollapsePlugin } from './blockCollapsePluginType';
import { toggleHeadingInTransaction } from './pm-plugins/commands';
import { createPlugin } from './pm-plugins/main';
import { blockCollapsePluginKey } from './pm-plugins/plugin-key';
import { getBlockCollapseButtonComponents } from './ui/block-collapse-button-registration';

/**
 * Owns collapse behavior for sections that begin with a top-level heading. A section includes
 * content up to the next top-level heading of the same or a higher level:
 *
 *     H1 Section            <--- toggle remains visible
 *       +-- paragraph       \
 *       +-- H2 subsection    +-- hidden while H1 is collapsed
 *       +-- paragraph       /
 *     H1 Next section       <--- boundary; remains visible
 *
 * Button/command -> transaction metadata -> collapsed-position Set -> hidden node decorations.
 * Positions are mapped through document edits, and the button reacts through shared plugin state.
 *
 * Before collapsing, a selection inside the section is moved back into its heading. ArrowDown from
 * the end of a collapsed heading jumps to the first visible position after the section; ArrowUp
 * from that next visible block returns to the collapsed heading. This prevents keyboard navigation
 * from entering nodes hidden by the collapse decorations.
 */
export const blockCollapsePlugin: BlockCollapsePlugin = ({ api }) => {
	const collapseButtonEnabled =
		isExperimentEnabled('platform_editor_block_control_migration') &&
		isExperimentEnabled('platform_editor_collapsible_headings');

	if (collapseButtonEnabled) {
		api?.uiControlRegistry?.actions.register(getBlockCollapseButtonComponents({ api }));
	}

	return {
		name: 'blockCollapse',
		pmPlugins() {
			return [
				{
					name: 'blockCollapsePlugin',
					plugin: createPlugin,
				},
			];
		},
		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}

			const pluginState = blockCollapsePluginKey.getState(editorState);
			return pluginState
				? {
						collapsedHeadingPositions: pluginState.collapsedHeadingPositions,
						collapsedSectionEnds: pluginState.collapsedSectionEnds,
					}
				: undefined;
		},
		commands: {
			toggleHeading:
				(headingPos) =>
				({ tr }) =>
					toggleHeadingInTransaction(tr, headingPos),
			expandHeading:
				(headingPos) =>
				({ tr }) =>
					tr.setMeta(blockCollapsePluginKey, {
						headingPos,
						type: 'expand',
					}),
			expandHeadingsContainingRange:
				(from, to) =>
				({ tr }) =>
					tr.setMeta(blockCollapsePluginKey, {
						from,
						to,
						type: 'expandContainingRange',
					}),
			collapseHeadingsAtPositions:
				(positions) =>
				({ tr }) =>
					tr.setMeta(blockCollapsePluginKey, {
						positions,
						type: 'collapsePositions',
					}),
		},
	};
};
