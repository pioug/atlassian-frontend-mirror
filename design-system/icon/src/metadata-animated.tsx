/**
 * Metadata for the animated icons in `src/animated`, shown in the Icon Explorer on the Animated icon page.
 *
 * Unlike `metadata-core`, this file is written by hand. Every animated icon must have an entry, keyed by its
 * file name in `src/animated`; a unit test enforces this.
 */
export interface AnimatedIconMetadata {
	/**
	 * Default component name for the icon
	 */
	componentName: string;

	/**
	 * Package path to the icon component
	 */
	package: string;

	/**
	 * Single purpose icons should only be used for the purposes listed in `usage`.
	 */
	categorization: 'single-purpose' | 'multi-purpose';

	/**
	 * Usage guidelines for the icon
	 */
	usage?: string;

	/**
	 * Additional keywords used to assist in search/lookup of an icon
	 */
	keywords: string[];

	/**
	 * The name of the team owning the icon
	 */
	team: string;

	/**
	 * The status of the icon
	 */
	status?: 'draft' | 'ready-to-publish' | 'published' | 'modified' | 'deprecated';
}

// TODO(DSP-26149): placeholder values, to be replaced with the confirmed metadata for each icon.
const metadata: Record<string, AnimatedIconMetadata> = {
	'ai-generative-remove-silence': {
		keywords: ['ai-generative-remove-silence', 'remove silence', 'silence', 'audio', 'AI'],
		componentName: 'AiGenerativeRemoveSilenceIcon',
		package: '@atlaskit/icon/animated/ai-generative-remove-silence',
		categorization: 'single-purpose',
		team: 'Design System Team',
		status: 'published',
	},
	'ai-generative-text': {
		keywords: ['ai-generative-text', 'write', 'draft', 'pencil', 'AI'],
		componentName: 'AiGenerativeTextIcon',
		package: '@atlaskit/icon/animated/ai-generative-text',
		categorization: 'single-purpose',
		team: 'Design System Team',
		status: 'published',
	},
	'ai-generative-text-summary': {
		keywords: ['ai-generative-text-summary', 'summarize', 'summarise', 'summary', 'AI'],
		componentName: 'AiGenerativeTextSummaryIcon',
		package: '@atlaskit/icon/animated/ai-generative-text-summary',
		categorization: 'single-purpose',
		team: 'Design System Team',
		status: 'published',
	},
	'ai-search': {
		keywords: ['ai-search', 'search', 'find', 'lens', 'AI'],
		componentName: 'AiSearchIcon',
		package: '@atlaskit/icon/animated/ai-search',
		categorization: 'single-purpose',
		team: 'Design System Team',
		status: 'published',
	},
	'magic-wand': {
		keywords: ['magic-wand', 'magic', 'wand', 'suggestion'],
		componentName: 'MagicWandIcon',
		package: '@atlaskit/icon/animated/magic-wand',
		categorization: 'multi-purpose',
		team: 'Design System Team',
		status: 'published',
	},
	signature: {
		keywords: ['signature', 'sign', 'handwriting'],
		componentName: 'SignatureIcon',
		package: '@atlaskit/icon/animated/signature',
		categorization: 'single-purpose',
		team: 'Design System Team',
		status: 'published',
	},
	'text-review': {
		keywords: ['text-review', 'review', 'check', 'proofread', 'AI'],
		componentName: 'TextReviewIcon',
		package: '@atlaskit/icon/animated/text-review',
		categorization: 'single-purpose',
		team: 'Design System Team',
		status: 'published',
	},
};

export default metadata;
