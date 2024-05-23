import { type JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';

export type RuleConfig = {
  failSilently?: boolean;
  shouldEnforceFallbacks?: boolean;
};

export const ruleSchema: JSONSchema4 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      failSilently: {
        type: 'boolean',
      },
      shouldEnforceFallbacks: {
        type: 'boolean',
      },
    },
  },
};

const defaultConfig: RuleConfig = {
  failSilently: false,
  shouldEnforceFallbacks: true,
};

export const getConfig = (overrides: RuleConfig): RuleConfig => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  // start with an empty object, then merge in the defaults, then merge in overrides.
  // The empty object is returned, as well as modified in place
  return Object.assign({}, defaultConfig, overrides);
};
