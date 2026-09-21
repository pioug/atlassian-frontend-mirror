import { invalidateBlockControlsSurfaces } from '@atlaskit/editor-common/block-controls/surface-candidate-invalidation';

import type { BlockCollapsePlugin } from './blockCollapsePluginType';
import { invalidateHeadingSurface, toggleHeadingInTransaction } from './pm-plugins/commands';
import { createPlugin } from './pm-plugins/main';
import { blockCollapsePluginKey } from './pm-plugins/plugin-key';
import { getBlockCollapseSection } from './pm-plugins/section-model';
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
	api?.uiControlRegistry?.actions.register(getBlockCollapseButtonComponents({ api }));

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
				({ tr }) => {
					const section = getBlockCollapseSection(tr.doc, headingPos);
					invalidateHeadingSurface(tr, headingPos, section);
					return tr.setMeta(blockCollapsePluginKey, {
						headingPos,
						type: 'expand',
					});
				},
			expandHeadingsContainingRange:
				(from, to) =>
				({ tr }) => {
					const collapseState = api?.blockCollapse?.sharedState.currentState();
					const headingPositions = [...(collapseState?.collapsedHeadingPositions ?? [])].filter(
						(headingPos) => {
							const sectionEnd = collapseState?.collapsedSectionEnds.get(headingPos);
							const headingNode = tr.doc.nodeAt(headingPos);
							return (
								sectionEnd !== undefined &&
								headingNode !== null &&
								from >= headingPos + headingNode.nodeSize &&
								to <= sectionEnd
							);
						},
					);
					invalidateBlockControlsSurfaces(tr, {
						ranges: [{ from, to }],
						positions: headingPositions,
					});
					return tr.setMeta(blockCollapsePluginKey, {
						from,
						to,
						type: 'expandContainingRange',
					});
				},
			collapseHeadingsAtPositions:
				(positions) =>
				({ tr }) => {
					const ranges = positions.flatMap((position) => {
						const section = getBlockCollapseSection(tr.doc, position);
						return section ? [{ from: section.from, to: section.to }] : [];
					});
					invalidateBlockControlsSurfaces(tr, { positions, ranges });
					return tr.setMeta(blockCollapsePluginKey, {
						positions,
						type: 'collapsePositions',
					});
				},
		},
	};
};
