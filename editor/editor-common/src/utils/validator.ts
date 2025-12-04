import type { CellAttributes } from '@atlaskit/adf-schema';
import { inlineNodes, isSafeUrl, PanelType, generateUuid as uuid } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Mark as PMMark, Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const ADFStages = {
	FINAL: 'final',
	STAGE_0: 'stage0',
} as const;

export type ADFStage = (typeof ADFStages)[keyof typeof ADFStages];

/*
 * An ADF Document JSON object. The document is the root node and documents are
 * composed of nodes. This type accepts an array of ADNode types as content.
 *
 * It is basically the same as the JSONNodeDoc interface from editor-json-transformer.
 *
 * Do not use this type for content nodes as they require additional attributes.
 *
 * Use ADNode instead for content nodes (any node other than the doc).
 */
export interface ADDoc {
	content: ADNode[];
	type: 'doc';
	version: 1;
}

/*
 * An ADF Node object. This type is used as content for the ADDoc interface.

 * It is basically the same as the JSONNode type from editor-json-transformer
 * but the types are a little more strict.
 *
 * It is a serialisable form of ADFEntity.
 *
 * Do not use this for ADF documents - they should use the ADDoc interface.
 */
export interface ADNode {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: any;
	content?: ADNode[];
	marks?: ADMark[];
	text?: string;
	type: string;
}

export interface ADMark {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: any;
	type: string;
}

export interface ADMarkSimple {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: any;
	type: {
		name: string;
	};
}

/*
 * It's important that this order follows the marks rank defined here:
 * https://product-fabric.atlassian.net/wiki/spaces/ETEMP/pages/11174043/Atlassian+Document+Format+-+Internal+documentation#Rank
 */
export const markOrder = [
	'fragment',
	'link',
	'em',
	'strong',
	'textColor',
	'backgroundColor',
	'strike',
	'subsup',
	'underline',
	'code',
	'confluenceInlineComment',
	'annotation',
	'dataConsumer',
];

export const isSubSupType = (type: string): type is 'sub' | 'sup' => {
	return type === 'sub' || type === 'sup';
};

/*
 * Sorts mark by the predefined order above
 */
export const getMarksByOrder = (marks: readonly PMMark[]) => {
	return [...marks].sort((a, b) => markOrder.indexOf(a.type.name) - markOrder.indexOf(b.type.name));
};

/*
 * Check if two marks are the same by comparing type and attrs
 */
export const isSameMark = (mark: PMMark | null, otherMark: PMMark | null) => {
	if (!mark || !otherMark) {
		return false;
	}

	return mark.eq(otherMark);
};

export const getValidDocument = (
	doc: ADDoc,
	schema: Schema = defaultSchema,
	adfStage: ADFStage = 'final',
): ADDoc | null => {
	const node = getValidNode(doc as ADNode, schema, adfStage);

	if (node.type === 'doc') {
		node.content = wrapInlineNodes(node.content);
		return node as ADDoc;
	}

	return null;
};

const wrapInlineNodes = (nodes: ADNode[] = []): ADNode[] => {
	return nodes.map((node) =>
		inlineNodes.has(node.type) ? { type: 'paragraph', content: [node] } : node,
	);
};

export const getValidContent = (
	content: ADNode[],
	schema: Schema = defaultSchema,
	adfStage: ADFStage = 'final',
): ADNode[] => {
	return content.map((node) => getValidNode(node, schema, adfStage));
};

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const TEXT_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const RELATIVE_LINK = /^\//;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ANCHOR_LINK = /^#/;

const flattenUnknownBlockTree = (
	node: ADNode,
	schema: Schema = defaultSchema,
	adfStage: ADFStage = 'final',
): ADNode[] => {
	const output: ADNode[] = [];
	let isPrevLeafNode = false;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	for (let i = 0; i < node.content!.length; i++) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const childNode = node.content![i];
		const isLeafNode = !(childNode.content && childNode.content.length);

		if (i > 0) {
			if (isPrevLeafNode) {
				output.push({ type: 'text', text: ' ' } as ADNode);
			} else {
				output.push({ type: 'hardBreak' } as ADNode);
			}
		}

		if (isLeafNode) {
			output.push(getValidNode(childNode, schema, adfStage));
		} else {
			output.push(...flattenUnknownBlockTree(childNode, schema, adfStage));
		}

		isPrevLeafNode = isLeafNode;
	}

	return output;
};

