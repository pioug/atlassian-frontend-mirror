import type { DocNode } from '@atlaskit/adf-schema';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

type SerializedAdfNode = {
	attrs?: Record<string, unknown>;
	content?: SerializedAdfNode[];
	text?: string;
	type: string;
};

const PASS_THROUGH_PROMPT_INLINE_NODE_TYPES = new Set([
	'hardBreak',
	'inlineCard',
	'mention',
	'text',
]);

const isAgentMention = (node: SerializedAdfNode): boolean =>
	node.type === 'mention' && node.attrs?.userType === 'APP';

const isAllowedAgentMention = (
	node: SerializedAdfNode,
	agentMentionLocalId?: string | null,
): boolean => !isAgentMention(node) || node.attrs?.localId === agentMentionLocalId;

const getStatusText = (node: SerializedAdfNode): string | null => {
	const text = node.attrs?.text;

	return typeof text === 'string' && text ? text : null;
};

const getDateText = (node: SerializedAdfNode): string | null => {
	const timestamp = node.attrs?.timestamp;

	if (typeof timestamp !== 'string' || !timestamp) {
		return null;
	}

	const date = new Date(Number(timestamp));

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date.toISOString().slice(0, 10);
};

const toPromptInlineNode = (
	node: SerializedAdfNode,
	agentMentionLocalId?: string | null,
): SerializedAdfNode | null => {
	if (!isAllowedAgentMention(node, agentMentionLocalId)) {
		return null;
	}

	if (PASS_THROUGH_PROMPT_INLINE_NODE_TYPES.has(node.type)) {
		return node;
	}

	if (node.type === 'status') {
		const text = getStatusText(node);

		return text ? { type: 'text', text } : null;
	}

	if (node.type === 'date') {
		const text = getDateText(node);

		return text ? { type: 'text', text } : null;
	}

	return null;
};

/**
 * Returns the direct parent content of an inserted agent mention as prompt ADF.
 *
 * The chat input supports only a subset of editor inline ADF, so this keeps prompt content
 * intentionally narrow:
 * - `text`, `inlineCard`, and `hardBreak` pass through unchanged.
 * - people mentions pass through unchanged.
 * - only the invoked agent mention is kept, identified by `localId`; other agent mentions are dropped.
 * - `status` becomes its label text.
 * - `date` becomes ISO date text.
 * - everything else is dropped.
 *
 * This only reads direct parent content. It does not recursively pull content out of nested or
 * unsupported nodes.
 */
export const getAgentMentionParentContext = (
	parentNode: PMNode,
	agentMentionLocalId?: string | null,
): DocNode => {
	const parentAdf = parentNode.toJSON() as SerializedAdfNode;
	const supportedInlineContent = (parentAdf.content ?? []).flatMap((node) => {
		const promptNode = toPromptInlineNode(node, agentMentionLocalId);

		return promptNode ? [promptNode] : [];
	});

	return {
		type: 'doc',
		version: 1,
		content: [
			{
				type: 'paragraph',
				content: supportedInlineContent,
			},
		],
	} as DocNode;
};
