import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

const error = (specifier: string) => ({
	messageId: 'noThirdPartyLayering',
	data: { specifier },
});

tester.run('no-third-party-layering', rule, {
	valid: [
		{
			name: 'Design System layering components',
			code: `
				import Popup from '@atlaskit/popup';
				import Tooltip from '@atlaskit/tooltip';
				import ModalDialog from '@atlaskit/modal-dialog';
			`,
		},
		{
			name: 'top-layer primitives',
			code: `
				import { Popover } from '@atlaskit/top-layer/popover';
				import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
			`,
		},
		{
			name: 'Design System layering packages are covered by other rules',
			code: `
				import { Popper } from '@atlaskit/popper';
				import Portal from '@atlaskit/portal';
				import { useLayering } from '@atlaskit/layering';
			`,
		},
		{
			name: 'packages whose name starts with a banned package name',
			code: `
				import a from 'react-popper-utils';
				import b from 'tippy.jsx';
				import c from '@floating-ui-like/dom';
				import d from 'react-modal-hook';
				import e from 'tethered';
			`,
		},
		{
			name: 'other packages from a headless component library',
			code: `
				import * as Switch from '@radix-ui/react-switch';
				import { VisuallyHidden } from '@reach/visually-hidden';
			`,
		},
		{
			name: 'module specifiers that are only known at runtime',
			code: `
				const library = 'react-popper';
				const loaded = require(library);
				const lazy = import(library);
			`,
		},
		{
			name: 'mocks',
			code: `
				jest.mock('react-popper', () => ({}));
				vi.mock('@floating-ui/dom', () => ({}));
			`,
		},
		{
			name: 'a call that is not require',
			code: `load('react-popper');`,
		},
		{
			name: 'a string that is not a module specifier',
			code: `const text = "import { usePopper } from 'react-popper'";`,
		},
	],
	invalid: [
		{
			name: 'default import',
			code: `import tippy from 'tippy.js';`,
			errors: [error('tippy.js')],
		},
		{
			name: 'named import',
			code: `import { usePopper } from 'react-popper';`,
			errors: [error('react-popper')],
		},
		{
			name: 'namespace import',
			code: `import * as Popover from '@radix-ui/react-popover';`,
			errors: [error('@radix-ui/react-popover')],
		},
		{
			name: 'side effect import',
			code: `import 'tippy.js';`,
			errors: [error('tippy.js')],
		},
		{
			name: 'subpath import',
			code: `import { createPopper } from '@popperjs/core/lib/popper-lite';`,
			errors: [error('@popperjs/core/lib/popper-lite')],
		},
		{
			name: 'any package in a banned scope',
			code: `
				import { computePosition } from '@floating-ui/dom';
				import { useFloating } from '@floating-ui/react';
			`,
			errors: [error('@floating-ui/dom'), error('@floating-ui/react')],
		},
		{
			name: 'named re-export',
			code: `export { usePopper } from 'react-popper';`,
			errors: [error('react-popper')],
		},
		{
			name: 'export all',
			// Two lines, so the "Prevent ExportAllDeclaration" ratchet does not count the sample code.
			code: `
				export *
					from 'react-portal';
			`,
			errors: [error('react-portal')],
		},
		{
			name: 'dynamic import',
			code: `const loaded = import('react-modal');`,
			errors: [error('react-modal')],
		},
		{
			name: 'require',
			code: `const Popper = require('popper.js');`,
			errors: [error('popper.js')],
		},
		{
			name: 'require with a template literal',
			code: 'const Tooltip = require(`react-tooltip`);',
			errors: [error('react-tooltip')],
		},
		{
			name: 'a multi-line import is reported from its first line',
			code: `import {\n\tusePopper,\n\tManager,\n} from 'react-popper';`,
			errors: [{ ...error('react-popper'), line: 1, endLine: 4 }],
		},
		{
			name: 'one report per import',
			code: `
				import { usePopper } from 'react-popper';
				import tippy from 'tippy.js';
				import { useFloating } from '@floating-ui/react';
			`,
			errors: [error('react-popper'), error('tippy.js'), error('@floating-ui/react')],
		},
	],
});

// @ts-expect-error -- `rule` doesn't work with `typescriptEslintTester`
typescriptEslintTester.run('no-third-party-layering', rule, {
	valid: [
		{
			code: `import type { PopupProps } from '@atlaskit/popup';`,
		},
	],
	invalid: [
		{
			code: `import type { Instance } from '@popperjs/core';`,
			errors: [error('@popperjs/core')],
		},
		{
			code: `export type { PopperProps } from 'react-popper';`,
			errors: [error('react-popper')],
		},
		{
			code: `const loaded = import('@floating-ui/dom');`,
			errors: [error('@floating-ui/dom')],
		},
	],
});
