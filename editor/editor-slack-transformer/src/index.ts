import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

interface Transformer<T> {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	encode(node: PMNode): T;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	parse(content: T): PMNode;
}

import { MarkdownSerializer, marks, nodes } from './serializer';

export class SlackTransformer implements Transformer<string> {
	// @ts-expect-error - Our node definitions are not compatible with prosemirror-markdown types
	private serializer = new MarkdownSerializer(nodes, marks);

	encode(node: PMNode): string {
		return this.serializer.serialize(node);
	}

	parse(_slackMarkdown: string): PMNode {
		throw new Error('This is not implemented yet');
	}
}
