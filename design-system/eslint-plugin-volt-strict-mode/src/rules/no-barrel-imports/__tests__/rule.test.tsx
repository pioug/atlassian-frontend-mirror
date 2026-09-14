jest.mock('@atlaskit/volt-components-entry-point-config', () => ({
	config: {
		'@atlaskit/flag': {
			'': {
				default: {
					'entry-point': '/flag',
					isDefaultExport: true,
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
				useFlags: {
					'entry-point': '/use-flags',
					name: 'useFlags',
					type: 'value',
					voltCompliant: true,
					consumersMigrated: false,
				},
				FlagProps: {
					'entry-point': '/types',
					name: 'FlagProps',
					type: 'type',
					voltCompliant: true,
					consumersMigrated: false,
				},
				UnmappedType: {
					name: 'UnmappedType',
					type: 'type',
					voltCompliant: false,
					consumersMigrated: false,
				},
				notReadySymbol: {
					'entry-point': '/not-ready',
					name: 'notReadySymbol',
					type: 'value',
					voltCompliant: false,
					consumersMigrated: false,
				},
				migratedSymbol: {
					'entry-point': '/migrated',
					name: 'migratedSymbol',
					type: 'value',
					voltCompliant: true,
					consumersMigrated: true,
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
			},
		},
		'@atlaskit/section-message': {
			'': {
				default: {
					'entry-point': '/section-message',
					isDefaultExport: true,
					name: 'SectionMessage',
					type: 'component',
					voltCompliant: false,
					consumersMigrated: false,
				},
				SectionMessageProps: {
					'entry-point': '/section-message',
					name: 'SectionMessageProps',
					type: 'type',
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
					consumersMigrated: false,
				},
				BoxProps: {
					'entry-point': '/box',
					name: 'BoxProps',
					type: 'type',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
			'/compiled': {
				Box: {
					'entry-point': '/compiled/box',
					name: 'Box',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
		},
		// The barrel renames what it re-exports, so the import form at the barrel does not
		// match the import form at the entry-point.
		'@atlaskit/icon': {
			'': {
				IconTile: {
					'entry-point': '/icon-tile',
					isDefaultExport: true,
					name: 'IconTile',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: false,
				},
				IconTileProps: {
					'entry-point': '/types',
					name: 'IconTileProps',
					type: 'type',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
		},
		'@atlaskit/lozenge': {
			'': {
				NewLozengeColor: {
					'entry-point': '/types',
					entryPointName: 'LozengeColor',
					name: 'NewLozengeColor',
					type: 'type',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
		},
		// Nested barrel that was previously missing from hardcoded attribute selectors —
		// Map-based listeners must still rewrite it.
		'@atlaskit/button': {
			'/split-button': {
				SplitButton: {
					'entry-point': '/split-button/split-button',
					name: 'SplitButton',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
		},
	},
}));

import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-barrel-imports',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			{
				name: 'already-correct entry-point import is ignored',
				code: `import Flag from '@atlaskit/flag/flag';`,
			},
			{
				name: 'package not in config is ignored',
				code: `import Something from '@atlaskit/unknown-package';`,
			},
			{
				name: 'side-effect barrel import with no specifiers is ignored',
				code: `import '@atlaskit/flag';`,
			},
			{
				name: 'symbol without a mapped entry-point is ignored',
				code: `import type { UnmappedType } from '@atlaskit/flag';`,
			},
			{
				name: 'voltCompliant:false symbol is ignored (package not suggestion-ready)',
				code: `import SectionMessage from '@atlaskit/section-message';`,
			},
			{
				name: 'mapped but voltCompliant:false symbol is ignored on an otherwise suggestion-ready barrel',
				code: `import { notReadySymbol } from '@atlaskit/flag';`,
			},
			{
				name: 'consumersMigrated:true symbol is ignored (owned by no-migrated-barrel-imports)',
				code: `import Spinner from '@atlaskit/spinner';`,
			},
			{
				name: 'consumersMigrated:true named symbol is ignored on an otherwise suggestion-ready barrel',
				code: `import { migratedSymbol } from '@atlaskit/flag';`,
			},
			{
				name: 'namespace import is ignored',
				code: `import * as Flag from '@atlaskit/flag';`,
			},
			{
				name: 'default alongside a namespace binding is left alone',
				code: `import Flag, * as All from '@atlaskit/flag';`,
			},
		],
		invalid: [
			{
				name: 'default import suggestion',
				code: `import Flag from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Flag from '@atlaskit/flag/flag';`,
							},
						],
					},
				],
			},
			{
				name: 'named import suggestion',
				code: `import { FlagGroup } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import { FlagGroup } from '@atlaskit/flag/flag-group';`,
							},
						],
					},
				],
			},
			{
				name: 'type-only import suggestion',
				code: `import type { FlagProps } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import type { FlagProps } from '@atlaskit/flag/types';`,
							},
						],
					},
				],
			},
			{
				name: 'type-only re-export suggestion',
				code: `export type { FlagProps } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `export type { FlagProps } from '@atlaskit/flag/types';`,
							},
						],
					},
				],
			},
			{
				name: 'mixed type and value split',
				code: `import Flag, { type FlagProps } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Flag from '@atlaskit/flag/flag';\nimport type { FlagProps } from '@atlaskit/flag/types';`,
							},
						],
					},
				],
			},
			{
				name: 'multi-symbol split across entry-points',
				code: `import Flag, { FlagGroup, useFlags } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Flag from '@atlaskit/flag/flag';\nimport { FlagGroup } from '@atlaskit/flag/flag-group';\nimport { useFlags } from '@atlaskit/flag/use-flags';`,
							},
						],
					},
				],
			},
			{
				name: 'compiled barrel maps to compiled entry-point',
				code: `import { Box } from '@atlaskit/primitives/compiled';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import { Box } from '@atlaskit/primitives/compiled/box';`,
							},
						],
					},
				],
			},
			{
				name: 'emotion primitives barrel maps to emotion entry-point',
				code: `import { Box } from '@atlaskit/primitives';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import { Box } from '@atlaskit/primitives/box';`,
							},
						],
					},
				],
			},
			{
				name: 'partial suggestion leaves warn-only / incomplete on barrel',
				code: `import Flag, { type UnmappedType } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Flag from '@atlaskit/flag/flag';\nimport type { UnmappedType } from '@atlaskit/flag';`,
							},
						],
					},
				],
			},
			{
				name: 'voltCompliant:false symbol stays on the barrel when another symbol is suggested',
				code: `import Flag, { notReadySymbol } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Flag from '@atlaskit/flag/flag';\nimport { notReadySymbol } from '@atlaskit/flag';`,
							},
						],
					},
				],
			},
			{
				name: 'consumersMigrated:true symbol stays on the barrel when another symbol is suggested',
				code: `import Flag, { migratedSymbol } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Flag from '@atlaskit/flag/flag';\nimport { migratedSymbol } from '@atlaskit/flag';`,
							},
						],
					},
				],
			},
			{
				name: 'preserves local alias on default import',
				code: `import MyFlag from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import MyFlag from '@atlaskit/flag/flag';`,
							},
						],
					},
				],
			},
			{
				name: 'named barrel export becomes a default import when the entry-point exports default',
				code: `import { IconTile, type IconTileProps } from '@atlaskit/icon';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import IconTile from '@atlaskit/icon/icon-tile';\nimport type { IconTileProps } from '@atlaskit/icon/types';`,
							},
						],
					},
				],
			},
			{
				name: 'aliased default import keeps its local name at the entry-point',
				code: `import { IconTile as Tile } from '@atlaskit/icon';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import Tile from '@atlaskit/icon/icon-tile';`,
							},
						],
					},
				],
			},
			{
				name: 'barrel rename is rewritten to the name the entry-point exports',
				code: `import { NewLozengeColor } from '@atlaskit/lozenge';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import { LozengeColor as NewLozengeColor } from '@atlaskit/lozenge/types';`,
							},
						],
					},
				],
			},
			{
				name: 'preserves named import alias',
				code: `import { FlagGroup as Group } from '@atlaskit/flag';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import { FlagGroup as Group } from '@atlaskit/flag/flag-group';`,
							},
						],
					},
				],
			},
			{
				name: 'nested barrel without a hardcoded attribute selector is still rewritten',
				code: `import { SplitButton } from '@atlaskit/button/split-button';`,
				errors: [
					{
						messageId: 'preferEntryPoint',
						suggestions: [
							{
								messageId: 'preferEntryPointSuggest',
								output: `import { SplitButton } from '@atlaskit/button/split-button/split-button';`,
							},
						],
					},
				],
			},
		],
	},
);
