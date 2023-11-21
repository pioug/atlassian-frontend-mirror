import { findRootSync } from '@manypkg/find-root';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { ObjectExpression } from 'estree';
import { getObjectPropertyAsObject } from '../util/handle-ast-object';

// Here we only need to specify the major and minor versions
// In matchMinorVersion, we will check if the versions in resolutions fall in the right ranges.
const DESIRED_PKG_VERSIONS: Record<string, string[]> = {
  typescript: ['4.9'],
  '@types/react': ['16.14', '18.2'],
};

const matchMinorVersion = (
  desiredVersion: string,
  versionInResolutions: string,
): boolean => {
  const firstChar = versionInResolutions[0];
  // The version is invalid if it doesn't start with a number or ~
  if (!/^\d$/.test(firstChar) && firstChar !== '~') {
    return false;
  }

  return (
    versionInResolutions.startsWith(desiredVersion) ||
    versionInResolutions.startsWith('~' + desiredVersion)
  );
};

const verifyResolutionFromObject = (
  node: ObjectExpression,
  pkg: string,
  version: string,
  optional: boolean,
): boolean => {
  // For root package.json, we require the critical packages' resolutions exist and with matching version
  // For individual package's package.json, it's ok if resolutions don't exist. But if they do, the version should match
  const resolutionExist = node.properties.some(
    (p) =>
      p.type === 'Property' && p.key.type === 'Literal' && p.key.value === pkg,
  );

  if (!resolutionExist) {
    return optional;
  }

  const resolutionExistAndMatch = node.properties.some(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Literal' &&
      p.key.value === pkg &&
      p.value.type === 'Literal' &&
      matchMinorVersion(version, p.value.value as string),
  );

  return resolutionExistAndMatch;
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce the versions of critical packages are within desired ranges by checking resolutions section in package.json',
      recommended: true,
    },
    hasSuggestions: false,
    messages: {
      invalidPackageResolution: `Make sure the resolutions for the following packages match major and minor version ranges ${JSON.stringify(
        DESIRED_PKG_VERSIONS,
      )}`,
    },
  },
  create(context) {
    const fileName = context.getFilename();
    return {
      ObjectExpression: (node: Rule.Node) => {
        if (
          !fileName.endsWith('package.json') ||
          node.type !== 'ObjectExpression'
        ) {
          return;
        }

        const packageResolutions = getObjectPropertyAsObject(
          node,
          'resolutions',
        );
        const rootDir = findRootSync(process.cwd());
        const isRootPackageJson = fileName.endsWith(`${rootDir}/package.json`);

        if (packageResolutions !== null) {
          for (const [key, values] of Object.entries(DESIRED_PKG_VERSIONS)) {
            if (
              !values.some((value) => {
                return verifyResolutionFromObject(
                  packageResolutions as ObjectExpression,
                  key,
                  value,
                  !isRootPackageJson,
                );
              })
            ) {
              return context.report({
                node,
                messageId: 'invalidPackageResolution',
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
