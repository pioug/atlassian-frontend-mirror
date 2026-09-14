import { toJSON as codeBlockToJSON } from '@atlaskit/adf-schema/code-block';
import { toJSON as dataConsumerToJSON } from '@atlaskit/adf-schema/data-consumer';
import { toJSON as expandToJSON } from '@atlaskit/adf-schema/expand';
import { toJSON as fragmentToJSON } from '@atlaskit/adf-schema/fragment';
import { toJSON as mediaSingleToJSON } from '@atlaskit/adf-schema/to-json';
import { toJSON as mediaToJSON } from '@atlaskit/adf-schema/to-json-2';
import { toJSON as mentionToJSON } from '@atlaskit/adf-schema/mention';
import { tableToJSON, toJSONTableCell, toJSONTableHeader } from '@atlaskit/adf-schema/tableNodes';
import { linkToJSON } from '@atlaskit/adf-schema';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { markOverrideRuleFor } from './markOverrideRules';
import type { JSONNode } from './types';

const isType = (type: string) => (node: PMNode | PMMark) => node.type.name === type;

// Create a Set of node types that should have empty attrs removed
const NODES_WITH_EMPTY_ATTRS_REMOVAL = new Set([
	'paragraph',
	'layoutSection',
	'blockquote',
	'nestedExpand',
	'bulletList',
	'listItem',
	'orderedList',
	'rule',
	'caption',
	'tableRow',
	'media',
	'mediaSingle',
	'mediaInline',
]);

const isCodeBlock = isType('codeBlock');

const isMediaNode = isType('media');

const isMediaInline = isType('mediaInline');

const isMediaSingleNode = isType('mediaSingle');

const isMentionNode = isType('mention');

const isParagraph = isType('paragraph');

const isHeading = isType('heading');

const isTable = isType('table');

const isTableCell = isType('tableCell');

const isTableHeader = isType('tableHeader');

const isLinkMark = isType('link');

const isUnsupportedMark = isType('unsupportedMark');

const isUnsupportedNodeAttributeMark = isType('unsupportedNodeAttribute');

const isExpand = isType('expand');

const isNestedExpand = isType('nestedExpand');

const isUnsupportedNode = (node: PMNode) =>
	isType('unsupportedBlock')(node) || isType('unsupportedInline')(node);

const isDataConsumer = isType('dataConsumer');

const isFragmentMark = isType('fragment');

const isHardBreak = isType('hardBreak');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterNull = (subject: any) => {
	let output = { ...subject };
	// eslint-disable-next-line guard-for-in
	for (const key in output) {
		const current = output[key];
		if (current === null) {
			const { [key]: unusedKey, ...filteredObj } = output;
			output = filteredObj;
		} else if (typeof current === 'object' && !Array.isArray(current)) {
			output[key] = filterNull(current);
		}
	}

	return output;
};

const canOverrideMark = (mark: PMMark, existingMarks: readonly PMMark[]): boolean => {
	if (existingMarks.some((e) => mark.attrs.originalValue.type === e.type.name)) {
		return markOverrideRuleFor(mark.attrs.originalValue.type).canOverrideUnsupportedMark();
	}

	return false;
};

const getUnwrappedNodeAttributes = (node: PMNode, mark: PMMark, obj: JSONNode): object | null => {
	const nodeAttributes = node.type.spec.attrs;
	const attributes = { ...mark.attrs.unsupported, ...obj.attrs };
	// Ignored via go/ees005
	// eslint-disable-next-line no-var
	for (var key in obj.attrs) {
		if (obj.attrs.hasOwnProperty(key)) {
			const attribute = nodeAttributes ? nodeAttributes[key] : null;
			if (attribute) {
				if (attribute.default === node.attrs[key] && mark.attrs.unsupported[key]) {
					return { ...attributes, [key]: mark.attrs.unsupported[key] };
				}
			}
		}
	}
	return attributes;
};

/**
 * Transforms a Prosemirror node into a JSON representation. Compared with
 * native Prosemirror JSON, this representation ensures we have valid ADF attrs.
 *
 * @param node The Prosemirror node to transform.
 * @param mentionMap A map of mention IDs to their display names.
 * @returns The JSON representation of the node.
 */
