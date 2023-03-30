import type { Rule } from 'eslint';
import readPkgUp from 'read-pkg-up';
import path from 'path';
import Fuse from 'fuse.js';

// defines a "getter" to "type" map, if more types are required for feature flags (like string) add it here!
// if you don't want to verify the type use `null` as the value
const getterIdentifierToFlagTypeMap = {
  getBooleanFF: 'boolean' as const,
  ffTest: 'boolean' as const,
} as const;

type PlatformFeatureFlagRegistrationSection = {
  [key: string]: {
    // get the values of the object above
    type: typeof getterIdentifierToFlagTypeMap[keyof typeof getterIdentifierToFlagTypeMap];
  };
};

type EnhancedPackageJson = readPkgUp.PackageJson & {
  'platform-feature-flags'?: PlatformFeatureFlagRegistrationSection;
};

type PkgJsonMetaData = {
  pkgJson: EnhancedPackageJson;
  fuse: Fuse<string> | null;
};

// make sure we cache reading the package.json so we don't end up reading it for every instance of this rule.
const pkgJsonCache = new Map<string, PkgJsonMetaData>();

// get the ancestor package.json for a given file
const getMetadataForFilename = (filename: string): PkgJsonMetaData => {
  const splitFilename = filename.split(path.sep);
  for (let i = 0; i < splitFilename.length; i++) {
    // attempt to search using the filename in the cache to see if we've read the package.json for a sibling file before
    const searchPath = path.join(...splitFilename.splice(0, i));
    const cachedMetaData = pkgJsonCache.get(searchPath);

    if (cachedMetaData) {
      return cachedMetaData;
    }
  }

  const { packageJson, path: pkgJsonPath } = readPkgUp.sync({
    cwd: filename,
    normalize: false,
  })!;

  const pkgJson = packageJson as EnhancedPackageJson;

  const fuse =
    packageJson['platform-feature-flags'] == null
      ? null
      : new Fuse(Object.keys(pkgJson['platform-feature-flags']!));

  const metaData = { pkgJson, fuse };

  pkgJsonCache.set(pkgJsonPath, metaData);
  return metaData;
};

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: false,
    },
    type: 'problem',
    messages: {
      registrationSectionMissing:
        'Please add a "platform-feature-flags" section to your package.json! See http://go/pff-eslint for more details',
      featureFlagMissing: `Please add a "{{ featureFlag }}" section to the "platform-feature-flags" section in your package.json. See http://go/pff-eslint for more details`,
      changeFeatureFlag: `Change flag key to "{{ closestFlag }}" already defined in package.json`,
      featureFlagIncorrectType: `Please change the type for "{{ featureFlag }}" to "{{ expectedType }}" in the section to the "platform-feature-flags" section in your package.json. See http://go/pff-eslint for more details"`,
    },

    hasSuggestions: true,
  },
  create(context) {
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
            const { pkgJson: packageJson, fuse } =
              getMetadataForFilename(filename);
            const platformFeatureFlags = packageJson['platform-feature-flags'];

            if (!platformFeatureFlags) {
              return context.report({
                node: node,
                messageId: 'registrationSectionMissing',
              });
            }

            if (
              args.length === 1 &&
              args[0].type === 'Literal' &&
              args[0].raw
            ) {
              const featureFlag = args[0].value as string;
              const featureFlagRegistration = platformFeatureFlags[featureFlag];

              const expectedType =
                getterIdentifierToFlagTypeMap[getterIdentifier];

              // ensure the flag type matches what is registered
              if (
                featureFlagRegistration != null &&
                expectedType != null &&
                featureFlagRegistration?.type !== expectedType
              ) {
                return context.report({
                  node: args[0],
                  messageId: 'featureFlagIncorrectType',
                  data: {
                    featureFlag,
                    expectedType,
                  },
                });
              }

              if (!featureFlagRegistration) {
                // find the closest match in existing section for suggestion text
                let closestMatchFix: Rule.SuggestionReportDescriptor | null =
                  null;

                if (fuse) {
                  const closestFlagMatches = fuse.search(featureFlag);
                  if (closestFlagMatches.length > 0) {
                    const closestFlag = closestFlagMatches[0].item;

                    closestMatchFix = {
                      messageId: 'changeFeatureFlag',
                      data: {
                        closestFlag,
                      },
                      fix: (fixer) => {
                        return fixer.replaceText(
                          node.arguments[0],
                          `'${closestFlag}'`,
                        );
                      },
                    };
                  }
                }

                return context.report({
                  node: args[0],
                  messageId: 'featureFlagMissing',
                  data: {
                    featureFlag,
                  },
                  // only suggest if we have a close flag to match
                  ...(closestMatchFix != null
                    ? { suggest: [closestMatchFix] }
                    : {}),
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
