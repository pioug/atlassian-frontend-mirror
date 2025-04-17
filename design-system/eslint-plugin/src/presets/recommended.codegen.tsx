/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3d1a55011e92acf33daaf53e8bfc3532>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen
 */
import type { ESLint } from 'eslint';

export default {
	plugins: ['@atlaskit/design-system'],
	rules: {
		'@atlaskit/design-system/consistent-css-prop-usage': 'error',
		'@atlaskit/design-system/ensure-design-token-usage': 'error',
		'@atlaskit/design-system/icon-label': 'warn',
		'@atlaskit/design-system/no-banned-imports': 'error',
		'@atlaskit/design-system/no-boolean-autofocus-on-modal-dialog': 'warn',
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
		'@atlaskit/design-system/no-nested-styles': 'error',
		'@atlaskit/design-system/no-separator-with-list-elements': 'warn',
		'@atlaskit/design-system/no-unsafe-design-token-usage': 'error',
		'@atlaskit/design-system/no-unsafe-style-overrides': 'warn',
		'@atlaskit/design-system/no-unsupported-drag-and-drop-libraries': 'error',
		'@atlaskit/design-system/use-button-group-label': 'warn',
		'@atlaskit/design-system/use-cx-function-in-xcss': 'error',
		'@atlaskit/design-system/use-datetime-picker-calendar-button': 'warn',
		'@atlaskit/design-system/use-drawer-label': 'warn',
		'@atlaskit/design-system/use-heading-level-in-spotlight-card': 'warn',
		'@atlaskit/design-system/use-href-in-link-item': 'warn',
		'@atlaskit/design-system/use-latest-xcss-syntax': 'error',
		'@atlaskit/design-system/use-latest-xcss-syntax-typography': 'warn',
		'@atlaskit/design-system/use-menu-section-title': 'warn',
		'@atlaskit/design-system/use-modal-dialog-close-button': 'warn',
		'@atlaskit/design-system/use-onboarding-spotlight-label': 'warn',
		'@atlaskit/design-system/use-popup-label': 'warn',
		'@atlaskit/design-system/use-should-render-to-parent': 'warn',
		'@atlaskit/design-system/use-tag-group-label': 'warn',
		'@atlaskit/design-system/use-visually-hidden': 'error',
	},
} satisfies ESLint.ConfigData;
