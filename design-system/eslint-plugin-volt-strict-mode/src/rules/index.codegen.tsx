/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c2b98f3e1dc6728f1518cc50ce273bc2>>
 * @codegenCommand afm workspace @atlaskit/eslint-plugin-volt-strict-mode codegen
 */
import type { Rule } from 'eslint';

import noBarrelImports from './no-barrel-imports';
import noMigratedBarrelImports from './no-migrated-barrel-imports';
import noMultipleExports from './no-multiple-exports';
import noReExports from './no-re-exports';

export const rules: Record<string, Rule.RuleModule> = {
	'no-barrel-imports': noBarrelImports,
	'no-migrated-barrel-imports': noMigratedBarrelImports,
	'no-multiple-exports': noMultipleExports,
	'no-re-exports': noReExports,
};
