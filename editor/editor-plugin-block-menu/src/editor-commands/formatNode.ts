import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	safeInsert as pmSafeInsert,
} from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { setSelectionAfterTransform } from './selection';
import { createDefaultLayoutSection } from './transforms/layout-transforms';
import { transformNodeToTargetType } from './transforms/transformNodeToTargetType';
import type { FormatNodeTargetType } from './transforms/types';

/**
 * Handles formatting when selection is empty by inserting a new target node
 */
const formatNodeWhenSelectionEmpty = (
	tr: Transaction,
	targetType: FormatNodeTargetType,
	nodePos: number,
	schema: Schema,
) => {
	const { nodes } = schema;
	const { paragraph } = nodes;
	// if not using the ' ' here, the safeInsert from editor-common will fail to insert the heading
	// and the pmSafeInsert introduce an issue that after inserting heading, and click on the handle, selection will go to top of the doc
	// as an workaround, use the spaceTextNode here
	const spaceTextNode = schema.text(' ');
	let targetNode;

	if (targetType.startsWith('heading')) {
		const levelString = targetType.slice(-1);
		const level = parseInt(levelString, 10);
		if (isNaN(level) || level < 1 || level > 6) {
			return null;
		}
		targetNode = nodes.heading.createAndFill({ level }, spaceTextNode);
	} else if (targetType === 'paragraph') {
		targetNode = nodes.paragraph.createAndFill({}, spaceTextNode);
	} else if (targetType === 'layoutSection') {
		const contentAsParagraph = paragraph.createAndFill({}, spaceTextNode);
		if (contentAsParagraph) {
			targetNode = createDefaultLayoutSection(schema, contentAsParagraph);
		}
	} else {
		const targetNodeType = nodes[targetType];
		targetNode = targetNodeType.createAndFill();
	}

	if (!targetNode) {
		return tr;
	}
	tr = pmSafeInsert(targetNode, nodePos)(tr) ?? tr;
	return tr;
};

/**
 * Formats the current node or selection to the specified target type
 * @param api - The editor API injection that provides access to analytics and other plugin actions
 * @param targetType - The target node type to convert to
 */
export const formatNode =
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
	(targetType: FormatNodeTargetType): EditorCommand => {
		return ({ tr }) => {
			const { selection } = tr;
			const schema = tr.doc.type.schema;
			const { nodes } = schema;

			// Find the node to format from the current selection
			let nodeToFormat;
			let nodePos: number = selection.from;

			// when selection is empty, we insert a empty target node
			if (
				selection.empty &&
				expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true)
			) {
				return formatNodeWhenSelectionEmpty(tr, targetType, nodePos, schema);
			}

			// Try to find the current node from selection
			const selectedNode = findSelectedNodeOfType([
				nodes.paragraph,
				nodes.heading,
				nodes.blockquote,
				nodes.panel,
				nodes.expand,
				nodes.codeBlock,
				nodes.bulletList,
				nodes.orderedList,
				nodes.taskList,
				nodes.layoutSection,
			])(selection);

			if (selectedNode) {
				nodeToFormat = selectedNode.node;
				nodePos = selectedNode.pos;
			} else {
				// Try to find parent node (including list parents)
				const parentNode = findParentNodeOfType([
					nodes.blockquote,
					nodes.panel,
					nodes.expand,
					nodes.codeBlock,
					nodes.listItem,
					nodes.taskItem,
					nodes.layoutSection,
				])(selection);

				if (parentNode) {
					nodeToFormat = parentNode.node;
					nodePos = parentNode.pos;

					const paragraphOrHeadingNode = findParentNodeOfType([nodes.paragraph, nodes.heading])(
						selection,
					);
					// Special case: if we found a listItem, check if we need the parent list instead
					if (parentNode.node.type === nodes.listItem || parentNode.node.type === nodes.taskItem) {
						const listParent = findParentNodeOfType([
							nodes.bulletList,
							nodes.orderedList,
							nodes.taskList,
						])(selection);

						if (listParent) {
							// For list transformations, we want the list parent, not the listItem
							nodeToFormat = listParent.node;
							nodePos = listParent.pos;
						}
					} else if (parentNode.node.type !== nodes.blockquote && paragraphOrHeadingNode) {
						nodeToFormat = paragraphOrHeadingNode.node;
						nodePos = paragraphOrHeadingNode.pos;
					}
				}
			}

			if (!nodeToFormat) {
				nodeToFormat = selection.$from.node();
				nodePos = selection.$from.pos;
			}

			try {
				const newTr = transformNodeToTargetType(tr, nodeToFormat, nodePos, targetType);

				let sourceTypeName = nodeToFormat.type.name;
				if (sourceTypeName === 'heading' && nodeToFormat.attrs?.level) {
					sourceTypeName = `heading${nodeToFormat.attrs.level}`;
				}

				if (newTr && sourceTypeName !== targetType) {
					api?.analytics?.actions?.attachAnalyticsEvent({
						action: ACTION.CONVERTED,
						actionSubject: ACTION_SUBJECT.ELEMENT,
						eventType: EVENT_TYPE.TRACK,
						attributes: {
							from: sourceTypeName,
							to: targetType,
							inputMethod: INPUT_METHOD.BLOCK_MENU,
						},
					})(newTr);
				}

				if (newTr && fg('platform_editor_block_menu_selection_fix')) {
					return setSelectionAfterTransform(newTr, nodePos, targetType);
				}
				return newTr;
			} catch {
				return null;
			}
		};
	};
