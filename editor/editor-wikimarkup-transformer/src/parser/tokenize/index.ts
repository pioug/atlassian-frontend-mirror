import { Node as PMNode, Schema } from 'prosemirror-model';
import { media } from './media';
import { blockquote } from './blockquote';
import { citation } from './citation';
import { deleted } from './deleted';
import { doubleDashSymbol } from './double-dash-symbol';
import { emoji } from './emoji';
import { emphasis } from './emphasis';
import { hardbreak } from './hardbreak';
import { heading } from './heading';
import { inserted } from './inserted';
import { linkFormat } from './links/link-format';
import { linkText } from './link-text';
import { list } from './list';
import { monospace } from './monospace';
import { quadrupleDashSymbol } from './quadruple-dash-symbol';
import { ruler } from './ruler';
import { strong } from './strong';
import { subscript } from './subscript';
import { superscript } from './superscript';
import { table } from './table';
import { tripleDashSymbol } from './triple-dash-symbol';
import { panelMacro } from './panel-macro';
import { adfMacro } from './adf-macro';
import { anchorMacro } from './anchor-macro';
import { codeMacro } from './code-macro';
import { quoteMacro } from './quote-macro';
import { colorMacro } from './color-macro';
import { noformatMacro } from './noformat-macro';
import { forceLineBreak } from './force-line-break';
import { issueKey } from './issue-key';
import { Context } from '../../interfaces';

export enum TokenType {
  ADF_MACRO = 'ADF_MACRO', // {adf}
  ANCHOR_MACRO = 'ANCHOR_MACRO', // {anchor}
  CODE_MACRO = 'CODE_MACRO', // {code}
  QUOTE_MACRO = 'QUOTE_MACRO', // {quote}
  NOFORMAT_MACRO = 'NOFORMAT_MACRO', // {noformat}
  PANEL_MACRO = 'PANEL_MACRO', // {panel}
  COLOR_MACRO = 'COLOR_MACRO', // {color}
  LOREM_MACRO = 'LOREM_MACRO', // {loremipsum}
  QUOTE = 'QUOTE',
  STRING = 'STRING',
  ISSUE_KEY = 'ISSUE_KEY',
  LINK_FORMAT = 'LINK_FORMAT',
  LINK_TEXT = 'LINK_TEXT',
  MEDIA = 'MEDIA',
  HEADING = 'HEADING',
  LIST = 'LIST',
  TABLE = 'TABLE',
  RULER = 'RULER',
  HARD_BREAK = 'HARD_BREAK', // \\, \r, \n, \r\n
  DOUBLE_DASH_SYMBOL = 'DOUBLE_DASH_SYMBOL', // --
  TRIPLE_DASH_SYMBOL = 'TRIPLE_DASH_SYMBOL', // ---
  QUADRUPLE_DASH_SYMBOL = 'QUADRUPLE_DASH_SYMBOL', // ----
  STRONG = 'STRONG', // *strong*
  MONOSPACE = 'MONOSPACE', // {{text}}
  SUPERSCRIPT = 'SUPERSCRIPT', // ^superscript^
  SUBSCRIPT = 'SUBSCRIPT', // ^subscript^
  EMPHASIS = 'EMPHASIS', // _emphasis_
  CITATION = 'CITATION', // ??citation??
  DELETED = 'DELETED', // -deleted-
  INSERTED = 'INSERTED', // +deleted+
  EMOJI = 'EMOJI', // :)
  FORCE_LINE_BREAK = 'FORCE_LINE_BREAK', // \\
}

export interface TextToken {
  readonly type: 'text';
  readonly text: string;
  readonly length: number;
}

export interface PMNodeToken {
  readonly type: 'pmnode';
  readonly nodes: PMNode[];
  readonly length: number;
}

export type TokenErrCallback = (err: Error, tokenType: string) => void;

export type Token = TextToken | PMNodeToken;

export type TokenParser = ({
  input,
  position,
  schema,
  context,
}: {
  input: string;
  position: number;
  schema: Schema;
  context: Context;
}) => Token;

const tokenToTokenParserMapping: {
  [key: string]: TokenParser;
} = {
  [TokenType.DOUBLE_DASH_SYMBOL]: doubleDashSymbol,
  [TokenType.TRIPLE_DASH_SYMBOL]: tripleDashSymbol,
  [TokenType.QUADRUPLE_DASH_SYMBOL]: quadrupleDashSymbol,
  [TokenType.RULER]: ruler,
  [TokenType.STRONG]: strong,
  [TokenType.MONOSPACE]: monospace,
  [TokenType.SUPERSCRIPT]: superscript,
  [TokenType.SUBSCRIPT]: subscript,
  [TokenType.EMPHASIS]: emphasis,
  [TokenType.CITATION]: citation,
  [TokenType.DELETED]: deleted,
  [TokenType.INSERTED]: inserted,
  [TokenType.HARD_BREAK]: hardbreak,
  [TokenType.LINK_FORMAT]: linkFormat,
  [TokenType.LINK_TEXT]: linkText,
  [TokenType.HEADING]: heading,
  [TokenType.MEDIA]: media,
  [TokenType.LIST]: list,
  [TokenType.QUOTE]: blockquote,
  [TokenType.TABLE]: table,
  [TokenType.EMOJI]: emoji,
  [TokenType.ADF_MACRO]: adfMacro,
  [TokenType.ANCHOR_MACRO]: anchorMacro,
  [TokenType.CODE_MACRO]: codeMacro,
  [TokenType.QUOTE_MACRO]: quoteMacro,
  [TokenType.NOFORMAT_MACRO]: noformatMacro,
  [TokenType.PANEL_MACRO]: panelMacro,
  [TokenType.COLOR_MACRO]: colorMacro,
  [TokenType.FORCE_LINE_BREAK]: forceLineBreak,
  [TokenType.ISSUE_KEY]: issueKey,
};

export function parseToken(
  input: string,
  type: TokenType,
  position: number,
  schema: Schema,
  context: Context,
): Token {
  const tokenParser = tokenToTokenParserMapping[type];
  if (tokenParser) {
    try {
      return tokenParser({ input, position, schema, context });
    } catch (err) {
      if (context.tokenErrCallback) {
        context.tokenErrCallback(err, type);
      }
      return fallback(input, position);
    }
  }
  return fallback(input, position);
}

function fallback(input: string, position: number): Token {
  return {
    type: 'text',
    text: input.substr(position, 1),
    length: 1,
  };
}
