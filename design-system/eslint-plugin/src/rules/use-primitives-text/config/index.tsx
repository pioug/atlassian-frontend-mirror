type Pattern =
  // <p>text</p>
  | 'paragraph-elements'
  // <span>text</span>
  | 'span-elements'
  // <strong>text</strong>
  | 'strong-elements'
  // <em>text</em>
  | 'emphasis-elements';

export interface RuleConfig {
  patterns: Pattern[];
  inheritColor: boolean;
}

const defaults: RuleConfig = {
  patterns: [
    'paragraph-elements',
    'span-elements',
    'strong-elements',
    'emphasis-elements',
  ],
  inheritColor: false,
};

export const getConfig = (
  overrides: Partial<RuleConfig>,
): Required<RuleConfig> => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  // start with an empty object, then merge in the defaults, then merge in overrides.
  // The empty object is returned, as well as modified in place
  return Object.assign({}, defaults, overrides);
};