/**
 * Sanitize unknown node tree
 *
 * @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/11174043/Document+structure#Documentstructure-ImplementationdetailsforHCNGwebrenderer
 */
export const getValidUnknownNode = (node: ADNode): ADNode => {
	const { attrs = {}, content, text, type } = node;

	if (!content || !content.length) {
		const unknownInlineNode: ADNode = {
			type: 'text',
			text: text || attrs.text || `[${type}]`,
		};

		const { textUrl } = attrs;
		if (textUrl && isSafeUrl(textUrl)) {
			unknownInlineNode.marks = [
				{
					type: 'link',
					attrs: {
						href: textUrl,
					},
				} as ADMark,
			];
		}

		return unknownInlineNode;
	}

	/*
	 * Find leaf nodes and join them. If leaf nodes' parent node is the same node
	 * join with a blank space, otherwise they are children of different branches, i.e.
	 * we need to join them with a hardBreak node
	 */
	return {
		type: 'unknownBlock',
		content: flattenUnknownBlockTree(node),
	};
};

const getValidMarks = (
	marks: ADMark[] | undefined,
	adfStage: ADFStage = 'final',
): ADMark[] | undefined => {
	if (marks && marks.length > 0) {
		return marks.reduce((acc, mark) => {
			const validMark = getValidMark(mark, adfStage);
			if (validMark) {
				acc.push(validMark);
			}

			return acc;
		}, [] as ADMark[]);
	}
	return marks;
};

/*
 * This method will validate a Node according to the spec defined here
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/11174043/Document+structure#Documentstructure-Nodes
 *
 * This is also the place to handle backwards compatibility.
 *
 * If a node is not recognized or is missing required attributes, we should return 'unknown'
 *
 */
