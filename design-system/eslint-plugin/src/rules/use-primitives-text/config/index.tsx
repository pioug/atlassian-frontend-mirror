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
	enableUnsafeAutofix: boolean;
}

const defaults: RuleConfig = {
	patterns: ['paragraph-elements', 'span-elements', 'strong-elements', 'emphasis-elements'],
	inheritColor: false,
	enableUnsafeAutofix: false,
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaults, overrides);
};
