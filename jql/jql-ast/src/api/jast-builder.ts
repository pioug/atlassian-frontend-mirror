import {
  type ANTLRErrorStrategy,
  CharStreams,
  CommonTokenStream,
  type ParserErrorListener,
} from 'antlr4ts';
import memoize from 'memoize-one';

import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

import creators from '../creators';
import { JastBuilderErrorListener, JQLParseError } from '../errors';
import { type Jast } from '../types';
import { QueryVisitor } from '../visitors';

export class JastBuilder {
  private errorListeners: ParserErrorListener[] = [];
  private errorHandler: ANTLRErrorStrategy | void = undefined;

  setErrorHandler(errorHandler: ANTLRErrorStrategy): JastBuilder {
    this.errorHandler = errorHandler;
    return this;
  }

  setErrorListeners(errorListeners: ParserErrorListener[]): JastBuilder {
    this.errorListeners = this.errorListeners.concat(errorListeners);
    return this;
  }

  private getTokens = memoize((value: string): CommonTokenStream => {
    const chars = CharStreams.fromString(value);
    const lexer = new JQLLexer(chars);
    return new CommonTokenStream(lexer);
  });

  private getParser = memoize(
    (tokens: CommonTokenStream): JQLParser => new JQLParser(tokens),
  );

  build(value: string): Jast {
    const tokens = this.getTokens(value);
    const parser = this.getParser(tokens);

    const astErrorListener = new JastBuilderErrorListener();

    parser.removeErrorListeners();
    parser.addErrorListener(astErrorListener);
    this.errorListeners.forEach(errorListener =>
      parser.addErrorListener(errorListener),
    );

    if (this.errorHandler) {
      parser.errorHandler = this.errorHandler;
      this.errorHandler.reset(parser);
    }

    const visitor = new QueryVisitor(tokens);

    try {
      const parseTree = parser.jqlQuery();
      const query = parseTree.accept(visitor);

      return creators.jast(query, value, astErrorListener.errors);
    } catch (error: any) {
      return creators.jast(undefined, value, [
        new JQLParseError(error.message, error),
      ]);
    }
  }
}
