// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { SimpleCallExpression } from 'estree';

const NESTED_LIMIT: number = 4;
const TEST_RUNNER_IDENTIFIER = 'ffTest' as const;

const getDepthOfNestedRunner = (
  node: SimpleCallExpression & Rule.NodeParentExtension,
): number => {
  // Calculate the depth of a binary tree, using a queue to track path
  let queue: (typeof node)[] = [];
  queue.push(node);
  let depth = 0;
  while (queue.length > 0) {
    let nodeCount = queue.length;
    while (nodeCount > 0) {
      let currentNode = queue.shift() as typeof node;
      if (
        currentNode.arguments[1].type === 'ArrowFunctionExpression' &&
        currentNode.arguments[1].body.type === 'CallExpression' &&
        currentNode.arguments[1].body.callee.type === 'Identifier' &&
        currentNode.arguments[1].body.callee.name === TEST_RUNNER_IDENTIFIER
      ) {
        queue.push({
          ...currentNode.arguments[1].body,
          parent: currentNode.parent,
        });
      }
      if (
        currentNode.arguments[2]?.type === 'ArrowFunctionExpression' &&
        currentNode.arguments[2].body.type === 'CallExpression' &&
        currentNode.arguments[2].body.callee.type === 'Identifier' &&
        currentNode.arguments[2].body.callee.name === TEST_RUNNER_IDENTIFIER
      ) {
        queue.push({
          ...currentNode.arguments[2].body,
          parent: currentNode.parent,
        });
      }
      nodeCount--;
    }
    depth++;
  }
  return depth;
};

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: false,
    },
    type: 'problem',
    messages: {
      tooManyNestedTestRunner:
        '{{nestedTestRunner}} test runners are nested. Feature flags may need a clean-up',
    },
  },
  create(context) {
    return {
      // Find the most outside test runner, could be inside a describe or not
      [`Program > * > CallExpression[callee.name=/${TEST_RUNNER_IDENTIFIER}/], CallExpression[callee.name=/describe/] > * > * > * > CallExpression[callee.name=/${TEST_RUNNER_IDENTIFIER}/]`]:
        (node: Rule.Node) => {
          if (node.type === 'CallExpression') {
            // Calculate the depth of nested test runners, counting from the most outside
            const depth = getDepthOfNestedRunner(node);

            if (depth > NESTED_LIMIT) {
              return context.report({
                node,
                messageId: 'tooManyNestedTestRunner',
                data: {
                  nestedTestRunner: depth.toString(),
                },
              });
            }
          }
          return {};
        },
    };
  },
};

export default rule;