export const toJSON = (node: PMNode, mentionMap?: Record<string, string | undefined>): JSONNode => {
	const obj: JSONNode = { type: node.type.name };
	if (isUnsupportedNode(node)) {
		return node.attrs.originalValue;
	} else if (isMediaNode(node)) {
		obj.attrs = mediaToJSON(node).attrs;
	} else if (isMediaSingleNode(node)) {
		obj.attrs = mediaSingleToJSON(node).attrs;
	} else if (isMediaInline(node)) {
		obj.attrs = mediaToJSON(node).attrs;
	} else if (isMentionNode(node)) {
		obj.attrs = mentionToJSON(node).attrs;
	} else if (isCodeBlock(node)) {
		obj.attrs = codeBlockToJSON(node).attrs;
	} else if (isTable(node)) {
		obj.attrs = tableToJSON(node).attrs;
	} else if (isTableCell(node)) {
		obj.attrs = toJSONTableCell(node).attrs;
	} else if (isTableHeader(node)) {
		obj.attrs = toJSONTableHeader(node).attrs;
	} else if (isExpand(node) || isNestedExpand(node)) {
		obj.attrs = expandToJSON(node).attrs;
	} else if (node.attrs && Object.keys(node.attrs).length) {
		obj.attrs = node.attrs;
	}
	if (obj.attrs) {
		obj.attrs = filterNull(obj.attrs);
	}

	if (isMentionNode(node) && mentionMap) {
		// If the mentionMap exists and has a name defined then we should use it and prepend @ to the begining of it.
		const name = !!mentionMap?.[node.attrs.id] ? `@${mentionMap[node.attrs.id]}` : '';
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const text = (obj.attrs as any)?.text ?? '';

		obj.attrs = {
			...obj.attrs,
			// If an explicit text value is set on the mention then that should take priority over the mentionMap value.
			text: !!text ? text : name,
		};
	}

	if (
		(NODES_WITH_EMPTY_ATTRS_REMOVAL.has(node.type.name) &&
			obj.attrs &&
			!Object.keys(obj.attrs).length) ||
		isHardBreak(node)
	) {
		delete obj.attrs;
	}

	if (node.isText) {
		obj.text = node.textContent;
	} else {
		node.content.forEach((child: PMNode) => {
			obj.content = obj.content || [];
			obj.content.push(toJSON(child, mentionMap));
		});
	}

	if (isParagraph(node) || isHeading(node)) {
		obj.content = obj.content || [];
	}

	if (node.marks.length) {
		// Run any custom mark serialisers
		const parsedMarks = node.marks
			.map((mark) => {
				if (isUnsupportedMark(mark)) {
					return canOverrideMark(mark, node.marks) ? null : mark.attrs.originalValue;
				} else if (isUnsupportedNodeAttributeMark(mark)) {
					return null;
				} else if (isLinkMark(mark)) {
					return linkToJSON(mark);
				} else if (isDataConsumer(mark)) {
					const serialised = dataConsumerToJSON(mark);
					return !serialised.attrs.sources || serialised.attrs.sources?.length === 0
						? null
						: serialised;
				} else if (isFragmentMark(mark)) {
					const fragmentMark = fragmentToJSON(mark);
					if (!fragmentMark.attrs.localId) {
						return null;
					}

					return fragmentMark;
				} else {
					return mark.toJSON();
				}
			})
			.filter((maybeMark) => maybeMark !== null);

		// Only set if we have a non-empty array, otherwise explicitly undefine it (as we only run this path if `node.marks.length`)
		obj.marks = parsedMarks?.length > 0 ? parsedMarks : undefined;

		const nodeAttributeMark = node.marks.find(isUnsupportedNodeAttributeMark);
		if (nodeAttributeMark && nodeAttributeMark.attrs.type.nodeType === obj.type) {
			obj.attrs = {
				...getUnwrappedNodeAttributes(node, nodeAttributeMark, obj),
			};
		}
	}
	return obj;
};
