import { Schema } from 'prosemirror-model';
import { Token } from './';
import { Context } from '../../interfaces';

// TODO: Create a type for rawContentProcessor which will be shared among parsers
export interface MacroOption {
  // The macro keyword
  keyword: string;
  // If the macro needs a paired closing part
  paired: boolean;
  // This function will be called with the rawAttrs and rawContent
  context: Context;
  rawContentProcessor: (
    rawAttrs: string,
    rawContent: string,
    length: number,
    schema: Schema,
    context: Context,
  ) => Token;
}

export function commonMacro(
  input: string,
  schema: Schema,
  opt: MacroOption,
): Token {
  /**
   * Forging the opening regex, the result would look something like
   * /^\{(quote)(?::([^\{\n\}]*))?\}/i
   */
  const opening = new RegExp(`^\{(${opt.keyword})(?::([^\{\n\}]*))?\}`, 'i');
  const matchOpening = input.match(opening);

  if (!matchOpening) {
    return fallback(input);
  }

  const [, name, rawAttrs] = matchOpening;
  const openingLength = matchOpening[0].length;

  if (!opt.paired) {
    /**
     * Some macros do not have a closing symbol, for example
     * {anchor:here} {loremipsum}
     */
    return opt.rawContentProcessor(
      rawAttrs,
      '',
      openingLength,
      schema,
      opt.context,
    );
  }

  /**
   * Forging the closing regex, the result would look something like
   * /\{quote\}/
   */
  const closing = new RegExp(`\{${name}\}`);
  const matchClosing = closing.exec(input.substring(openingLength));

  let rawContent = '';
  if (matchClosing) {
    rawContent = input.substring(
      openingLength,
      openingLength + matchClosing.index,
    );
  }

  const length = matchClosing
    ? openingLength + matchClosing.index + matchClosing[0].length
    : openingLength;

  return opt.rawContentProcessor(
    rawAttrs,
    rawContent,
    length,
    schema,
    opt.context,
  );
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
