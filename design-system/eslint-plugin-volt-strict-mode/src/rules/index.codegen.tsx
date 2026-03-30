/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a7f413162bb38e390f5fa7e4e037dd95>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
 */
import type { Rule } from 'eslint';

import noMultipleExports from './no-multiple-exports';
import noReExports from './no-re-exports';

export const rules: Record<string, Rule.RuleModule> = {
	'no-multiple-exports': noMultipleExports,
	'no-re-exports': noReExports,
};
