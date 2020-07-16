import { defaultSchema } from '@atlaskit/adf-schema';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { encode } from './encoder';
import AbstractTree from './parser/abstract-tree';
import { Context, ConversionMap } from './interfaces';
import { buildIssueKeyRegex } from './parser/tokenize/issue-key';

interface Transformer<T> {
  encode(node: PMNode): T;
  parse(content: T): PMNode;
}

export class WikiMarkupTransformer implements Transformer<string> {
  private schema: Schema;

  constructor(schema: Schema = defaultSchema) {
    this.schema = schema;
  }

  encode(node: PMNode, context?: Context): string {
    return encode(node, normalizeContextObject(context));
  }

  parse(wikiMarkup: string, context?: Context): PMNode {
    const tree = new AbstractTree(this.schema, wikiMarkup);

    return tree.getProseMirrorModel(
      this.buildContext(normalizeContextObject(context)),
    );
  }

  private buildContext(context?: Context): Context {
    return context
      ? {
          ...context,
          issueKeyRegex: context.conversion
            ? buildIssueKeyRegex(context.conversion.inlineCardConversion)
            : undefined,
        }
      : {};
  }
}

/**
 * Turns mentionConversion object keys to lowercase for case insensitivity matching
 * This is okay, because conversion context object contains mapping and that should be case insensitive
 */
const normalizeContextObject = (context?: Context) => {
  if (
    !context ||
    !context.conversion ||
    !context.conversion.mentionConversion
  ) {
    // nothing to normalize, return original object
    return context;
  }
  const mentionConversion: ConversionMap = {};
  for (const key in context.conversion.mentionConversion) {
    mentionConversion[key.toLowerCase()] =
      context.conversion.mentionConversion[key];
  }
  context.conversion.mentionConversion = mentionConversion;
  return context;
};

export default WikiMarkupTransformer;
