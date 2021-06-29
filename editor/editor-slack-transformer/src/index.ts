import { Node as PMNode } from 'prosemirror-model';

interface Transformer<T> {
  encode(node: PMNode): T;
  parse(content: T): PMNode;
}

import { MarkdownSerializer, marks, nodes } from './serializer';

export class SlackTransformer implements Transformer<string> {
  private serializer = new MarkdownSerializer(nodes, marks);

  encode(node: PMNode): string {
    return this.serializer.serialize(node);
  }

  parse(_slackMarkdown: string): PMNode {
    throw new Error('This is not implemented yet');
  }
}
