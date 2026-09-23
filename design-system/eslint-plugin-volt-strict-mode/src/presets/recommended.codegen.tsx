/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d42395ae4e2b4c3cd09bbef59269990b>>
 * @codegenCommand afm workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
 */
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
	plugins: ['@atlaskit/volt-strict-mode'],
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
