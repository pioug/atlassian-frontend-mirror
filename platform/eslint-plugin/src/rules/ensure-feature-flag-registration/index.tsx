import type { Rule } from 'eslint';
import readPkgUp from 'read-pkg-up';
import path from 'path';

type PlatformFeatureFlagRegistrationSection = {
  [key: string]: {
    type: 'boolean';
  };
};

// make sure we cache reading the package.json so we don't end up reading it for every instance of this rule.
const pkgJsonCache = new Map<string, readPkgUp.PackageJson>();

// get the ancestor package.json for a given file
const getPackageJsonForFileName = (filename: string): readPkgUp.PackageJson => {
  const splitFilename = filename.split(path.sep);
  for (let i = 0; i < splitFilename.length; i++) {
    // attempt to search using the filename in the cache to see if we've read the package.json for a sibling file before
    const searchPath = path.join(...splitFilename.splice(0, i));
    const cachedPkgJson = pkgJsonCache.get(searchPath);

    if (cachedPkgJson) {
      return cachedPkgJson;
    }
  }

  const { packageJson, path: pkgJsonPath } = readPkgUp.sync({
    cwd: filename,
    normalize: false,
  })!;

  pkgJsonCache.set(pkgJsonPath, packageJson);
  return packageJson;
};

const __isOnlyOneFlagCheckInExpression = (
  root: Rule.Node,
  ignoredNode: Rule.Node,
): boolean => {
  switch (root.type) {
    case 'IfStatement':
      return __isOnlyOneFlagCheckInExpression(
        root.test as Rule.Node,
        ignoredNode,
      );

    case 'CallExpression':
      if (root === ignoredNode) {
        return true;
      }
      return !(
        root.callee.type === 'Identifier' && root.callee.name === 'getBooleanFF'
      );

    // shouldn't ever get here but just in case
    case 'Identifier':
      return root.name !== 'getBooleanFF';

    case 'BinaryExpression':
    case 'LogicalExpression':
      return (
        __isOnlyOneFlagCheckInExpression(root.left as Rule.Node, ignoredNode) &&
        __isOnlyOneFlagCheckInExpression(root.right as Rule.Node, ignoredNode)
      );

    default:
      return true;
  }
};

const isOnlyOneFlagCheckInExpression = (node: Rule.Node): boolean => {
  let root = node.parent;
  // find the root node of the expression
  while (root.type === 'LogicalExpression') {
    root = root.parent;
  }

  return __isOnlyOneFlagCheckInExpression(root, node);
};

const rule: Rule.RuleModule = {
  meta: {
    hasSuggestions: false,
    docs: {
      recommended: false,
    },
    type: 'problem',
    messages: {
      onlyInlineIf:
        "Only call feature flags as part of an expression, don't assign to a variable! See http://go/pff-eslint for more details",
      onlyStringLiteral:
        "Only get feature flags by string literal, don't use variables! See http://go/pff-eslint for more details",
      registrationSectionMissing:
        'Please add a "platform-feature-flags" section to your package.json! See http://go/pff-eslint for more details',
      featureFlagMissing: `Please add a "{{ featureFlag }}" section to the "platform-feature-flags" section in your package.json. See http://go/pff-eslint for more details`,
      multipleFlagCheckInExpression: `Only check one flag per expression! See http://go/pff-eslint for more details`,
    },
  },
  create(context) {
    return {
      'CallExpression[callee.name=/getBooleanFF/]': (node: Rule.Node) => {
        // to make typescript happy
        if (node.type === 'CallExpression') {
          const args = node.arguments;

          if (args.length === 1 && args[0].type !== 'Literal') {
            return context.report({
              node,
              messageId: 'onlyStringLiteral',
            });
          }

          switch (node.parent?.type) {
            case 'IfStatement':
            case 'ConditionalExpression':
              break;
            case 'LogicalExpression':
              if (!isOnlyOneFlagCheckInExpression(node)) {
                context.report({
                  node,
                  messageId: 'multipleFlagCheckInExpression',
                });
              }
              break;
            default:
              return context.report({
                node,
                messageId: 'onlyInlineIf',
              });
              break;
          }

          const filename = context.getFilename();
          const packageJson = getPackageJsonForFileName(filename);
          const platformFeatureFlags = packageJson[
            'platform-feature-flags'
          ] as PlatformFeatureFlagRegistrationSection;

          if (!platformFeatureFlags) {
            return context.report({
              node,
              messageId: 'registrationSectionMissing',
            });
          }

          if (args.length === 1 && args[0].type === 'Literal' && args[0].raw) {
            const featureFlag = args[0].value as string;
            const featureFlagRegistration = platformFeatureFlags[featureFlag];

            if (!featureFlagRegistration) {
              return context.report({
                node,
                messageId: 'featureFlagMissing',
                data: {
                  featureFlag,
                },
              });
            }
          }
        }

        return {};
      },
    };
  },
};

export default rule;
