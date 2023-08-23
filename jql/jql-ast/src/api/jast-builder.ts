import {
  ANTLRErrorStrategy,
  CharStreams,
  CommonTokenStream,
  ParserErrorListener,
} from 'antlr4ts';
import memoize from 'memoize-one';

import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

import { JastBuilderErrorListener, JQLParseError } from '../errors';
import { Jast } from '../types';
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

      return {
        query,
        represents: value,
        errors: astErrorListener.errors,
      };
    } catch (error: any) {
      return {
        query: undefined,
        represents: value,
        errors: [new JQLParseError(error.message, error)],
      };
    }
  }
}
