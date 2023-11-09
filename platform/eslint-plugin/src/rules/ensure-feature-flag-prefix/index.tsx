// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import {
  getMetadataForFilename,
  getterIdentifierToFlagTypeMap,
} from '../util/registration-utils';

type RuleOptions = {
  allowedPrefixes: string[];
};

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: false,
    },
    type: 'problem',
    messages: {
      featureFlagIncorrectPrefix: `Please change your flag "{{ featureFlag }}" to have a valid prefix, options are [{{ allowedPrefixes }}]. See http://go/pff-eslint for details`,
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          allowedPrefixes: {
            type: 'array',
            items: [
              {
                type: 'string',
              },
            ],
          },
        },
        required: ['allowedPrefixes'],
      },
    ],
  },
  create(context) {
    const { allowedPrefixes } = (context.options?.[0] as RuleOptions) ?? {};

    return Object.fromEntries(
      (
        Object.keys(
          getterIdentifierToFlagTypeMap,
        ) as (keyof typeof getterIdentifierToFlagTypeMap)[]
      ).map((getterIdentifier) => [
        `CallExpression[callee.name=/${getterIdentifier}/]`,
        (node: Rule.Node) => {
          // to make typescript happy
          if (node.type === 'CallExpression') {
            const args = node.arguments;

            const filename = context.getFilename();
            const { pkgJson: packageJson } = getMetadataForFilename(filename);
            const platformFeatureFlags = packageJson['platform-feature-flags'];

            // existence of registration section is done in 'ensure-feature-flag-registration'
            if (!platformFeatureFlags) {
              return {};
            }

            if (
              args.length === 1 &&
              args[0].type === 'Literal' &&
              args[0].raw
            ) {
              const featureFlag = args[0].value as string;
              if (
                !allowedPrefixes.some((prefix) =>
                  featureFlag.startsWith(prefix),
                )
              ) {
                return context.report({
                  node: args[0],
                  messageId: 'featureFlagIncorrectPrefix',
                  data: {
                    allowedPrefixes: allowedPrefixes
                      .map((p) => `${p}`)
                      .join(','),
                    featureFlag,
                  },
                });
              }
            }
          }

          return {};
        },
      ]),
    );
  },
};

export default rule;
