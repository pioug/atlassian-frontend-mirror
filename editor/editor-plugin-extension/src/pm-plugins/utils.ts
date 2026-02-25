import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type ExtensionType,
} from '@atlaskit/editor-common/analytics';
import { copyToClipboard } from '@atlaskit/editor-common/clipboard';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { closestElement, findNodePosByLocalIds } from '@atlaskit/editor-common/utils';
import { JSONTransformer, type JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { Mark, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { DomAtPos, NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import {
	findDomRefAtPos,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { isResolvingMentionProvider } from '@atlaskit/mention/resource';

export const getSelectedExtension = (state: EditorState, searchParent: boolean = false) => {
	const { inlineExtension, extension, bodiedExtension, multiBodiedExtension } = state.schema.nodes;
	const nodeTypes = [extension, bodiedExtension, inlineExtension, multiBodiedExtension];
	return (
		findSelectedNodeOfType(nodeTypes)(state.selection) ||
		(searchParent && findParentNodeOfType(nodeTypes)(state.selection)) ||
		undefined
	);
};

export const findExtensionWithLocalId = (state: EditorState, localId?: string) => {
	const selectedExtension = getSelectedExtension(state, true);

	if (!localId) {
		return selectedExtension;
	}

	if (selectedExtension && selectedExtension.node.attrs.localId === localId) {
		return selectedExtension;
	}

	const { inlineExtension, extension, bodiedExtension, multiBodiedExtension } = state.schema.nodes;
	const nodeTypes = [extension, bodiedExtension, inlineExtension, multiBodiedExtension];
	let matched: NodeWithPos | undefined;

	state.doc.descendants((node, pos) => {
		if (nodeTypes.includes(node.type) && node.attrs.localId === localId) {
			matched = { node, pos };
		}
	});

	return matched;
};

export const getSelectedDomElement = (
	schema: Schema,
	domAtPos: DomAtPos,
	selectedExtensionNode: NodeWithPos,
) => {
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const selectedExtensionDomNode = findDomRefAtPos(
		selectedExtensionNode.pos,
		domAtPos,
	) as HTMLElement;

	const isContentExtension = selectedExtensionNode.node.type !== schema.nodes.bodiedExtension;

	return (
		// Content extension can be nested in bodied-extension, the following check is necessary for that case
		(isContentExtension // Search down
			? selectedExtensionDomNode.querySelector<HTMLElement>('.extension-container') // Try searching up and then down
			: closestElement(selectedExtensionDomNode, '.extension-container') ||
				selectedExtensionDomNode.querySelector<HTMLElement>('.extension-container')) ||
		selectedExtensionDomNode
	);
};

export const getDataConsumerMark = (newNode: PMNode): Mark | undefined =>
	newNode.marks?.find((mark: Mark) => mark.type.name === 'dataConsumer');

export const getNodeTypesReferenced = (ids: string[], state: EditorState): string[] => {
	return findNodePosByLocalIds(state, ids, { includeDocNode: true }).map(
		({ node }) => node.type.name,
	);
};

export const findNodePosWithLocalId = (
	state: EditorState,
	localId: string,
): NodeWithPos | undefined => {
	const nodes = findNodePosByLocalIds(state, [localId]);
	return nodes.length >= 1 ? nodes[0] : undefined;
};

export interface Position {
	bottom?: number;
	left?: number;
	right?: number;
	top?: number;
}

/**
 * Converts a ProseMirror node to its text representation.
 * Handles text nodes with marks (links) and inline nodes (status, mention, emoji).
 * Returns the content for this node, with a trailing separator for text blocks.
 */
const convertNodeToText = (
	node: PMNode,
	mentionSet: Set<string>,
	parent: PMNode | null,
	locale?: string,
): string => {
	if (node.isInline) {
		const schema = node.type.schema;
		let finalText = '';

		if (node.isText) {
			finalText = node.text || '';
			if (node.marks.length > 0) {
				for (const mark of node.marks) {
					// if it's link, include the href in the text
					if (mark.type === schema.marks.link) {
						const href = mark.attrs.href;
						const text = node.text || '';
						// If the text differs from the href, include both
						if (text && text !== href) {
							finalText = `${text} ${href}`;
						} else {
							finalText = href;
						}
					}
				}
			}
		} else {
			switch (node.type) {
				case schema.nodes.status:
					finalText = node.attrs.text || '';
					break;
				case schema.nodes.mention:
					mentionSet.add(node.attrs.id);
					finalText = `@${node.attrs.id}`;
					break;
				case schema.nodes.emoji:
					finalText = node.attrs.shortName || '';
					break;
				case schema.nodes.date:
					const timestamp = new Date(Number(node.attrs.timestamp));
					finalText = !isNaN(timestamp.getTime())
						? timestamp.toLocaleDateString(locale ?? 'en-US')
						: String(node.attrs.timestamp);
					break;
				default:
					finalText = node.textContent;
					break;
			}
		}

		if (parent && parent.isTextblock && node === parent.lastChild && parent.childCount > 0) {
			finalText += '\n\n';
		}

		return finalText;
	}

	return '';
};

/**
 * Resolves mention IDs to their display names and replaces them in the text.
 * Returns the text with resolved mentions, or the original text if the provider is unavailable.
 */
const resolveMentionsInText = async (
	text: string,
	mentionSet: Set<string>,
	api?: PublicPluginAPI<[MentionsPlugin]>,
): Promise<string> => {
	const mentionProvider = api?.mention?.sharedState?.currentState()?.mentionProvider;
	if (!mentionProvider || !isResolvingMentionProvider(mentionProvider)) {
		return text;
	}

	let resolvedText = text;
	for (const id of mentionSet) {
		const mention = await mentionProvider.resolveMentionName(id);
		resolvedText = resolvedText.replace(`@${id}`, `@${mention.name}` || '@…');
	}

	return resolvedText;
};

/**
 * copying ADF from the unsupported content extension as text to clipboard
 */
export const copyUnsupportedContentToClipboard = async ({
	locale,
	schema,
	unsupportedContent,
	api,
}: {
	api?: PublicPluginAPI<[MentionsPlugin]>;
	locale?: string;
	schema: Schema;
	unsupportedContent?: JSONDocNode;
}): Promise<void> => {
	try {
		if (!unsupportedContent) {
			throw new Error('No nested content found');
		}

		if (unsupportedContent.type !== 'doc') {
			unsupportedContent = {
				version: 1,
				type: 'doc',
				content: [unsupportedContent],
			};
		}

		const transformer = new JSONTransformer(schema);
		const pmNode = transformer.parse(unsupportedContent);
		let text = '';
		const mentionSet = new Set<string>();

		pmNode.nodesBetween(0, pmNode.content.size, (node, _pos, parent) => {
			text += convertNodeToText(node, mentionSet, parent, locale);
		});

		// Trim leading/trailing whitespace from the collected text
		text = text.trim();

		text = await resolveMentionsInText(text, mentionSet, api);

		copyToClipboard(text);
	} catch (error) {
		throw error instanceof Error ? error : new Error('Failed to copy content');
	}
};

export const onCopyFailed = ({
	error,
	extensionApi,
	state,
}: {
	error: Error;
	extensionApi?: PublicPluginAPI<[AnalyticsPlugin]>;
	state: EditorState;
}) => {
	const nodeWithPos = getSelectedExtension(state, true);
	if (!nodeWithPos) {
		return;
	}

	const { node } = nodeWithPos;
	const { extensionType, extensionKey } = node.attrs;

	extensionApi?.analytics?.actions.fireAnalyticsEvent({
		eventType: EVENT_TYPE.OPERATIONAL,
		action: ACTION.COPY_FAILED,
		actionSubject: ACTION_SUBJECT.EXTENSION,
		actionSubjectId: node.type.name as ExtensionType,
		attributes: {
			extensionKey,
			extensionType,
			errorMessage: error.message,
			errorStack: error.stack,
		},
	});
};
