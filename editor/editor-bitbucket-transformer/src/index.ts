import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { DOMParser } from '@atlaskit/editor-prosemirror/model';
import { MarkdownSerializer, marks, nodes } from './serializer';
import { transformHtml } from './util';

interface Transformer<T> {
	encode(node: PMNode): T;
	parse(content: T): PMNode;
}

export interface TransformerOptions {
	disableBitbucketLinkStripping?: boolean;
}

export class BitbucketTransformer implements Transformer<string> {
	// @ts-expect-error - Our node definitions are not compatible with prosemirror-markdown types
	private serializer = new MarkdownSerializer(nodes, marks);
	private schema: Schema;
	private options: TransformerOptions;

	constructor(schema: Schema, options: TransformerOptions = {}) {
		this.schema = schema;
		this.options = options;
	}

	encode(node: PMNode): string {
		return this.serializer.serialize(node);
	}

	parse(html: string): PMNode {
		const dom = this.buildDOMTree(html);
		return DOMParser.fromSchema(this.schema).parse(dom);
	}

	buildDOMTree(html: string): HTMLElement {
		return transformHtml(html, this.options);
	}
}
