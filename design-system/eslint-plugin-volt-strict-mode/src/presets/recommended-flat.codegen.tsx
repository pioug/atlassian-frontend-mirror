/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::286ead5ccc36610e29396f5c5a6b0598>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
 */
import type { Linter } from 'eslint';

const config: Linter.FlatConfig = {
	plugins: {
		// NOTE: The reference to this plugin is inserted dynamically while creating the plugin in `index.codegen.tsx`
	},
	rules: {
		'@atlaskit/volt-strict-mode/no-multiple-exports': 'warn',
		'@atlaskit/volt-strict-mode/no-re-exports': 'warn',
	},
};

export default config;
