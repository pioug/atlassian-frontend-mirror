type Pattern =
  // <h1>text</h1>
  'native-elements';

export interface RuleConfig {
  patterns: Pattern[];
}

const defaults: RuleConfig = {
  patterns: ['native-elements'],
};

export const getConfig = (
  overrides: Partial<RuleConfig>,
): Required<RuleConfig> => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  // start with an empty object, then merge in the defaults, then merge in overrides.
  // The empty object is returned, as well as modified in place
  return Object.assign({}, defaults, overrides);
};
