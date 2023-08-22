import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`

  ${(<AtlassianInternalWarning />)}

  This library contains auto-generated sources from the [antlr4ts](https://github.com/tunnelvisionlabs/antlr4ts)
  library using the JQL ANTLR4 grammar. It enables consumers to parse a JQL query into a parse tree.

  ## Usage

  ${code`
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

// Create the lexer and parser
const jqlText = "project = JQL";
const charStream = CharStreams.fromString(jqlText);
const lexer = new JQLLexer(charStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new JQLParser(tokenStream);

// Parse the input, where jqlQuery is the entry point
const parsedJQLTree = parser.jqlQuery();
  `}

  ## Documentation

  ### Inspecting the parse tree

  A JQL parse tree can be inspected using the \`JQLParserListener\` or \`JQLParserVisitor\`, you can read
  about the differences between the visitor/listener approaches [here](https://github.com/antlr/antlr4/blob/master/doc/listeners.md).

  #### Listener Approach

  ${code`
import { JQLParserListener, JqlQueryContext } from '@atlaskit/jql-parser';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';

class EnterQueryListener implements JQLParserListener {
    enterJqlQuery(context: JqlQueryContext) {
        console.log(context);
        // ...
    }

    // other enterX functions...
}

// Create the listener
const listener: JQLParserListener = new EnterQueryListener();

// Use the entry point for listeners on the parsed JQL tree
ParseTreeWalker.DEFAULT.walk(listener, parsedJQLTree);
  `}

  #### Visitor Approach

  ${code`
import { JQLParserVisitor, JqlOperandContext } from '@atlaskit/jql-parser';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';

// Extend the AbstractParseTreeVisitor to get default visitor behaviour
class CountOperandsVisitor extends AbstractParseTreeVisitor<number>
  implements JQLParserVisitor<number> {
  defaultResult() {
    return 0;
  }

  aggregateResult(aggregate: number, nextResult: number) {
    return aggregate + nextResult;
  }

  visitJqlOperand(context: JqlOperandContext): number {
    return 1 + super.visitChildren(context);
  }
}

// Create the visitor
const countOperandsVisitor = new CountOperandsVisitor()

// Use the visitor entry point with the parsed JQL tree
const numberOfOperands = countOperandsVisitor.visit(parsedJQLTree);
  `}

  ### Generating the parser

  Files in the \`generated\` directory are auto-generated from ANTLR grammar definition files. If you need to update the JQL grammar,
  you can follow the instructions on [this page](https://bitbucket.org/atlassian/jql-grammar/src/master/typescript/packages/jql-parser/README.md).

  ## Support

  For developers outside of Atlassian looking for help, or to report issues, [please make a post on the community forum](https://community.developer.atlassian.com/c/atlassian-ecosystem-design).
  We will monitor the forums and redirect topics to the appropriate maintainers.

`;
