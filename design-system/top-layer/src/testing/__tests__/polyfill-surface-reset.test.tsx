/**
 * `Popover` and `Dialog` reset `pointer-events` to `auto` on the host with a `:defined` rule. jsdom
 * cannot match `:defined`, so the polyfill models the reset in `getComputedStyle()`. In Chrome, a
 * host inside a `pointer-events: none` ancestor and its content can be clicked.
 */
import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import '../polyfill';

const containers: HTMLElement[] = [];

function mount({ html }: { html: string }) {
	const container = document.createElement('div');
	// Test fixture markup only.
	container.innerHTML = html;
	containers.push(container);
	document.body.appendChild(container);
}

function getElement({ id }: { id: string }): HTMLElement {
	return screen.getByTestId(id);
}

function getPointerEvents({ id }: { id: string }): string {
	return window.getComputedStyle(getElement({ id })).pointerEvents;
}

// The hooks are in a describe block, so that they run before the automatic accessibility check.
describe('polyfill layer surface reset', () => {
	const user = userEvent.setup();

	afterEach(() => {
		screen.queryAllByTestId(/./).forEach((element) => {
			if (element instanceof HTMLDialogElement) {
				element.close();
				return;
			}
			if (element.hasAttribute('popover') && element.hasAttribute('data-popover-open')) {
				element.hidePopover();
			}
		});
		containers.splice(0).forEach((container) => container.remove());
	});

	it('reports pointer-events: auto for an open popover in a pointer-events: none ancestor', async () => {
		mount({
			html: '<div style="pointer-events: none"><div popover="manual" data-testid="popover"><span><button data-testid="button">Button</button></span></div></div>',
		});
		const onClick = jest.fn();
		const unbind = bind(getElement({ id: 'button' }), { type: 'click', listener: onClick });

		getElement({ id: 'popover' }).showPopover();

		expect(getPointerEvents({ id: 'popover' })).toBe('auto');
		expect(getPointerEvents({ id: 'button' })).toBe('auto');
		await user.click(getElement({ id: 'button' }));
		expect(onClick).toHaveBeenCalledTimes(1);
		unbind();
	});

	it('reports pointer-events: auto for content in an open dialog in a pointer-events: none ancestor', () => {
		mount({
			html: '<div style="pointer-events: none"><dialog data-testid="dialog"><button data-testid="button">Button</button></dialog></div>',
		});

		(getElement({ id: 'dialog' }) as HTMLDialogElement).show();

		expect(getPointerEvents({ id: 'button' })).toBe('auto');
	});

	it('keeps pointer-events: none that is set inside the popover', () => {
		mount({
			html: '<style>.no-pointer { pointer-events: none; }</style><div style="pointer-events: none"><div popover="manual" data-testid="popover"><span class="no-pointer"><button data-testid="by-rule">Rule</button></span><button style="pointer-events: none" data-testid="inline">Inline</button></div></div>',
		});

		getElement({ id: 'popover' }).showPopover();

		expect(getPointerEvents({ id: 'by-rule' })).toBe('none');
		expect(getPointerEvents({ id: 'inline' })).toBe('none');
	});

	it('keeps an inline pointer-events value on the host', () => {
		mount({
			html: '<div popover="manual" style="pointer-events: none" data-testid="popover"><button data-testid="button">Button</button></div>',
		});

		getElement({ id: 'popover' }).showPopover();

		expect(getPointerEvents({ id: 'popover' })).toBe('none');
		expect(getPointerEvents({ id: 'button' })).toBe('none');
	});

	it('does not change a closed popover or content outside a layer', () => {
		mount({
			html: '<div style="pointer-events: none"><div popover="manual" data-testid="popover"><button data-testid="in-popover">In popover</button></div><button data-testid="outside">Outside</button></div>',
		});

		expect(getPointerEvents({ id: 'popover' })).toBe('none');
		expect(getPointerEvents({ id: 'outside' })).toBe('none');
	});
});
