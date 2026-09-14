import { getFirstFocusable } from '../../src/focus/get-first-focusable';
import { getLastFocusable } from '../../src/focus/get-last-focusable';
import { getNextFocusable } from '../../src/focus/get-next-focusable';

// focus helpers unit tests

describe('focusable helpers', () => {
	const originalCheckVisibility = Object.getOwnPropertyDescriptor(
		Element.prototype,
		'checkVisibility',
	);

	function isVisible(element: Element): boolean {
		const { display, visibility } = getComputedStyle(element);
		if (display === 'none' || visibility === 'hidden' || visibility === 'collapse') {
			return false;
		}
		if (element.parentElement) {
			return isVisible(element.parentElement);
		}
		return true;
	}

	beforeAll(() => {
		Object.defineProperty(Element.prototype, 'checkVisibility', {
			configurable: true,
			value: function checkVisibility(this: Element) {
				return isVisible(this);
			},
		});
	});

	afterAll(() => {
		if (originalCheckVisibility) {
			Object.defineProperty(Element.prototype, 'checkVisibility', originalCheckVisibility);
			return;
		}
		Reflect.deleteProperty(Element.prototype, 'checkVisibility');
	});

	function createContainer(html: string): HTMLElement {
		const div = document.createElement('div');
		div.innerHTML = html;
		document.body.appendChild(div);
		return div;
	}

	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('getFirstFocusable', () => {
		it('returns the first focusable element', () => {
			const container = createContainer(`
				<button>First</button>
				<button>Second</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).not.toBeNull();
			expect(result).toHaveTextContent('First');
		});

		it('skips disabled elements', () => {
			const container = createContainer(`
				<button disabled>Disabled</button>
				<button>Enabled</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).toHaveTextContent('Enabled');
		});

		it('skips elements disabled by a fieldset', () => {
			const container = createContainer(`
				<fieldset disabled>
					<button>Disabled</button>
				</fieldset>
				<button>Enabled</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).toHaveTextContent('Enabled');
		});

		it('includes elements in the first legend of a disabled fieldset', () => {
			const container = createContainer(`
				<fieldset disabled>
					<legend><button>Legend action</button></legend>
					<button>Disabled</button>
				</fieldset>
				<button>After fieldset</button>
			`);

			const first = getFirstFocusable({ container });
			first?.focus();
			const next = getNextFocusable({ container, direction: 'forwards' });

			expect(first).toHaveTextContent('Legend action');
			expect(next).toHaveTextContent('After fieldset');
		});

		it('skips elements in an inert subtree', () => {
			const container = createContainer(`
				<div inert>
					<button>Inert</button>
				</div>
				<button>Enabled</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).toHaveTextContent('Enabled');
		});

		it('skips aria-disabled elements', () => {
			const container = createContainer(`
				<button aria-disabled="true">Disabled</button>
				<button>Enabled</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).toHaveTextContent('Enabled');
		});

		it('skips tabindex="-1" elements', () => {
			const container = createContainer(`
				<button tabindex="-1">Hidden</button>
				<button>Visible</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).toHaveTextContent('Visible');
		});

		it('returns null for empty container', () => {
			const container = createContainer('<div></div>');
			const result = getFirstFocusable({ container });
			expect(result).toBeNull();
		});

		it('returns null when all elements are disabled', () => {
			const container = createContainer(`
				<button disabled>A</button>
				<button aria-disabled="true">B</button>
			`);
			const result = getFirstFocusable({ container });
			expect(result).toBeNull();
		});

		it('skips aria-hidden elements', () => {
			const container = createContainer(`
				<button aria-hidden="true">Hidden</button>
				<button>Visible</button>
			`);

			const result = getFirstFocusable({ container });

			expect(result).toHaveTextContent('Visible');
		});
	});

	describe('getLastFocusable', () => {
		it('returns the last focusable element', () => {
			const container = createContainer(`
				<button>First</button>
				<button>Second</button>
				<button>Third</button>
			`);

			const result = getLastFocusable({ container });

			expect(result).toHaveTextContent('Third');
		});

		it('skips disabled elements at the end', () => {
			const container = createContainer(`
				<button>First</button>
				<button>Second</button>
				<button disabled>Third</button>
			`);

			const result = getLastFocusable({ container });

			expect(result).toHaveTextContent('Second');
		});

		it('returns null for empty container', () => {
			const container = createContainer('');

			const result = getLastFocusable({ container });

			expect(result).toBeNull();
		});
	});

	describe('getNextFocusable', () => {
		it('returns the next element forwards', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button>C</button>
			`);
			const buttons = container.querySelectorAll('button');
			(buttons[0] as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('B');
		});

		it('returns the first tabbable element when the container is focused', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
			`);
			container.tabIndex = -1;
			container.focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('A');
		});

		it('returns the last tabbable element when moving backwards from the focused container', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
			`);
			container.tabIndex = -1;
			container.focus();

			const result = getNextFocusable({ container, direction: 'backwards' });

			expect(result).toHaveTextContent('B');
		});

		it('returns the next tabbable element after a focused tabindex="-1" element', () => {
			const container = createContainer(`
				<button>A</button>
				<button tabindex="-1">Programmatically focused</button>
				<button>B</button>
			`);
			const current = container.querySelector('[tabindex="-1"]');
			(current as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('B');
		});

		it('returns the previous tabbable element before a focused tabindex="-1" element', () => {
			const container = createContainer(`
				<button>A</button>
				<button tabindex="-1">Programmatically focused</button>
				<button>B</button>
			`);
			const current = container.querySelector('[tabindex="-1"]');
			(current as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'backwards' });

			expect(result).toHaveTextContent('A');
		});

		it('does not move focus into a tabindex="-1" element', () => {
			const container = createContainer(`
				<button>A</button>
				<button tabindex="-1">Skip</button>
				<button>B</button>
			`);
			const buttons = container.querySelectorAll('button');

			(buttons[0] as HTMLElement).focus();
			const forwards = getNextFocusable({ container, direction: 'forwards' });

			(buttons[2] as HTMLElement).focus();
			const backwards = getNextFocusable({ container, direction: 'backwards' });

			expect(forwards).toHaveTextContent('B');
			expect(backwards).toHaveTextContent('A');
		});

		it('navigates relative to an element excluded by a custom filter', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button>C</button>
			`);
			const current = Array.from(container.querySelectorAll('button')).find(
				(element) => element.textContent === 'B',
			);
			(current as HTMLElement).focus();
			const filter = (element: HTMLElement) => element !== current;

			const forwards = getNextFocusable({ container, direction: 'forwards', filter });
			const backwards = getNextFocusable({ container, direction: 'backwards', filter });

			expect(forwards).toHaveTextContent('C');
			expect(backwards).toHaveTextContent('A');
		});

		it('wraps when the focused element is excluded at the custom filter boundaries', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button>C</button>
			`);
			const buttons = container.querySelectorAll('button');
			const first = buttons[0];
			const last = buttons[2];
			(first as HTMLElement).focus();

			const backwards = getNextFocusable({
				container,
				direction: 'backwards',
				filter: (element) => element !== first,
			});

			(last as HTMLElement).focus();
			const forwards = getNextFocusable({
				container,
				direction: 'forwards',
				filter: (element) => element !== last,
			});

			expect(backwards).toHaveTextContent('C');
			expect(forwards).toHaveTextContent('A');
		});

		it('navigates relative to a non-tabbable origin inside nested markup', () => {
			const container = createContainer(`
				<button>A</button>
				<div><span><input tabindex="-1" /></span></div>
				<button>B</button>
			`);
			const current = container.querySelector('[tabindex="-1"]');
			(current as HTMLElement).focus();

			const forwards = getNextFocusable({ container, direction: 'forwards' });
			const backwards = getNextFocusable({ container, direction: 'backwards' });

			expect(forwards).toHaveTextContent('B');
			expect(backwards).toHaveTextContent('A');
		});

		it('wraps backwards from a non-tabbable origin before the first tabbable element', () => {
			const container = createContainer(`
				<button tabindex="-1">Programmatically focused</button>
				<button>A</button>
				<button>B</button>
			`);
			const current = container.querySelector('[tabindex="-1"]');
			(current as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'backwards' });

			expect(result).toHaveTextContent('B');
		});

		it('wraps forwards from a non-tabbable origin after the last tabbable element', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button tabindex="-1">Programmatically focused</button>
			`);
			const current = container.querySelector('[tabindex="-1"]');
			(current as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('A');
		});

		it('returns null from a non-tabbable origin when there are no tabbable elements', () => {
			const container = createContainer(`
				<button tabindex="-1">Programmatically focused</button>
			`);
			const current = container.querySelector('[tabindex="-1"]');
			(current as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toBeNull();
		});

		it('skips inputs hidden with display none', () => {
			const container = createContainer(`
				<button>A</button>
				<input style="display: none" />
				<button>B</button>
			`);
			const firstButton = container.querySelector('button');
			(firstButton as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('B');
		});

		it('skips inputs with an ancestor hidden with display none', () => {
			const container = createContainer(`
				<button>A</button>
				<div style="display: none">
					<input />
				</div>
				<button>B</button>
			`);
			const firstButton = container.querySelector('button');
			(firstButton as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('B');
		});

		it('skips inputs hidden with CSS visibility', () => {
			const container = createContainer(`
				<button>A</button>
				<input style="visibility: hidden" />
				<button>B</button>
			`);
			const firstButton = container.querySelector('button');
			(firstButton as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('B');
		});

		it('skips inputs with an ancestor hidden with CSS visibility', () => {
			const container = createContainer(`
				<button>A</button>
				<div style="visibility: hidden">
					<input />
				</div>
				<button>B</button>
			`);
			const firstButton = container.querySelector('button');
			(firstButton as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('B');
		});

		it('excludes focusable elements from nested top-layer scopes', () => {
			const container = createContainer(`
				<button>A</button>
				<div popover><button>Nested</button></div>
				<button>B</button>
			`);
			const firstButton = container.querySelector('button');
			(firstButton as HTMLElement).focus();

			const first = getFirstFocusable({ container });
			const last = getLastFocusable({ container });
			const next = getNextFocusable({ container, direction: 'forwards' });

			expect(first).toHaveTextContent('A');
			expect(last).toHaveTextContent('B');
			expect(next).toHaveTextContent('B');
		});

		it('wraps forwards from last to first', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button>C</button>
			`);
			const buttons = container.querySelectorAll('button');
			(buttons[2] as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('A');
		});

		it('returns the previous element backwards', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button>C</button>
			`);
			const buttons = container.querySelectorAll('button');
			(buttons[2] as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'backwards' });

			expect(result).toHaveTextContent('B');
		});

		it('wraps backwards from first to last', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
				<button>C</button>
			`);
			const buttons = container.querySelectorAll('button');
			(buttons[0] as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'backwards' });

			expect(result).toHaveTextContent('C');
		});

		it('returns null when nothing is focused', () => {
			const container = createContainer(`
				<button>A</button>
				<button>B</button>
			`);

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toBeNull();
		});

		it('returns null when focused element is not in the container', () => {
			const container = createContainer(`
				<button>A</button>
			`);
			document.body.focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toBeNull();
		});

		it('handles single item (wraps to itself)', () => {
			const container = createContainer(`
				<button>Only</button>
			`);
			(container.querySelector('button') as HTMLElement).focus();

			const result = getNextFocusable({ container, direction: 'forwards' });

			expect(result).toHaveTextContent('Only');
		});
	});
});
