import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Schema, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	safeInsert as pmSafeInsert,
} from '@atlaskit/editor-prosemirror/utils';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { setSelectionAfterTransform } from './selection';
import { createDefaultLayoutSection } from './transforms/layout-transforms';
import { transformNodeToTargetType } from './transforms/transformNodeToTargetType';
import type { FormatNodeAnalyticsAttrs, FormatNodeTargetType } from './transforms/types';
import { isListNodeType, getConversionType } from './transforms/utils';

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
 * Handles formatting when an empty list is selected
 * Converting an empty list to a target node, will remove the list and replace with an empty target node
 */
export const formatNodeSelectEmptyList = (
	tr: Transaction,
	targetType: FormatNodeTargetType,
	listNode: { node: PMNode; pos: number },
	schema: Schema,
) => {
	const { nodes } = schema;
	let headingLevel = 1;
	let finalTargetType: string = targetType;

	if (targetType.startsWith('heading')) {
		const levelString = targetType.slice(-1);
		const level = parseInt(levelString, 10);
		if (!isNaN(level) && level >= 1 && level <= 6) {
			headingLevel = level;
			finalTargetType = 'heading';
		}
	}

	let replaceNode: PMNode | null = null;

	if (finalTargetType === 'layoutSection') {
		const emptyPara = nodes.paragraph.createAndFill();
		if (emptyPara) {
			replaceNode = createDefaultLayoutSection(schema, emptyPara);
		}
	} else if (finalTargetType === 'heading') {
		replaceNode = nodes.heading.createAndFill({ level: headingLevel });
	} else {
		replaceNode = nodes[finalTargetType].createAndFill();
	}

	if (replaceNode) {
		tr.replaceWith(listNode.pos, listNode.pos + listNode.node.nodeSize, replaceNode);
		tr.setSelection(new TextSelection(tr.doc.resolve(listNode.pos)));
	}

	return tr;
};

/**
 * Formats the current node or selection to the specified target type
 * @param api - The editor API injection that provides access to analytics and other plugin actions
 * @param targetType - The target node type to convert to
 * @param analyticsAttrs - Attributes required for formatNode analytics like: inputMethod and triggeredFrom
 */
export const formatNode =
	(api?: ExtractInjectionAPI<BlockMenuPlugin>) =>
	(targetType: FormatNodeTargetType, analyticsAttrs?: FormatNodeAnalyticsAttrs): EditorCommand => {
		return ({ tr }) => {
			const { selection } = tr;
			const schema = tr.doc.type.schema;
			const { nodes } = schema;

			// Find the node to format from the current selection
			let nodeToFormat;
			let nodePos: number = selection.from;

			// when selection is empty, we insert a empty target node
			if (selection.empty) {
				const listNodes: { node: PMNode; pos: number }[] = [];
				// need to find if there is any list node in the current selection
				// As when select a empty list, selection is empty, but we want to convert the list instead of inserting a target node
				// findSelectedNodeOfType does not work when selection is empty, so we use nodesBetween
				tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
					if (isListNodeType(node.type)) {
						listNodes.push({ node, pos });
					}
				});
				//	get the first list node as when click on drag handle if there are list node
				//  can only select one list at a time, so we just need to find the first one
				if (listNodes.length > 0) {
					const firstChild = listNodes[0];
					const newTr = formatNodeSelectEmptyList(tr, targetType, firstChild, schema);
					if (newTr) {
						const sourceTypeName = firstChild.node.type.name;
						api?.analytics?.actions?.attachAnalyticsEvent({
							action: ACTION.CONVERTED,
							actionSubject: ACTION_SUBJECT.ELEMENT,
							eventType: EVENT_TYPE.TRACK,
							attributes: {
								from: sourceTypeName,
								to: targetType,
								eventCategory: getConversionType(sourceTypeName, targetType),
								triggeredFrom: analyticsAttrs?.triggeredFrom || INPUT_METHOD.MOUSE,
								inputMethod: analyticsAttrs?.inputMethod || INPUT_METHOD.BLOCK_MENU,
								conversionSource: 'emptyList',
							},
						})(newTr);
					}
					return newTr;
				} else {
					const newTr = formatNodeWhenSelectionEmpty(tr, targetType, nodePos, schema);

					const allowedNodes = [
						nodes.blockquote,
						nodes.panel,
						nodes.codeBlock,
						nodes.layoutSection,
						nodes.expand,
					];

					let sourceTypeName = 'paragraph';
					let conversionSource;
					const containerNode = findParentNodeOfType(allowedNodes)(selection);
					const paragraphOrHeading = findParentNodeOfType([nodes.heading, nodes.paragraph])(
						selection,
					);
					if (containerNode) {
						// At the moment this branch is executed for converstions from an empty blockquote
						sourceTypeName = containerNode.node.type.name;
						conversionSource = undefined; // could be 'emptyNode' or something else
					} else if (paragraphOrHeading) {
						sourceTypeName = paragraphOrHeading.node.type.name;
						if (sourceTypeName === 'heading') {
							sourceTypeName = `heading${paragraphOrHeading.node.attrs.level}`;
						}
						conversionSource = 'emptyLine';
					}

					if (newTr) {
						api?.analytics?.actions?.attachAnalyticsEvent({
							action: ACTION.CONVERTED,
							actionSubject: ACTION_SUBJECT.ELEMENT,
							eventType: EVENT_TYPE.TRACK,
							attributes: {
								from: sourceTypeName,
								to: targetType,
								eventCategory: getConversionType(sourceTypeName, targetType),
								triggeredFrom: analyticsAttrs?.triggeredFrom || INPUT_METHOD.MOUSE,
								inputMethod: analyticsAttrs?.inputMethod || INPUT_METHOD.BLOCK_MENU,
								conversionSource,
							},
						})(newTr);
					}

					return newTr;
				}
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
							eventCategory: getConversionType(sourceTypeName, targetType),
							triggeredFrom: analyticsAttrs?.triggeredFrom || INPUT_METHOD.MOUSE,
							inputMethod: analyticsAttrs?.inputMethod || INPUT_METHOD.BLOCK_MENU,
						},
					})(newTr);
				}

				return newTr ? setSelectionAfterTransform(newTr, nodePos, targetType) : newTr;
			} catch (error) {
				logException(error as Error, { location: 'editor-plugin-block-menu' });

				// Fire error analytics event
				let sourceTypeName = nodeToFormat.type.name;
				if (sourceTypeName === 'heading' && nodeToFormat.attrs?.level) {
					sourceTypeName = `heading${nodeToFormat.attrs.level}`;
				}

				api?.analytics?.actions?.fireAnalyticsEvent({
					action: ACTION.ERRORED,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					actionSubjectId: ACTION_SUBJECT_ID.TRANSFORM,
					eventType: EVENT_TYPE.OPERATIONAL,
					attributes: {
						error: (error as Error).message,
						errorStack: (error as Error).stack,
						docSize: tr.doc.nodeSize,
						from: sourceTypeName,
						to: targetType,
						position: tr.selection.from,
						selection: tr.selection.toJSON(),
						inputMethod: analyticsAttrs?.inputMethod || INPUT_METHOD.BLOCK_MENU,
						triggeredFrom: analyticsAttrs?.triggeredFrom || INPUT_METHOD.MOUSE,
					},
				});
				return null;
			}
		};
	};
