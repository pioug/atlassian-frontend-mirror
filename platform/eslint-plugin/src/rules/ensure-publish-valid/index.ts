import type { Rule } from 'eslint';
import type {
  ObjectExpression,
  SimpleLiteral,
  RegExpLiteral,
  BigIntLiteral,
} from 'estree';
const getObjectPropertyAsLiteral = (
  node: ObjectExpression,
  property: string,
): SimpleLiteral['value'] | RegExpLiteral['value'] | BigIntLiteral['value'] => {
  const prop = node.properties.find(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Literal' &&
      p.key.value === property,
  );

  // double check for property is to make typescript happy
  if (prop?.type === 'Property' && prop?.value.type === 'Literal') {
    return prop.value.value ?? null;
  }

  return null;
};

const getObjectPropertyAsObject = (
  node: ObjectExpression,
  property: string,
): ObjectExpression | null => {
  const prop = node.properties.find(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Literal' &&
      p.key.value === property,
  );

  // double check for property is to make typescript happy
  if (prop?.type === 'Property' && prop?.value.type === 'ObjectExpression') {
    return prop.value ?? null;
  }

  return null;
};

type RuleOptions = {
  // exceptions to this rule, will be ignored
  exceptions?: string[];
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule ensures that the package.json for your packages are set up correctly for publishing depending on the package name prefix',
      recommended: true,
    },
    hasSuggestions: false,
    schema: [
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'array',
            items: [{ type: 'string' }],
          },
        },
      },
    ],
    messages: {
      publishConfigRequired:
        '@atlaskit prefix is public! You have to specify a `publishConfig`, (package {{packageName}}) see https://go.atlassian.com/package-namespace',
      noPrivate:
        'setting private to true prevents publishing, your package prefix implies you want to publish! (package {{packageName}}) see https://go.atlassian.com/package-namespace',
    },
  },
  create(context) {
    const { exceptions } = (context.options?.[0] as RuleOptions) ?? {};

    return {
      ObjectExpression: (node: Rule.Node) => {
        if (
          !context.getFilename().endsWith('package.json') ||
          node.type !== 'ObjectExpression'
        ) {
          return;
        }

        const packageName = getObjectPropertyAsLiteral(node, 'name');
        const packagePrivate = getObjectPropertyAsLiteral(node, 'private');
        const packagePublishConfig = getObjectPropertyAsObject(
          node,
          'publishConfig',
        );

        // exit if package is on known exception list
        if (
          exceptions &&
          exceptions.findIndex((name) => name === packageName) !== -1
        ) {
          return;
        }

        if (
          typeof packageName === 'string' &&
          packageName.startsWith('@atlaskit')
        ) {
          if (typeof packagePrivate === 'boolean' && packagePrivate) {
            return context.report({
              node,
              messageId: 'noPrivate',
              data: {
                packageName,
              },
            });
          }

          if (packagePublishConfig === null) {
            return context.report({
              node,
              messageId: 'publishConfigRequired',
              data: {
                packageName,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
