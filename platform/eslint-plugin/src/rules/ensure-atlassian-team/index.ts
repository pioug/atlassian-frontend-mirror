import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule ensures that the internal packages have a responsible team attached.',
      recommended: true,
    },
    hasSuggestions: false,
    messages: {
      atlassianTeamRequired: 'The atlassian.team property is required',
    },
  },
  create(context) {
    return {
      ObjectExpression: (node: Rule.Node) => {
        if (
          !context.getFilename().endsWith('package.json') ||
          node.type !== 'ObjectExpression'
        ) {
          return;
        }

        const atlassianProp = node.properties.find(
          (p) =>
            p.type === 'Property' &&
            p.key.type === 'Literal' &&
            p.key.value === 'atlassian',
        );

        if (!atlassianProp) {
          return;
        }

        if (
          atlassianProp.type !== 'Property' ||
          atlassianProp.value.type !== 'ObjectExpression'
        ) {
          return;
        }

        const teamProp = atlassianProp.value.properties.find(
          (p) =>
            p.type === 'Property' &&
            p.key.type === 'Literal' &&
            p.key.value === 'team',
        );

        // this just checks for existence, we can potentially cross-reference it with teams.json to make sure its valid in the future.
        if (!teamProp) {
          return context.report({
            node,
            messageId: 'atlassianTeamRequired',
          });
        }
      },
    };
  },
};

export default rule;
