import type { AttributeSchema, TypographyTokenSchema } from '../../../src/types';

/**
 *
 * @example
 * ```js
 * {
 *   body: {
 *     value: {
 *       fontWeight: 500,
 *       fontSize: "16px",
 *       lineHeight: "22px",
 *       fontFamily: "Helvetica",
 *       fontStyle: "italic"
 *    },
 *    type: "typography"
 *}
 * ```
 */
const font: AttributeSchema<TypographyTokenSchema<any>> = {
	font: {
		code: {
			'[default]': {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description: 'For representing code only, either inline or in code blocks.',
				},
			},
		},
		heading: {
			xxlarge: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'For overlapping brand with product promotions, such as marketplace content. Migrate instances of H900 to Heading XXL.',
					responsiveSmallerVariant: 'font.heading.xlarge',
				},
			},
			xlarge: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'For overlapping brand with product promotions, such as marketplace content. Migrate instances of H800 to Heading XL.',
					responsiveSmallerVariant: 'font.heading.large',
				},
			},
			large: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'Product page titles, such as forms. Migrate instances of H700 to Heading L.',
					responsiveSmallerVariant: 'font.heading.medium',
				},
			},
			medium: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'Headers in large components, such as modal dialogs. Migrate instances of H600 to Heading M.',
					responsiveSmallerVariant: 'font.heading.small',
				},
			},
			small: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'For headers in small components where space is limited. Migrate instances of H500 to Heading S.',
				},
			},
			xsmall: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'For headers in small components where space is limited. Migrate instances of H400 to Heading XS.',
				},
			},
			xxsmall: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'For headers in fine print or tight spaces. Use sparingly. Migrate instances of H100, H200 and H300 to Heading XXS.',
				},
			},
		},
		body: {
			large: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description: 'For long-form text, such as in blogs.',
				},
			},
			small: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'Use in secondary level content such as fine print or semantic messaging. Use sparingly. Migrate instances of Small text to Body S.',
				},
			},
			UNSAFE_small: {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'UNSAFE - Do not use. Temporary 12px fontsize token. Will be deprecated and replaced with stable small token',
				},
			},
			'[default]': {
				attributes: {
					group: 'typography',
					state: 'active',
					introduced: '1.14.0',
					description:
						'Use in short descriptions or labels. The default size for text in components. Migrate instances of Paragraph Default and UI Text to Body M.',
				},
			},
		},
	},
};

export default font;
