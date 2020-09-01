import { createSchema } from './create-schema';
import { Schema } from 'prosemirror-model';

export interface JIRASchemaConfig {
  allowLists?: boolean;
  allowMentions?: boolean;
  allowEmojis?: boolean;
  allowLinks?: boolean;
  allowAdvancedTextFormatting?: boolean;
  allowCodeBlock?: boolean;
  allowBlockQuote?: boolean;
  allowSubSup?: boolean;
  allowMedia?: boolean;
  allowTextColor?: boolean;
  allowTables?: boolean;
}

export default function makeSchema(config: JIRASchemaConfig) {
  const nodes = ['doc', 'paragraph', 'text', 'hardBreak', 'heading', 'rule'];
  const marks = [
    'strong',
    'em',
    'underline',
    'typeAheadQuery',
    'unsupportedMark',
    'unsupportedNodeAttribute',
  ];

  if (config.allowLinks) {
    marks.push('link');
  }

  if (config.allowLists) {
    nodes.push('orderedList', 'bulletList', 'listItem');
  }

  if (config.allowMentions) {
    nodes.push('mention');
    marks.push('mentionQuery');
  }

  if (config.allowEmojis) {
    nodes.push('emoji');
  }

  if (config.allowAdvancedTextFormatting) {
    marks.push('strike', 'code');
  }

  if (config.allowSubSup) {
    marks.push('subsup');
  }

  if (config.allowCodeBlock) {
    nodes.push('codeBlock');
  }

  if (config.allowBlockQuote) {
    nodes.push('blockquote');
  }

  if (config.allowMedia) {
    nodes.push('mediaGroup', 'mediaSingle', 'media');
  }

  if (config.allowTextColor) {
    marks.push('textColor');
  }

  if (config.allowTables) {
    nodes.push('table', 'tableCell', 'tableHeader', 'tableRow');
  }

  return createSchema({ nodes, marks });
}

export function isSchemaWithLists(schema: Schema): boolean {
  return !!schema.nodes.bulletList;
}

export function isSchemaWithMentions(schema: Schema): boolean {
  return !!schema.nodes.mention;
}

export function isSchemaWithEmojis(schema: Schema): boolean {
  return !!schema.nodes.emoji;
}

export function isSchemaWithLinks(schema: Schema): boolean {
  return !!schema.marks.link;
}

export function isSchemaWithAdvancedTextFormattingMarks(
  schema: Schema,
): boolean {
  return !!schema.marks.code && !!schema.marks.strike;
}

export function isSchemaWithSubSupMark(schema: Schema): boolean {
  return !!schema.marks.subsup;
}

export function isSchemaWithCodeBlock(schema: Schema): boolean {
  return !!schema.nodes.codeBlock;
}

export function isSchemaWithBlockQuotes(schema: Schema): boolean {
  return !!schema.nodes.blockquote;
}

export function isSchemaWithMedia(schema: Schema): boolean {
  return !!schema.nodes.mediaGroup && !!schema.nodes.media;
}

export function isSchemaWithTextColor(schema: Schema): boolean {
  return !!schema.marks.textColor;
}

export function isSchemaWithTables(schema: Schema): boolean {
  return (
    !!schema.nodes.table &&
    !!schema.nodes.tableCell &&
    !!schema.nodes.tableHeader &&
    !!schema.nodes.tableRow
  );
}
