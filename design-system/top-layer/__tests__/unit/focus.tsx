import { getFirstFocusable, getLastFocusable, getNextFocusable } from '../../src/focus/focus';

// ── focus helpers unit tests ──

describe('focusable helpers', () => {
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
