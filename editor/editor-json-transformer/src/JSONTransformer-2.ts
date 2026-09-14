import isEqual from 'lodash/isEqual';

import { defaultSchema, getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import type { SchemaStage } from './SchemaStage';
import { sanitizeNode } from './sanitize/sanitize-node';
import type { SanitizeNodeOptions } from './sanitize/sanitize-node';
import { toJSON } from './toJSON';
import type { JSONDocNode, JSONNode } from './types';

interface Transformer<T> {
	encode: (node: PMNode) => T;
	parse: (content: T) => PMNode;
}

const createDocFromContent = (content: JSONNode[]): JSONDocNode => {
	return {
		version: 1,
		type: 'doc',
		content: content || [],
	};
};

const emptyDoc = createDocFromContent([
	{
		type: 'paragraph',
		content: [],
	},
]);

export class JSONTransformer implements Transformer<JSONDocNode> {
	private schema: Schema;
	private mentionMap: Record<string, string | undefined> | undefined;

	/**
	 * Creates a new JSONTransformer instance.
	 * @param schema The current editor schema
	 * @param mentionMap An optional mapping of user IDs to mention names. This is used by the encoder to substitute empty
	 * mention node.attr.text values with mapped names.
	 */
	constructor(schema: Schema = defaultSchema, mentionMap?: Record<string, string | undefined>) {
		this.schema = schema;
		this.mentionMap = mentionMap;
	}

	encode(node: PMNode, options: SanitizeNodeOptions = {}): JSONDocNode {
		const content: JSONNode[] = [];

		node.content.forEach((child) => {
			content.push(sanitizeNode(toJSON(child, this.mentionMap), options));
		});

		if (!content || isEqual(content, emptyDoc.content)) {
			return createDocFromContent([]);
		}

		return createDocFromContent(content);
	}

	private internalParse(content: JSONDocNode, schema: Schema): PMNode {
		const doc = schema.nodeFromJSON(content);
		doc.check();
		return doc;
	}

	parse(content: JSONDocNode, stage?: SchemaStage): PMNode {
		if (content.type !== 'doc') {
			throw new Error('Expected content format to be ADF');
		}

		const schema = !!stage ? getSchemaBasedOnStage(stage) : this.schema;

		if (!content.content || content.content.length === 0) {
			return this.internalParse(emptyDoc, schema);
		}

		return this.internalParse(content, schema);
	}

	/**
	 * This method is used to encode a single node
	 */
	encodeNode(node: PMNode, options: SanitizeNodeOptions = {}): JSONNode {
		return sanitizeNode(toJSON(node, this.mentionMap), options);
	}
}
