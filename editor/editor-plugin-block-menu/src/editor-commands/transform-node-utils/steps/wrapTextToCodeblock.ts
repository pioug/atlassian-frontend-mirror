import type { TransformStep } from '../types';
import { createTextContent } from '../utils';

/**
 * Transforms a paragraph (or heading) into a codeBlock by extracting its text content.
 * This step handles the conversion of inline content (including marks) to plain text,
 * which is required because codeBlocks can only contain plain text nodes.
 *
 * Example: paragraph with bold/italic/status → codeBlock with plain text
 */
export const wrapTextToCodeblockStep: TransformStep = (nodes, context) => {
	const { schema } = context;

	return nodes.map((node) => {
		const codeBlockNode = schema.nodes.codeBlock.createAndFill(
			{},
			schema.text(createTextContent(node)),
		);

		return codeBlockNode ?? node;
	});
};
