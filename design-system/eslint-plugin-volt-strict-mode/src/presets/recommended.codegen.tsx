/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::646577def73c3f3d33196deeb4eba182>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
 */
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
	plugins: ['@atlaskit/volt-strict-mode'],
	rules: {
		'@atlaskit/volt-strict-mode/no-multiple-exports': 'warn',
		'@atlaskit/volt-strict-mode/no-re-exports': 'warn',
	},
};

export default config;
