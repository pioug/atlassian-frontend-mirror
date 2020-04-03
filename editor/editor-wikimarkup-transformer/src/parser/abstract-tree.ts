import { Node as PMNode, Schema } from 'prosemirror-model';
import { parseString } from './text';
import { normalizePMNodes } from './utils/normalize';
import { Context } from '../interfaces';

export default class AbstractTree {
  private schema: Schema;
  private wikiMarkup: string;

  constructor(schema: Schema, wikiMarkup: string) {
    this.schema = schema;
    this.wikiMarkup = wikiMarkup;
  }

  /**
   * Convert reduced macros tree into prosemirror model tree
   */
  getProseMirrorModel(context: Context): PMNode {
    const content = parseString({
      context,
      ignoreTokenTypes: [],
      input: this.wikiMarkup,
      schema: this.schema,
    });

    return this.schema.nodes.doc.createChecked(
      {},
      normalizePMNodes(content, this.schema),
    );
  }
}
