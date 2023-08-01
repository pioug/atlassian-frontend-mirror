import { createSchema } from './create-schema';
import { Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
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

/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
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
    nodes.push('mediaGroup', 'mediaSingle', 'media', 'caption', 'mediaInline');
  }

  if (config.allowTextColor) {
    marks.push('textColor');
  }

  if (config.allowTables) {
    nodes.push('table', 'tableCell', 'tableHeader', 'tableRow');
  }

  return createSchema({ nodes, marks });
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithLists(schema: Schema): boolean {
  return !!schema.nodes.bulletList;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithMentions(schema: Schema): boolean {
  return !!schema.nodes.mention;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithEmojis(schema: Schema): boolean {
  return !!schema.nodes.emoji;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithLinks(schema: Schema): boolean {
  return !!schema.marks.link;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithAdvancedTextFormattingMarks(
  schema: Schema,
): boolean {
  return !!schema.marks.code && !!schema.marks.strike;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithSubSupMark(schema: Schema): boolean {
  return !!schema.marks.subsup;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithCodeBlock(schema: Schema): boolean {
  return !!schema.nodes.codeBlock;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithBlockQuotes(schema: Schema): boolean {
  return !!schema.nodes.blockquote;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithMedia(schema: Schema): boolean {
  return (
    !!schema.nodes.mediaGroup &&
    !!schema.nodes.media &&
    !!schema.nodes.mediaInline
  );
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithTextColor(schema: Schema): boolean {
  return !!schema.marks.textColor;
}
/**
 * @deprecated [ED-15676] We have stopped supporting product specific schemas. Use `@atlaskit/adf-schema/schema-default` instead.
 **/
export function isSchemaWithTables(schema: Schema): boolean {
  return (
    !!schema.nodes.table &&
    !!schema.nodes.tableCell &&
    !!schema.nodes.tableHeader &&
    !!schema.nodes.tableRow
  );
}
