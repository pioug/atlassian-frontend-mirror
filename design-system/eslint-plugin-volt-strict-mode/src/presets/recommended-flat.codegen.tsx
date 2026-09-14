/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f093781717fb638c834816c790dcfc26>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
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
