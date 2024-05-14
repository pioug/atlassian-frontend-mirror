// allowedFunctionCalls is an ESLint rule option used by `no-invalid-css-map` and `no-unsafe-values` to whitelist certain function calls from restrictions imposed by those rules.
//
// Expected usage:
//     {
//         // other options for your ESLint rule...
//         // ...
//         allowedFunctionCalls: [
//             ['@atlaskit/tokens', 'token'],
//             ['package-name-here', 'function-name-here'],
//         ],
//     }
//
// You can use these utility functions to process the allowedFunctionsCall option for use in your own rule.
//
// Note that whitelisting default exports is not supported (yet?).

import type { Variable } from 'eslint-scope';
import merge from 'lodash/merge';

import {
  defaultAllowedDynamicKeys,
  defaultAllowedValues,
} from './default-allowed';
import type { AllowList } from './types';

export type { AllowList } from './types';

export function isAllowListedVariable({
  allowList,
  variable,
}: {
  allowList: AllowList;
  variable: Variable;
}) {
  const definitions = variable.defs;

  if (!definitions) {
    return false;
  }

  return definitions.every(definition => {
    // We add some restrictions to keep this simple...
    // Forbid non-imported functions
    if (definition.type !== 'ImportBinding') {
      return false;
    }

    // Forbid default imports (e.g. `import React from 'react'`)
    if (definition.node.type !== 'ImportSpecifier') {
      return false;
    }

    const packageName = definition.parent.source.value;
    const importName = definition.node.imported.name;

    return (
      typeof packageName === 'string' &&
      allowList[packageName]?.includes(importName)
    );
  });
}

/**
 * Differs to `Object.fromEntries` in how it handles multiple entries with the same key.
 */
function collectEntries(
  entries: [packageName: string, importName: string][],
): AllowList {
  return entries.reduce((allowList, [packageName, importName]) => {
    const currentValue = allowList[packageName] ?? [];
    return {
      ...allowList,
      [packageName]: [...currentValue, importName],
    };
  }, {} as AllowList);
}

function getAllowList({
  options,
  allowListKey,
  defaultAllowList,
}: {
  options: any[];
  allowListKey: string;
  defaultAllowList: AllowList;
}): AllowList {
  if (options.length === 0 || options[0][allowListKey] === undefined) {
    return defaultAllowList;
  }

  // We are not checking the options type.
  // We assume that ESLint is enforcing the rule's `schema` correctly.
  // Intentionally passing `{}` as first arg as this function mutates
  return merge({}, defaultAllowList, collectEntries(options[0][allowListKey]));
}

export const getAllowedFunctionCalls = (options: any[]): AllowList =>
  getAllowList({
    options,
    allowListKey: 'allowedFunctionCalls',
    defaultAllowList: defaultAllowedValues,
  });

export const getAllowedDynamicKeys = (options: any[]): AllowList =>
  getAllowList({
    options,
    allowListKey: 'allowedDynamicKeys',
    defaultAllowList: defaultAllowedDynamicKeys,
  });
