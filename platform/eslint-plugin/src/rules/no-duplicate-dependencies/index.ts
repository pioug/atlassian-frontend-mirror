import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule disallows a dependency to be defined in both dependencies and devDependencies',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      unexpectedDuplicateDependency: 'Unexpected duplicate dependency {{name}}',
    },
  },
  create(context) {
    const dependencies = new Map();
    const devDependencies = new Map();

    return {
      'ObjectExpression Property[key.value=dependencies] Property': (
        node: Rule.Node,
      ) => {
        // @ts-expect-error
        dependencies.set(node.key.value, node.key);
      },
      'ObjectExpression Property[key.value=devDependencies] Property': (
        node: Rule.Node,
      ) => {
        // @ts-expect-error
        devDependencies.set(node.key.value, node.key);
      },
      'Program:exit': () => {
        for (const [dependency, node] of devDependencies) {
          if (dependencies.has(dependency)) {
            context.report({
              data: {
                name: dependency,
              },
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const property = node.parent;
                const isLastLine =
                  sourceCode.getTokenAfter(property)?.value === '}';
                const end = property.loc.end;

                if (!isLastLine) {
                  return fixer.removeRange([
                    sourceCode.getIndexFromLoc({
                      line: property.loc.start.line,
                      column: 0,
                    }),
                    sourceCode.getIndexFromLoc({
                      line: end.line + 1,
                      column: 0,
                    }),
                  ]);
                }

                const previousToken = sourceCode.getTokenBefore(property)!;

                return fixer.removeRange([
                  sourceCode.getIndexFromLoc({
                    line: previousToken.loc.end.line,
                    column: previousToken.loc.end.column - 1,
                  }),
                  sourceCode.getIndexFromLoc({
                    line: end.line,
                    column: end.column,
                  }),
                ]);
              },
              messageId: 'unexpectedDuplicateDependency',
              node,
            });
          }
        }
      },
    };
  },
};

export default rule;
