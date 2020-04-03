import { DOMParser, Node as PMNode, Schema } from 'prosemirror-model';
import { MarkdownSerializer, marks, nodes } from './serializer';
import { transformHtml } from './util';
import { Transformer } from '@atlaskit/editor-common';

export interface TransformerOptions {
  disableBitbucketLinkStripping?: boolean;
}

export class BitbucketTransformer implements Transformer<string> {
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
