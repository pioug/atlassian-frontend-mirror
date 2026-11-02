import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-native-popover-or-dialog', rule, {
	valid: [
		{
			name: 'Design System components',
			code: `
				import Popup from '@atlaskit/popup';
				import ModalDialog from '@atlaskit/modal-dialog';

				<>
					<Popup isOpen content={() => null} trigger={() => null} />
					<ModalDialog onClose={onClose}>hi</ModalDialog>
				</>
			`,
		},
		{
			name: 'top-layer primitives',
			code: `
				import { Popover } from '@atlaskit/top-layer/popover';
				import { Dialog } from '@atlaskit/top-layer/dialog';

				<>
					<Popover mode="manual" isOpen>hi</Popover>
					<Dialog isOpen onClose={onClose}>hi</Dialog>
				</>
			`,
		},
		{
			name: 'a component with its own `popover` prop',
			code: `<ElementBridge anchor={reference} popover={popover} />`,
		},
		{
			name: 'a member expression component with a `popover` prop',
			code: `<Layers.Item popover="auto" />`,
		},
		{
			name: 'a component named Dialog',
			code: `<Dialog>hi</Dialog>`,
		},
		{
			name: 'other popover attributes',
			code: `<button popoverTarget="menu">Open</button>`,
		},
		{
			name: 'other elements',
			code: `document.createElement('div')`,
		},
		{
			name: 'other attributes',
			code: `element.setAttribute('role', 'dialog')`,
		},
		{
			name: 'a dynamic attribute name',
			code: `element.setAttribute(name, 'auto')`,
		},
		{
			name: 'reading the popover property',
			code: `const isAuto = element.popover === 'auto';`,
		},
		{
			name: 'assigning a non-string value to a popover property',
			code: `state.popover = element;`,
		},
		{
			name: 'assigning a variable to a popover property',
			code: `element.popover = mode;`,
		},
		{
			name: 'creating another element with the JSX runtime',
			code: `jsx('div', { children })`,
		},
		{
			name: 'spread props only known at runtime',
			code: `<div {...props}>hi</div>`,
		},
		{
			name: 'spread props with popover on a component',
			code: `<Layer {...{ popover: 'auto' }} />`,
		},
		{
			name: 'createElement with other props',
			code: `createElement('div', { className: 'menu' })`,
		},
		{
			name: 'createElement of a component with a popover prop',
			code: `createElement(ElementBridge, { popover })`,
		},
		{
			name: 'styled with another element',
			code: 'const Box = styled.div`padding: 0;`;',
		},
		{
			name: 'a dialog property on another object',
			code: `const Modal = components.dialog;`,
		},
		{
			name: 'a React context API named showModal',
			code: `dialogs.showModal(MovePageDialog, { contentId })`,
		},
	],
	invalid: [
		{
			name: '<dialog>',
			code: `<dialog ref={ref}>hi</dialog>`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'self-closing <dialog />',
			code: `<dialog open />`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'popover attribute',
			code: `<div popover="auto">hi</div>`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'boolean popover attribute',
			code: `<div popover>hi</div>`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'popover attribute with an expression',
			code: `<span popover={mode}>hi</span>`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'popover attribute on a wrapper such as motion.div',
			code: `<motion.div popover="auto">hi</motion.div>`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: '<motion.dialog>',
			code: `<motion.dialog open>hi</motion.dialog>`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'popover attribute on a custom element',
			code: `<my-element popover="manual" />`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'popover attribute on a <dialog>',
			code: `<dialog popover="manual" />`,
			errors: [{ messageId: 'noNativeDialog' }, { messageId: 'noNativePopover' }],
		},
		{
			name: 'createElement("dialog")',
			code: `document.createElement('dialog')`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'createElement with a template literal',
			code: 'document.createElement(`DIALOG`)',
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'React.createElement("dialog")',
			code: `React.createElement('dialog', { open: true })`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'bare createElement("dialog")',
			code: `
				import { createElement } from 'react';

				createElement('dialog', { open: true });
			`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'jsx("dialog") from the JSX runtime',
			code: `jsx('dialog', { children })`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'spread object with popover',
			code: `<div {...{ popover: 'auto' }}>hi</div>`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'conditional spread object with popover',
			code: `<div {...(isOpen ? { popover: 'manual' } : {})}>hi</div>`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'createElement("div", { popover })',
			code: `createElement('div', { popover })`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'React.createElement("div", { popover: "auto" })',
			code: `React.createElement('div', { popover: 'auto' }, children)`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'jsx("div", { popover: "hint" })',
			code: `jsx('div', { 'popover': 'hint', children })`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'styled.dialog template',
			code: 'const Surface = styled.dialog`padding: 0;`;',
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'styled.dialog object',
			code: `const Surface = styled.dialog({ padding: 0 });`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'styled("dialog")',
			code: `const Surface = styled('dialog')({ padding: 0 });`,
			errors: [{ messageId: 'noNativeDialog' }],
		},
		{
			name: 'setAttribute("popover")',
			code: `element.setAttribute('popover', 'manual')`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'optional setAttribute("popover")',
			code: `element?.setAttribute('popover', 'manual')`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'toggleAttribute("popover")',
			code: `element.toggleAttribute('popover')`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'computed setAttribute',
			code: `element['setAttribute']('popover', '')`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'popover property',
			code: `tooltip.popover = 'hint';`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'popover property from a ternary',
			code: `tooltip.popover = isHint ? 'hint' : 'auto';`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			name: 'computed popover property',
			code: `tooltip['popover'] = 'auto';`,
			errors: [{ messageId: 'noNativePopover' }],
		},
	],
});

// @ts-expect-error -- `rule` doesn't work with `typescriptEslintTester`
typescriptEslintTester.run('no-native-popover-or-dialog', rule, {
	valid: [
		{
			code: `element.popover = mode as string;`,
		},
	],
	invalid: [
		{
			code: `tooltip.popover = 'hint' as const;`,
			errors: [{ messageId: 'noNativePopover' }],
		},
		{
			code: `tooltip.popover = 'auto' satisfies string;`,
			errors: [{ messageId: 'noNativePopover' }],
		},
	],
});
