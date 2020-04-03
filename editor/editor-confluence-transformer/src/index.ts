import { Node as PMNode, Schema } from 'prosemirror-model';
import { Transformer } from '@atlaskit/editor-common';
import parse from './parse';
import encode from './encode';
export { LANGUAGE_MAP as CONFLUENCE_LANGUAGE_MAP } from './languageMap';

export class ConfluenceTransformer implements Transformer<string> {
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  parse = (html: string): PMNode => parse(html, this.schema);

  encode = (node: PMNode): string => encode(node, this.schema);
}
