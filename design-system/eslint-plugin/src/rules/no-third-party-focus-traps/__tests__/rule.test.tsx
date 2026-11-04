import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

const error = (specifier: string) => ({
	messageId: 'noThirdPartyFocusTraps',
	data: { specifier },
});

tester.run('no-third-party-focus-traps', rule, {
	valid: [
		{
			name: 'Design System layering components',
			code: `
				import ModalDialog from '@atlaskit/modal-dialog';
				import Drawer from '@atlaskit/drawer';
				import Popup from '@atlaskit/popup';
			`,
		},
		{
			name: 'top-layer primitives',
			code: `
				import { Dialog } from '@atlaskit/top-layer/dialog';
				import { Popover } from '@atlaskit/top-layer/popover';
			`,
		},
		{
			name: 'packages whose name starts with a banned package name',
			code: `
				import a from 'focus-trap-utils';
				import b from 'react-focus-lock-extra';
				import c from 'focus-locker';
			`,
		},
		{
			name: 'module specifiers that are only known at runtime',
			code: `
				const library = 'react-focus-lock';
				const loaded = require(library);
				const lazy = import(library);
			`,
		},
		{
			name: 'mocks',
			code: `
				jest.mock('react-focus-lock', () => ({}));
				vi.mock('focus-trap', () => ({}));
			`,
		},
		{
			name: 'a string that is not a module specifier',
			code: `const text = "import FocusLock from 'react-focus-lock'";`,
		},
	],
	invalid: [
		{
			name: 'default import',
			code: `import FocusLock from 'react-focus-lock';`,
			errors: [error('react-focus-lock')],
		},
		{
			name: 'named import',
			code: `import { createFocusTrap } from 'focus-trap';`,
			errors: [error('focus-trap')],
		},
		{
			name: 'each listed library',
			code: `
				import a from 'focus-lock';
				import b from 'focus-trap';
				import c from 'focus-trap-react';
				import d from 'react-focus-lock';
				import { FocusOn } from 'react-focus-on';
				import e from 'react-focus-trap';
			`,
			errors: [
				error('focus-lock'),
				error('focus-trap'),
				error('focus-trap-react'),
				error('react-focus-lock'),
				error('react-focus-on'),
				error('react-focus-trap'),
			],
		},
		{
			name: 'subpath import',
			code: `import { MoveFocusInside } from 'react-focus-lock/dist/es5/UI';`,
			errors: [error('react-focus-lock/dist/es5/UI')],
		},
		{
			name: 'side effect import',
			code: `import 'focus-trap';`,
			errors: [error('focus-trap')],
		},
		{
			name: 'named re-export',
			code: `export { default as FocusLock } from 'react-focus-lock';`,
			errors: [error('react-focus-lock')],
		},
		{
			name: 'export all',
			// Two lines, so the "Prevent ExportAllDeclaration" ratchet does not count the sample code.
			code: `
				export *
					from 'focus-trap';
			`,
			errors: [error('focus-trap')],
		},
		{
			name: 'dynamic import',
			code: `const loaded = import('react-focus-lock');`,
			errors: [error('react-focus-lock')],
		},
		{
			name: 'require',
			code: `const FocusTrap = require('focus-trap-react');`,
			errors: [error('focus-trap-react')],
		},
		{
			name: 'a multi-line import is reported from its first line',
			code: `import FocusLock, {\n\tAutoFocusInside,\n} from 'react-focus-lock';`,
			errors: [{ ...error('react-focus-lock'), line: 1, endLine: 3 }],
		},
	],
});

// @ts-expect-error -- `rule` doesn't work with `typescriptEslintTester`
typescriptEslintTester.run('no-third-party-focus-traps', rule, {
	valid: [
		{
			code: `import type { ModalDialogProps } from '@atlaskit/modal-dialog';`,
		},
	],
	invalid: [
		{
			code: `import type { ReactFocusLockProps } from 'react-focus-lock/interfaces';`,
			errors: [error('react-focus-lock/interfaces')],
		},
		{
			code: `export type { Options } from 'focus-trap';`,
			errors: [error('focus-trap')],
		},
		{
			code: `const loaded = import('focus-trap');`,
			errors: [error('focus-trap')],
		},
	],
});
