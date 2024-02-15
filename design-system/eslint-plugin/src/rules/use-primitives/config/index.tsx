type Pattern =
  // this enables the rule to look for a pattern like:
  // const myStyles = css({...})
  | 'compiled-css-function'

  // this enables the rule to look for a pattern like:
  // const MyComponent = styled.div({...})
  | 'compiled-styled-object'

  // this enables the rule to look for a pattern like:
  // css({ padding: `I AM A TEMPLATE LITERAL` })
  // or styled.div({ padding: `I AM A TEMPLATE LITERAL` })
  | 'css-template-literal'

  // this enables the rule to look for a pattern like:
  // css({ padding: token(...) })
  // or styled.div({ padding: token(...) })
  | 'css-property-with-tokens'

  // this enables the rule to look for a pattern like:
  // css({ padding: '8px 16px' })
  // or styled.div({ padding: css({ padding: '8px 16px' }) })
  // ... and they could be tokenised
  // ... and they could be using template literals
  | 'css-property-multiple-values'

  // This enables the rule to look for a pattern like:
  // ```
  // const styles = css({ // or `styled.div({`
  //   padding: '8px',
  //   margin: '8px',
  // })
  | 'multiple-properties';

export interface RuleConfig {
  patterns: Pattern[];
}

const defaults: RuleConfig = {
  patterns: ['compiled-css-function'],
};

export const getConfig = (
  overrides: Partial<RuleConfig>,
): Required<RuleConfig> => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  // start with an empty object, then merge in the defaults, then merge in overrides.
  // The empty object is returned, as well as modified in place
  return Object.assign({}, defaults, overrides);
};