export const getValidNode = (
	originalNode: ADNode,
	schema: Schema = defaultSchema,
	adfStage: ADFStage = 'final',
): ADNode => {
	const { attrs, marks, text, type } = originalNode;
	let { content } = originalNode;

	const node: ADNode = {
		attrs,
		marks,
		text,
		type,
	};

	if (content) {
		node.content = content = getValidContent(content, schema, adfStage);
	}

	// If node type doesn't exist in schema, make it an unknown node
	if (!schema.nodes[type]) {
		return getValidUnknownNode(node);
	}

	if (type) {
		switch (type) {
			case 'doc': {
				const { version } = originalNode as ADDoc;
				if (version && content && content.length) {
					return {
						type,
						content,
					};
				}
				break;
			}
			case 'codeBlock': {
				if (content) {
					content = content.reduce((acc: ADNode[], val) => {
						if (val.type === 'text') {
							acc.push({ type: val.type, text: val.text });
						}
						return acc;
					}, []);
				}
				if (attrs && attrs.language) {
					return {
						type,
						attrs,
						content,
						marks,
					};
				}
				return {
					type,
					content,
					marks,
				};
			}
			case 'date': {
				if (attrs && attrs.timestamp) {
					return {
						type,
						attrs,
						...(fg('editor_inline_comments_on_inline_nodes') ? { marks } : {}),
					};
				}
				break;
			}
			case 'status': {
				if (attrs && attrs.text && attrs.color) {
					return {
						type,
						attrs,
						...(fg('editor_inline_comments_on_inline_nodes') ? { marks } : {}),
					};
				}
				break;
			}
			case 'emoji': {
				if (attrs && attrs.shortName) {
					return {
						type,
						attrs,
						...(fg('editor_inline_comments_on_inline_nodes') ? { marks } : {}),
					};
				}
				break;
			}
			case 'inlineExtension':
			case 'extension': {
				if (attrs && attrs.extensionType && attrs.extensionKey) {
					return {
						type,
						attrs,
					};
				}
				break;
			}
			case 'inlineCard': {
				if (
					attrs &&
					((attrs.datasource && !attrs.url) ||
						(attrs.url && isSafeUrl(attrs.url)) ||
						(attrs.data && attrs.data.url && isSafeUrl(attrs.data.url)))
				) {
					return {
						type,
						attrs,
						...(fg('editor_inline_comments_on_inline_nodes') ? { marks } : {}),
					};
				}
				break;
			}
			case 'blockCard': {
				if (
					attrs &&
					((attrs.datasource && !attrs.url) ||
						(attrs.url && isSafeUrl(attrs.url)) ||
						(attrs.data && attrs.data.url && isSafeUrl(attrs.data.url)))
				) {
					return {
						type,
						attrs,
					};
				}
				break;
			}
			case 'embedCard': {
				if (
					attrs &&
					((attrs.url && isSafeUrl(attrs.url)) ||
						(attrs.data && attrs.data.url && isSafeUrl(attrs.data.url))) &&
					attrs.layout
				) {
					return {
						type,
						attrs,
					};
				}
				break;
			}
			case 'bodiedExtension': {
				if (attrs && attrs.extensionType && attrs.extensionKey && content) {
					return {
						type,
						attrs,
						content,
					};
				}
				break;
			}
			case 'multiBodiedExtension': {
				if (attrs && attrs.extensionType && attrs.extensionKey && content) {
					return {
						type,
						attrs,
						content,
					};
				}
				break;
			}
			case 'extensionFrame': {
				if (content) {
					return {
						type,
						attrs,
						content,
					};
				}
				break;
			}
			case 'hardBreak': {
				return {
					type,
				};
			}
			case 'caption': {
				if (content) {
					return {
						type,
						content,
					};
				}
				break;
			}
			case 'mediaInline': {
				let mediaId = '';
				let mediaCollection = [];

				if (attrs) {
					const { id, collection } = attrs;
					mediaId = id;
					mediaCollection = collection;
				}

				if (mediaId && mediaCollection) {
					return {
						type,
						attrs,
						marks,
					};
				}
				break;
			}
			case 'media': {
				let mediaId = '';
				let mediaType = '';
				let mediaCollection = [];
				let mediaUrl = '';

				if (attrs) {
					const { id, collection, type, url } = attrs;
					mediaId = id;
					mediaType = type;
					mediaCollection = collection;
					mediaUrl = url;
				}

				if (mediaType === 'external' && !!mediaUrl) {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const mediaAttrs: any = {
						type: mediaType,
						url: mediaUrl,
						width: attrs.width,
						height: attrs.height,
					};

					if (attrs.alt) {
						mediaAttrs.alt = attrs.alt;
					}

					const getMarks = getValidMarks(marks, adfStage);
					return getMarks
						? {
								type,
								attrs: mediaAttrs,
								marks: getMarks,
							}
						: {
								type,
								attrs: mediaAttrs,
							};
				} else if (mediaId && mediaType) {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const mediaAttrs: any = {
						type: mediaType,
						id: mediaId,
						collection: mediaCollection,
					};

					if (attrs.width) {
						mediaAttrs.width = attrs.width;
					}

					if (attrs.height) {
						mediaAttrs.height = attrs.height;
					}

					if (attrs.alt) {
						mediaAttrs.alt = attrs.alt;
					}

					const getMarks = getValidMarks(marks, adfStage);

					return getMarks
						? {
								type,
								attrs: mediaAttrs,
								marks: getMarks,
							}
						: {
								type,
								attrs: mediaAttrs,
							};
				}
				break;
			}
			case 'mediaGroup': {
				if (Array.isArray(content) && !content.some((e) => e.type !== 'media')) {
					return {
						type,
						content,
					};
				}
				break;
			}
			case 'mediaSingle': {
				const containsJustMedia =
					Array.isArray(content) && content.length === 1 && content[0].type === 'media';
				const containsMediaAndCaption =
					Array.isArray(content) &&
					content.length === 2 &&
					content[0].type === 'media' &&
					content[1].type === 'caption';
				if (containsJustMedia || containsMediaAndCaption) {
					return {
						type,
						attrs,
						content,
						marks: getValidMarks(marks, adfStage),
					};
				}
				break;
			}
			case 'mention': {
				let mentionText = '';
				let mentionId;
				let mentionAccess;
				if (attrs) {
					const { text, displayName, id, accessLevel } = attrs;
					mentionText = text || displayName;
					mentionId = id;
					mentionAccess = accessLevel;
				}

				if (!mentionText) {
					mentionText = text || '@unknown';
				}

				if (mentionText && mentionId) {
					const mentionNode = {
						type,
						attrs: {
							id: mentionId,
							text: mentionText,
							accessLevel: '',
						},
						...(fg('editor_inline_comments_on_inline_nodes') ? { marks } : {}),
					};
					if (mentionAccess) {
						mentionNode.attrs.accessLevel = mentionAccess;
					}

					return mentionNode;
				}
				break;
			}
			case 'paragraph': {
				if (adfStage === 'stage0') {
					const paragraphNode: ADNode = { type, content: content || [] };
					if (attrs && attrs.localId) {
						paragraphNode.attrs = { localId: attrs.localId };
					}
					if (marks) {
						paragraphNode.marks = [...marks];
					}
					return paragraphNode;
				}
				return marks
					? {
							type,
							content: content || [],
							marks,
						}
					: { type, content: content || [] };
			}
			case 'rule': {
				return {
					type,
				};
			}
			case 'text': {
				const { marks } = node;
				if (text) {
					return marks ? { type, text, marks: getValidMarks(marks, adfStage) } : { type, text };
				}
				break;
			}
			case 'heading': {
				if (attrs) {
					const { level } = attrs;
					const between = (x: number, a: number, b: number) => x >= a && x <= b;
					if (level && between(level, 1, 6)) {
						if (adfStage === 'stage0') {
							const headingNode: ADNode = {
								type,
								content: content,
								attrs: { level },
							};
							if (attrs.localId) {
								headingNode.attrs.localId = attrs.localId;
							}
							if (marks) {
								headingNode.marks = [...marks];
							}
							return headingNode;
						}
						return marks
							? {
									type,
									content,
									marks,
									attrs: {
										level,
									},
								}
							: {
									type,
									content,
									attrs: {
										level,
									},
								};
					}
				}
				break;
			}
			case 'bulletList': {
				if (content) {
					return {
						type,
						content,
					};
				}
				break;
			}
			case 'orderedList': {
				if (content) {
					return {
						type,
						content,
						attrs: {
							order: attrs && attrs.order,
						},
					};
				}
				break;
			}
			case 'listItem': {
				if (content) {
					return {
						type,
						content: wrapInlineNodes(content),
					};
				}
				break;
			}
			case 'blockquote': {
				if (content) {
					return {
						type,
						content,
					};
				}
				break;
			}
			case 'panel': {
				if (attrs && content) {
					const { panelType } = attrs;
					if (Object.values(PanelType).includes(panelType)) {
						return {
							type,
							attrs,
							content,
						};
					}
				}
				break;
			}
			case 'layoutSection': {
				if (content) {
					return {
						type,
						marks,
						content,
					};
				}
				break;
			}
			case 'layoutColumn': {
				if (attrs && content) {
					if (attrs.width > 0 && attrs.width <= 100) {
						return {
							type,
							content,
							attrs,
						};
					}
				}
				break;
			}
			case 'decisionList': {
				return {
					type,
					content,
					attrs: {
						localId: (attrs && attrs.localId) || uuid(),
					},
				};
			}
			case 'decisionItem': {
				return {
					type,
					content,
					attrs: {
						localId: (attrs && attrs.localId) || uuid(),
						state: (attrs && attrs.state) || 'DECIDED',
					},
				};
			}
			case 'taskList': {
				return {
					type,
					content,
					attrs: {
						localId: (attrs && attrs.localId) || uuid(),
					},
				};
			}
			case 'taskItem': {
				return {
					type,
					content,
					attrs: {
						localId: (attrs && attrs.localId) || uuid(),
						state: (attrs && attrs.state) || 'TODO',
					},
				};
			}
			case 'blockTaskItem': {
				return {
					type,
					content,
					attrs: {
						localId: (attrs && attrs.localId) || uuid(),
						state: (attrs && attrs.state) || 'TODO',
					},
				};
			}
			case 'table': {
				if (
					Array.isArray(content) &&
					content.length > 0 &&
					!content.some((e) => e.type !== 'tableRow')
				) {
					if (adfStage === 'stage0') {
						return {
							type,
							content,
							attrs: {
								...attrs,
								localId: attrs?.localId || uuid(),
								width: attrs?.width || null,
							},
						};
					}
					return {
						type,
						content,
						attrs,
					};
				}
				break;
			}
			case 'tableRow': {
				if (
					Array.isArray(content) &&
					content.length > 0 &&
					!content.some((e) => e.type !== 'tableCell' && e.type !== 'tableHeader')
				) {
					return {
						type,
						content,
					};
				}
				break;
			}
			case 'tableCell':
			case 'tableHeader': {
				if (content) {
					const cellAttrs: CellAttributes = {};

					if (attrs) {
						if (attrs.colspan && attrs.colspan > 1) {
							cellAttrs.colspan = attrs.colspan;
						}

						if (attrs.rowspan && attrs.rowspan > 1) {
							cellAttrs.rowspan = attrs.rowspan;
						}

						if (attrs.background) {
							cellAttrs.background = attrs.background;
						}

						if (attrs.colwidth && Array.isArray(attrs.colwidth)) {
							cellAttrs.colwidth = attrs.colwidth;
						}
					}

					return {
						type,
						content: wrapInlineNodes(content),
						attrs: attrs ? cellAttrs : undefined,
					};
				}
				break;
			}
			case 'image': {
				if (attrs && attrs.src) {
					return {
						type,
						attrs,
					};
				}
				break;
			}
			case 'placeholder': {
				if (attrs && typeof attrs.text !== 'undefined') {
					return {
						type,
						attrs,
					};
				}
				break;
			}

			case 'expand':
			case 'nestedExpand': {
				return { type, attrs, content, marks };
			}
			case 'syncBlock': {
				if (attrs && attrs.resourceId && editorExperiment('platform_synced_block', true)) {
					return {
						type,
						attrs: {
							resourceId: attrs.resourceId,
							localId: attrs.localId || uuid(),
						},
						marks,
					};
				} else {
					return getValidUnknownNode(node);
				}
			}
			case 'bodiedSyncBlock': {
				if (
					attrs &&
					attrs.resourceId &&
					Array.isArray(content) &&
					content.length > 0 &&
					editorExperiment('platform_synced_block', true)
				) {
					return {
						type,
						attrs: {
							resourceId: attrs.resourceId,
							localId: attrs.localId || uuid(),
						},
						marks,
						content,
					};
				} else {
					return getValidUnknownNode(node);
				}
			}
		}
	}

	return getValidUnknownNode(node);
};

