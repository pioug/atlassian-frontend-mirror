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
	| 'multiple-properties'
	// This enables the rule to look for supported dimension properties set as 100% like:
	// ```
	// const styles = css({ // or `styled.div({`
	//   padding: '8px',
	//   margin: '8px',
	//   width: '100%',
	// })
	| 'dimension-properties'
	// This enables the rule to look for JSX elements that are defined before the styles
	| 'jsx-order-fix'
	// This enables a fix for string style properties being incorrectly transformed
	| 'string-style-property-fix';

export interface RuleConfig {
	patterns: Pattern[];
}

const defaults: RuleConfig = {
	patterns: ['compiled-css-function'],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
