import type {
	DocNode,
	TextDefinition,
	BlockContent,
	ParagraphDefinition,
} from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { DOMParser } from '@atlaskit/editor-prosemirror/model';

const domParser = DOMParser.fromSchema(defaultSchema);

type NestedContainer = {
	children: BlockContent[];
	parentType: BlockContent['type'];
};

export const getNestingRulesFromSchema = (): Record<string, string[]> => {
	const KEYWORDS = [
		'inline',
		'block',
		'text',
		'leaf',
		'group',
		'unsupportedBlock',
		'unsupportedInline',
	];
	const rules: Record<string, string[]> = {};

	for (const nodeType of Object.keys(defaultSchema.nodes)) {
		const contentStr = defaultSchema.nodes[nodeType]?.spec.content;
		if (!contentStr) {
			continue;
		}

		const allowedChildren = // eslint-disable-next-line require-unicode-regexp
			(String(contentStr).match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g) || []).filter(
				(match, index, arr) =>
					!KEYWORDS.includes(match) && defaultSchema.nodes[match] && arr.indexOf(match) === index,
			);

		if (allowedChildren.length > 0) {
			rules[nodeType] = allowedChildren;
		}
	}

	return rules;
};

const NESTING_RULES = getNestingRulesFromSchema();

const canContainChildren = (nodeType: string): boolean => !!NESTING_RULES[nodeType]?.length;

const isAllowedChild = (parent: string, child: string): boolean =>
	NESTING_RULES[parent]?.includes(child) ?? false;

const shouldApplyMark = (tag: string): boolean =>
	domParser.rules.some((rule) => 'mark' in rule && rule.tag === tag);

const isBlockElement = (tag: string): boolean =>
	domParser.rules.some((rule) => rule.tag === tag && rule.node);

const getMarkTypes = (tags: string[]): Array<{ attrs?: Record<string, unknown>; type: string }> => {
	const seen = new Set<string>();
	const marks: Array<{ attrs?: Record<string, unknown>; type: string }> = [];

	for (const tag of tags) {
		const markType = domParser.rules.find((rule) => rule.tag === tag)?.mark;
		if (markType && !seen.has(markType)) {
			marks.push({ type: markType });
			seen.add(markType);
		}
	}

	return marks;
};

const createParagraph = (content: TextDefinition[] = []): ParagraphDefinition => ({
	type: 'paragraph',
	content,
});

const getBlockType = (tag: string): BlockContent['type'] => {
	const rule = domParser.rules.find((r) => r.tag === tag);
	return rule && 'node' in rule && rule.node ? (rule.node as BlockContent['type']) : 'paragraph';
};

const createTextNode = (text: string, marks: string[]): TextDefinition => {
	const markTypes = getMarkTypes(marks);
	return {
		type: 'text',
		text,
		...(markTypes.length > 0 && { marks: markTypes }),
	};
};

const addText = (text: string, marks: string[], content: TextDefinition[]): void => {
	if (text) {
		content.push(createTextNode(text, marks));
	}
};

const handleBlockElement = (
	tag: string,
	innerContent: string,
	marks: string[],
	blocks: BlockContent[],
	currentParagraphContent: TextDefinition[],
	parseNode: (content: string, marks: string[], nestedContainer?: NestedContainer) => void,
	nestedContainer?: NestedContainer,
): void => {
	// Push any accumulated content as paragraph before block element
	if (currentParagraphContent.length > 0) {
		blocks.push(createParagraph([...currentParagraphContent]));
		currentParagraphContent.length = 0;
	}

	const blockType = getBlockType(tag);
	const newMarks = shouldApplyMark(tag) ? [...marks, tag] : marks;

	const parentNodeType = nestedContainer?.parentType;

	if (nestedContainer && parentNodeType && isAllowedChild(parentNodeType, blockType)) {
		const elementContent: BlockContent[] = [];
		const childNestedContainer = canContainChildren(blockType)
			? { parentType: blockType, children: elementContent }
			: nestedContainer;
		parseNode(innerContent, newMarks, childNestedContainer);
		if (currentParagraphContent.length > 0) {
			elementContent.push(createParagraph([...currentParagraphContent]));
			currentParagraphContent.length = 0;
		}
		nestedContainer.children.push({
			type: blockType,
			content: elementContent.length > 0 ? elementContent : [createParagraph()],
		} as BlockContent);
	} else if (canContainChildren(blockType)) {
		const children: BlockContent[] = [];
		parseNode(innerContent, newMarks, { parentType: blockType, children });
		blocks.push({
			type: blockType,
			content: children.length > 0 ? children : [createParagraph()],
		} as BlockContent);
	} else {
		// Regular block elements
		parseNode(innerContent, newMarks, nestedContainer);

		// Push content generated from block parsing
		if (currentParagraphContent.length > 0) {
			if (blockType === 'paragraph' || blockType === 'codeBlock') {
				blocks.push({
					type: blockType,
					content: [...currentParagraphContent],
				});
			}
			currentParagraphContent.length = 0;
		}
	}
};

const handleInlineElement = (
	tag: string,
	innerContent: string,
	marks: string[],
	parseNode: (content: string, marks: string[], nestedContainer?: NestedContainer) => void,
	nestedContainer?: NestedContainer,
): void => {
	const newMarks = shouldApplyMark(tag) ? [...marks, tag] : marks;
	parseNode(innerContent, newMarks, nestedContainer);
};

/**
 * Simple SSR-compatible parser that recognises text wrapped in HTML elements
 * and extracts their content as ADF.
 *
 * Designed specifically for parsing i18n strings for ADF which specifically need to be
 * HTML strings for translation.
 *
 * Supports nested structures automatically derived from the ADF schema:
 * - Lists: ul/ol → li (listItem)
 * - Tables: table → tr (tableRow) → td/th (tableCell/tableHeader)
 * - Paragraphs, code blocks, and text marks
 * - Any other nested structures defined in the schema
 *
 * @param html - The HTML string to parse
 * @returns ADF DocNode containing the parsed content
 */
export const parseHTMLTextContent = (html: string): DocNode => {
	const blocks: Array<BlockContent> = [];
	const currentParagraphContent: TextDefinition[] = [];

	// Simple regex-based parser that works in both SSR and browser
	const parseNode = (
		content: string,
		marks: string[] = [],
		nestedContainer?: NestedContainer,
	): void => {
		// Match HTML tags and text content
		// eslint-disable-next-line require-unicode-regexp
		const tagRegex = /<\s*(\w+)([^>]*)>([\s\S]*?)<\s*\/\s*\1\s*>|([^<]+)/g;
		let match = tagRegex.exec(content);

		while (match !== null) {
			if (match[4]) {
				addText(match[4], marks, currentParagraphContent);
			} else {
				// HTML element
				const tag = match[1].toLowerCase();
				const innerContent = match[3];

				if (isBlockElement(tag)) {
					handleBlockElement(
						tag,
						innerContent,
						marks,
						blocks,
						currentParagraphContent,
						parseNode,
						nestedContainer,
					);
				} else {
					handleInlineElement(tag, innerContent, marks, parseNode, nestedContainer);
				}
			}
			match = tagRegex.exec(content);
		}
	};

	parseNode(html);

	// Push any remaining content
	if (currentParagraphContent.length > 0) {
		blocks.push(createParagraph(currentParagraphContent));
	}

	return {
		type: 'doc',
		version: 1,
		content: blocks.length > 0 ? blocks : [createParagraph()],
	};
};