/*
 * This method will validate a Mark according to the spec defined here
 * https://developer.atlassian.com/platform/atlassian-document-format/concepts/document-structure/marks/overview/
 * This is also the place to handle backwards compatibility.
 *
 * If a node is not recognized or is missing required attributes, we should return null
 *
 */
export const getValidMark = (mark: ADMark, adfStage: ADFStage = 'final'): ADMark | null => {
	const { attrs, type } = mark;

	if (type) {
		switch (type) {
			case 'code': {
				return {
					type,
				};
			}
			case 'em': {
				return {
					type,
				};
			}
			case 'link': {
				if (attrs) {
					const { href, url, __confluenceMetadata } = attrs;
					let linkHref = href || url;
					if (
						linkHref &&
						linkHref.indexOf(':') === -1 &&
						!RELATIVE_LINK.test(linkHref) &&
						!ANCHOR_LINK.test(linkHref)
					) {
						linkHref = `http://${linkHref}`;
					}

					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const linkAttrs: any = {
						href: linkHref,
					};

					if (__confluenceMetadata) {
						linkAttrs.__confluenceMetadata = __confluenceMetadata;
					}

					if (linkHref && isSafeUrl(linkHref)) {
						return {
							type,
							attrs: linkAttrs,
						};
					}
				}
				break;
			}
			case 'strike': {
				return {
					type,
				};
			}
			case 'strong': {
				return {
					type,
				};
			}
			case 'subsup': {
				if (attrs && attrs['type']) {
					const subSupType = attrs['type'];
					if (isSubSupType(subSupType)) {
						return {
							type,
							attrs: {
								type: subSupType,
							},
						};
					}
				}
				break;
			}
			case 'textColor': {
				if (attrs && TEXT_COLOR_PATTERN.test(attrs.color)) {
					return {
						type,
						attrs,
					};
				}

				break;
			}
			case 'underline': {
				return {
					type,
				};
			}
			case 'annotation': {
				return {
					type,
					attrs,
				};
			}
			case 'border': {
				return {
					type,
					attrs,
				};
			}
			case 'backgroundColor': {
				if (attrs && TEXT_COLOR_PATTERN.test(attrs.color)) {
					return {
						type,
						attrs,
					};
				}

				break;
			}
		}
	}

	if (adfStage === 'stage0') {
		switch (type) {
			case 'confluenceInlineComment': {
				return {
					type,
					attrs,
				};
			}
			case 'dataConsumer': {
				return {
					type,
					attrs,
				};
			}
			case 'fragment': {
				return {
					type,
					attrs,
				};
			}
			case 'border': {
				return {
					type,
					attrs,
				};
			}
		}
	}

	return null;
};
