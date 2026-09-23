/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::23ba3c41bbe2238d914f4103d504c50c>>
 * @codegenCommand afm workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
 */
import type { Linter } from 'eslint';

const config: Linter.FlatConfig = {
	plugins: {
		// NOTE: The reference to this plugin is inserted dynamically while creating the plugin in `index.codegen.tsx`
	},
	rules: {
		'@atlaskit/volt-strict-mode/no-barrel-imports': 'warn',
		'@atlaskit/volt-strict-mode/no-migrated-barrel-imports': 'error',
		'@atlaskit/volt-strict-mode/no-multiple-exports': [
			'warn',
			{
				allowPrimitiveExports: true,
			},
		],
		'@atlaskit/volt-strict-mode/no-re-exports': 'warn',
	},
};

export default config;
