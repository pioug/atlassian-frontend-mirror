import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import { removeDisallowedMarks } from '../marks';
import type { TransformStep, NodeTypeName } from '../types';
import { NODE_CATEGORY_BY_TYPE } from '../types';
import { convertTextNodeToParagraph, isTextNode } from '../utils';

/**
 * Handles the edge case where transforming from a container to another container results in
 * all content breaking out (no valid children for the target). In this case, creates an empty
 * container to ensure the target container type is created.
 *
 * We can determine if there were no valid children by checking if no container was created
 * (`!hasCreatedContainer`) and there are nodes in the result (`result.length > 0`), which
 * means all content broke out rather than being wrapped.
 *
 * @param result - The current result nodes after processing
 * @param hasCreatedContainer - Whether a container was already created during processing
 * @param fromNode - The original source node (before unwrapping)
 * @param targetNodeType - The target container type
 * @param targetNodeTypeName - The target container type name
 * @param schema - The schema
 * @returns The result nodes with an empty container prepended if needed, or the original result
 */
const handleEmptyContainerEdgeCase = (
	result: PMNode[],
	hasCreatedContainer: boolean,
	fromNode: PMNode,
	targetNodeType: NodeType,
	targetNodeTypeName: NodeTypeName,
	schema: Schema,
): PMNode[] => {
	const isFromContainer = NODE_CATEGORY_BY_TYPE[fromNode.type.name as NodeTypeName] === 'container';
	const isTargetContainer = NODE_CATEGORY_BY_TYPE[targetNodeTypeName] === 'container';
	// If no container was created but we have nodes in result, all content broke out
	// (meaning there were no valid children that could be wrapped)
	const allContentBrokeOut = !hasCreatedContainer && result.length > 0;

	const shouldCreateEmptyTarget = isFromContainer && isTargetContainer && allContentBrokeOut;
	if (shouldCreateEmptyTarget) {
		const emptyParagraph = schema.nodes.paragraph.create();
		const emptyContainer = targetNodeType.create({}, emptyParagraph);
		return [emptyContainer, ...result];
	}
	return result;
};

/**
 * A wrap step that handles mixed content according to the Compatibility Matrix:
 * - Wraps consecutive compatible nodes into the target container
 * - Same-type containers break out as separate containers (preserved as-is)
 * - NestedExpands break out as regular expands (converted since nestedExpand can't exist outside expand)
 * - Container structures that can't be nested in target break out (not flattened)
 * - Text/list nodes that can't be wrapped are converted to paragraphs and merged into the container
 * - Atomic nodes (tables, media, macros) break out
 *
 * Special handling for layouts:
 * - Layout sections break out as separate layouts (preserved as-is, not wrapped)
 * - Other nodes (including headings, paragraphs, lists) are wrapped into layout columns within a layout section
 * - Layouts always require layoutColumns as children (never paragraphs directly)
 * - Layout columns can contain most block content including headings, paragraphs, lists, etc.
 *
 * Edge case handling:
 * - For regular containers: If all content breaks out (container → container transform with no
 *   valid children), an empty container with a paragraph is created to ensure the target type exists
 * - For layouts: Edge case handling is skipped because layouts require columns, not direct paragraphs.
 *   If all content breaks out, only the broken-out nodes are returned (no empty layout created)
 *
 * What can be wrapped depends on the target container's schema:
 * - expand → panel: tables break out, nestedExpands convert to expands and break out
 * - expand → blockquote: tables/media break out, nestedExpands convert to expands and break out, headings converted to paragraphs
 * - expand → expand: tables/media stay inside (expands can contain them)
 * - multi → layoutSection: layout sections break out, headings/paragraphs/lists wrapped into layout columns
 *
 * Example: expand(p('a'), table(), p('b')) → panel: [panel(p('a')), table(), panel(p('b'))]
 * Example: expand(p('a'), panel(p('x')), p('b')) → panel: [panel(p('a')), panel(p('x')), panel(p('b'))]
 * Example: expand(p('a'), nestedExpand({title: 'inner'})(p('x')), p('b')) → panel: [panel(p('a')), expand({title: 'inner'})(p('x')), panel(p('b'))]
 * Example: expand(nestedExpand()(p())) → panel: [panel(), expand()(p())] (empty panel when all content breaks out)
 * Example: [p('a'), layoutSection(...), p('b')] → layoutSection: [layoutSection(layoutColumn(p('a'))), layoutSection(...), layoutSection(layoutColumn(p('b')))]
 * Example: [h1('heading'), p('para')] → layoutSection: [layoutSection(layoutColumn(h1('heading'), p('para')))] (headings stay as headings in layouts)
 */
export const wrapMixedContentStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, fromNode } = context;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType) {
		return nodes;
	}

	const isLayout = targetNodeTypeName === 'layoutSection';
	const { layoutSection, layoutColumn } = schema.nodes;

	const result: PMNode[] = [];
	let currentContainerContent: PMNode[] = [];
	let hasCreatedContainer = false;

	const flushCurrentContainer = () => {
		if (currentContainerContent.length === 0) {
			return;
		}

		if (isLayout) {
			// For layouts, create layoutSection with two layoutColumns
			const columnOne = layoutColumn.createAndFill(
				{},
				removeDisallowedMarks(currentContainerContent, layoutColumn),
			);
			const columnTwo = layoutColumn.createAndFill();

			if (!columnOne || !columnTwo) {
				currentContainerContent = [];
				return;
			}

			const layout = layoutSection.createAndFill({}, [columnOne, columnTwo]);
			if (layout) {
				result.push(layout);
				hasCreatedContainer = true;
			}
			currentContainerContent = [];
			return;
		}

		// For regular containers, create directly
		const containerNode = targetNodeType.createAndFill({}, currentContainerContent);
		if (containerNode) {
			result.push(containerNode);
			hasCreatedContainer = true;
		}
		currentContainerContent = [];
	};

	const processNode = (node: PMNode) => {
		const validationType = isLayout ? layoutColumn : targetNodeType;

		const canWrapNode = validationType.validContent(
			Fragment.from(removeDisallowedMarks([node], validationType)),
		);

		// Node can be wrapped - add to current container content
		if (canWrapNode) {
			// remove marks from node as nested nodes don't usually support block marks
			currentContainerContent.push(...removeDisallowedMarks([node], validationType));
			return;
		}

		// Text node (heading, paragraph) that can't be wrapped - convert to paragraph
		// Example: heading can't go in blockquote, so convert to paragraph with same content
		if (isTextNode(node)) {
			const paragraph = convertTextNodeToParagraph(node, schema);
			if (paragraph) {
				currentContainerContent.push(paragraph);
			}
			return;
		}

		// All other nodes that cannot be wrapped in the target node - break out
		// Examples: same-type containers, tables in panels, layoutSections in layouts
		flushCurrentContainer();
		result.push(node);
	};

	nodes.forEach(processNode);

	// Flush any remaining content into a container
	flushCurrentContainer();

	// Skip edge case handling for layouts since layouts always have columns
	if (isLayout) {
		return result.length > 0 ? result : nodes;
	}

	const finalResult = handleEmptyContainerEdgeCase(
		result,
		hasCreatedContainer,
		fromNode,
		targetNodeType,
		targetNodeTypeName,
		schema,
	);
	return finalResult.length > 0 ? finalResult : nodes;
};
