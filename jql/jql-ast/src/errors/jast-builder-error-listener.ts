import { type ParserErrorListener, type Recognizer, type Token } from 'antlr4ts';

import { JQLParseError } from './jql-parse-error';
import { JQLSyntaxError } from './jql-syntax-error';

export class JastBuilderErrorListener implements ParserErrorListener {
  errors: JQLParseError[] = [];
  syntaxError = <T extends Token>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
  ) => {
    if (offendingSymbol === undefined) {
      this.errors.push(new JQLParseError(msg));
    } else {
      this.errors.push(
        new JQLSyntaxError(
          msg,
          offendingSymbol.startIndex,
          offendingSymbol.stopIndex + 1,
          line,
          charPositionInLine,
        ),
      );
    }
  };
}
