import { code, md } from '@atlaskit/docs';

export default md`

  The \`@atlaskit/jql-ast\` package currently exposes 2 API’s consumers can use to traverse the AST, the listener and visitor API’s.

  ## Listener API

  The consumer will implement methods in the \`JastListener\` interface corresponding to nodes they wish to inspect. Once a
  listener has been defined the consumer can call \`walkAST\` which will traverse the AST and invoke the correct methods in
  the listener. For example if I wanted to count the number of field nodes in an AST:

  ${code`
import { walkAST, JastListener, Jast, Field } from '@atlaskit/jql-ast';

class FieldCountListener implements JastListener {
  count: number = 0;

  enterField = (field: Field) => {
    this.count += 1;
  };
}

const countFields = (jast: Jast): number => {
  const listener = new FieldCountListener();
  walkAST(listener, jast);
  return listener.count;
};
  `}

  ## Visitor API

  Using this API, consumers define a visitor which implements one or more methods to visit nodes of a given type.

  In most cases you'll want to extend the provided \`AbstractJastVisitor\` which includes a default implementation to
  perform a depth-first traversal of the tree. Rather than having to navigate the entire tree structure yourself, you can
  extend this class and implement visitor functions for node types that you wish to process.

  You'll need to implement the \`defaultResult\` method which is the default value that will be initialised when visiting
  children of a node. You can also override the \`aggregateResult\` method to specify how return values of children should
  be aggregated.

  We could implement our conditional counting example from above like so:

  ${code`
import { AbstractJastVisitor, Jast, Field } from '@atlaskit/jql-ast';

class FieldCountVisitor extends AbstractJastVisitor<number> {
  visitField = (field: Field): number => {
    return 1;
  };

  protected aggregateResult(aggregate: number, nextResult: number): number {
    return aggregate + nextResult;
  }

  protected defaultResult(): number {
    return 0;
  }
}

const countFields = (jast: Jast): number => {
  const visitor = new FieldCountVisitor();
  return visitor.visit(jast.query);
};
  `}

  #### Differences

  The main difference between a listener and visitor is that a listener cannot control how the tree is traversed. With a
  visitor you can return values from each visitor function and stop visiting of subtrees entirely.

  In the above example we have implemented the \`visitField\` method, meaning that unless we explicitly visit children in
  our implementation (i.e. \`this.visitChildren(field)\`) we won't traverse any deeper into the tree.

  In general, visitors provide a more flexible API and are better suited to gathering information from the tree as you can
  define explicit return types for your functions.

`;
