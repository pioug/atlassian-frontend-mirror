import outdent from 'outdent';

import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

// @ts-expect-error -- `rule` doesn't work with `typescriptEslintTester`
typescriptEslintTester.run('no-atlaskit-theme', rule, {
	valid: [
		{
			name: 'tokens import',
			code: outdent`
				import { token } from '@atlaskit/tokens';
			`,
		},
		{
			name: 'string literal equal to the package name',
			code: outdent`
				const source = '@atlaskit/theme';
			`,
		},
		{
			name: 'package name mentioned inside a longer string',
			code: outdent`
				const note = 'migrate off @atlaskit/theme';
			`,
		},
		{
			name: 'require call',
			code: outdent`
				const theme = require('@atlaskit/theme');
			`,
		},
		{
			name: 'dynamic import',
			code: outdent`
				const loaded = import('@atlaskit/theme');
			`,
		},
	],
	invalid: [
		{
			name: 'named import from the package root',
			code: outdent`
				import { gridSize } from '@atlaskit/theme';
			`,
			errors: [{ messageId: 'no-atlaskit-theme' }],
		},
		{
			name: 'default import from a subpath',
			code: outdent`
				import Theme from '@atlaskit/theme/theme';
			`,
			errors: [{ messageId: 'no-atlaskit-theme' }],
		},
		{
			name: 'side-effect import',
			code: outdent`
				import '@atlaskit/theme';
			`,
			errors: [{ messageId: 'no-atlaskit-theme' }],
		},
		{
			name: 'type import from a subpath',
			code: outdent`
				import type { ThemeProp } from '@atlaskit/theme/create-theme';
			`,
			errors: [{ messageId: 'no-atlaskit-theme' }],
		},
		{
			name: 'multiple imports',
			code: outdent`
				import { layers } from '@atlaskit/theme';
				import { gridSize } from '@atlaskit/theme/constants';
			`,
			errors: [{ messageId: 'no-atlaskit-theme' }, { messageId: 'no-atlaskit-theme' }],
		},
	],
});
