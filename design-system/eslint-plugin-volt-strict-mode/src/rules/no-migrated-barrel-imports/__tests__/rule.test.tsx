jest.mock('@atlaskit/volt-components-entry-point-config', () => ({
	config: {
		'@atlaskit/flag': {
			'': {
				default: {
					'entry-point': '/flag',
					name: 'Flag',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: false,
				},
				FlagGroup: {
					'entry-point': '/flag-group',
					name: 'FlagGroup',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
		},
		'@atlaskit/spinner': {
			'': {
				default: {
					'entry-point': '/spinner',
					isDefaultExport: true,
					name: 'Spinner',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: true,
				},
				SpinnerProps: {
					'entry-point': '/types',
					name: 'SpinnerProps',
					type: 'type',
					voltCompliant: true,
					consumersMigrated: true,
				},
				notReadySymbol: {
					'entry-point': '/not-ready',
					name: 'notReadySymbol',
					type: 'value',
					voltCompliant: false,
					consumersMigrated: false,
				},
			},
		},
		'@atlaskit/primitives': {
			'': {
				Box: {
					'entry-point': '/box',
					name: 'Box',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: true,
				},
			},
			'/compiled': {
				Box: {
					'entry-point': '/compiled/box',
					name: 'Box',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: true,
				},
			},
		},
		'@atlaskit/section-message': {
			'': {
				default: {
					'entry-point': '/section-message',
					name: 'SectionMessage',
					type: 'component',
					voltCompliant: false,
					consumersMigrated: false,
				},
			},
		},
	},
}));

import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-migrated-barrel-imports',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			{
				name: 'already-correct entry-point import is ignored',
				code: `import Spinner from '@atlaskit/spinner/spinner';`,
			},
			{
				name: 'voltCompliant Stage 1 barrel is ignored (owned by no-barrel-imports)',
				code: `import Flag from '@atlaskit/flag';`,
			},
			{
				name: 'voltCompliant:false symbol is ignored',
				code: `import SectionMessage from '@atlaskit/section-message';`,
			},
			{
				name: 'mapped but consumersMigrated:false symbol is ignored on an otherwise migrated barrel',
				code: `import { notReadySymbol } from '@atlaskit/spinner';`,
			},
			{
				name: 'namespace import is ignored',
				code: `import * as Spinner from '@atlaskit/spinner';`,
			},
			{
				name: 'side-effect barrel import with no specifiers is ignored',
				code: `import '@atlaskit/spinner';`,
			},
		],
		invalid: [
			{
				name: 'default import autofix for consumersMigrated package',
				code: `import Spinner from '@atlaskit/spinner';`,
				output: `import Spinner from '@atlaskit/spinner/spinner';`,
				errors: [{ messageId: 'preferEntryPoint' }],
			},
			{
				name: 'type-only import autofix',
				code: `import type { SpinnerProps } from '@atlaskit/spinner';`,
				output: `import type { SpinnerProps } from '@atlaskit/spinner/types';`,
				errors: [{ messageId: 'preferEntryPoint' }],
			},
			{
				name: 'type-only re-export autofix',
				code: `export type { SpinnerProps } from '@atlaskit/spinner';`,
				output: `export type { SpinnerProps } from '@atlaskit/spinner/types';`,
				errors: [{ messageId: 'preferEntryPoint' }],
			},
			{
				name: 'compiled barrel maps to compiled entry-point',
				code: `import { Box } from '@atlaskit/primitives/compiled';`,
				output: `import { Box } from '@atlaskit/primitives/compiled/box';`,
				errors: [{ messageId: 'preferEntryPoint' }],
			},
			{
				name: 'partial autofix leaves non-migrated symbols on barrel',
				code: `import Spinner, { notReadySymbol } from '@atlaskit/spinner';`,
				output: `import Spinner from '@atlaskit/spinner/spinner';\nimport { notReadySymbol } from '@atlaskit/spinner';`,
				errors: [{ messageId: 'preferEntryPoint' }],
			},
		],
	},
);
