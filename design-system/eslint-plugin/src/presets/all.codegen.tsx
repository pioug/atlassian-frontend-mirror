/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::29cc321a798c65c8464afd9e46366540>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen
 */
import type { ESLint } from 'eslint';

export default {
	plugins: ['@atlaskit/design-system'],
	rules: {
		'@atlaskit/design-system/consistent-css-prop-usage': 'error',
		'@atlaskit/design-system/ensure-design-token-usage': 'error',
		'@atlaskit/design-system/ensure-design-token-usage/preview': 'warn',
		'@atlaskit/design-system/ensure-icon-color': 'error',
		'@atlaskit/design-system/icon-label': 'warn',
		'@atlaskit/design-system/no-banned-imports': 'error',
		'@atlaskit/design-system/no-boolean-autofocus-on-modal-dialog': 'warn',
		'@atlaskit/design-system/no-css-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-custom-icons': 'warn',
		'@atlaskit/design-system/no-dark-theme-vr-tests': 'error',
		'@atlaskit/design-system/no-deprecated-apis': 'error',
		'@atlaskit/design-system/no-deprecated-design-token-usage': 'warn',
		'@atlaskit/design-system/no-deprecated-imports': 'error',
		'@atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop': 'error',
		'@atlaskit/design-system/no-html-anchor': 'warn',
		'@atlaskit/design-system/no-html-button': 'warn',
		'@atlaskit/design-system/no-invalid-css-map': [
			'error',
			{
				allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
			},
		],
		'@atlaskit/design-system/no-keyframes-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-legacy-icons': 'warn',
		'@atlaskit/design-system/no-margin': 'warn',
		'@atlaskit/design-system/no-nested-styles': 'error',
		'@atlaskit/design-system/no-physical-properties': 'error',
		'@atlaskit/design-system/no-separator-with-list-elements': 'warn',
		'@atlaskit/design-system/no-styled-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-unsafe-design-token-usage': 'error',
		'@atlaskit/design-system/no-unsafe-style-overrides': 'warn',
		'@atlaskit/design-system/no-unsupported-drag-and-drop-libraries': 'error',
		'@atlaskit/design-system/prefer-primitives': 'warn',
		'@atlaskit/design-system/use-button-group-label': 'warn',
		'@atlaskit/design-system/use-datetime-picker-calendar-button': 'warn',
		'@atlaskit/design-system/use-drawer-label': 'warn',
		'@atlaskit/design-system/use-heading': 'warn',
		'@atlaskit/design-system/use-heading-level-in-spotlight-card': 'warn',
		'@atlaskit/design-system/use-href-in-link-item': 'warn',
		'@atlaskit/design-system/use-latest-xcss-syntax': 'error',
		'@atlaskit/design-system/use-latest-xcss-syntax-typography': 'warn',
		'@atlaskit/design-system/use-menu-section-title': 'warn',
		'@atlaskit/design-system/use-modal-dialog-close-button': 'warn',
		'@atlaskit/design-system/use-onboarding-spotlight-label': 'warn',
		'@atlaskit/design-system/use-popup-label': 'warn',
		'@atlaskit/design-system/use-primitives': 'warn',
		'@atlaskit/design-system/use-primitives-text': 'warn',
		'@atlaskit/design-system/use-tag-group-label': 'warn',
		'@atlaskit/design-system/use-tokens-space': 'error',
		'@atlaskit/design-system/use-tokens-typography': 'warn',
		'@atlaskit/design-system/use-visually-hidden': 'error',
	},
} satisfies ESLint.ConfigData;
