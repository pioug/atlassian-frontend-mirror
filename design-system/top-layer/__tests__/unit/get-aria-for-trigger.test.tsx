import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';

describe('getAriaForTrigger', () => {
	describe('aria-haspopup (role mapping)', () => {
		it('returns "dialog" for dialog role', () => {
			expect(
				getAriaForTrigger({ role: 'dialog', isOpen: false, popoverId: 'x' })['aria-haspopup'],
			).toBe('dialog');
		});

		it('returns "dialog" for alertdialog role', () => {
			expect(
				getAriaForTrigger({ role: 'alertdialog', isOpen: false, popoverId: 'x' })['aria-haspopup'],
			).toBe('dialog');
		});

		it('returns "menu" for menu role', () => {
			expect(
				getAriaForTrigger({ role: 'menu', isOpen: false, popoverId: 'x' })['aria-haspopup'],
			).toBe('menu');
		});

		it('returns "listbox" for listbox role', () => {
			expect(
				getAriaForTrigger({ role: 'listbox', isOpen: false, popoverId: 'x' })['aria-haspopup'],
			).toBe('listbox');
		});

		it('returns "tree" for tree role', () => {
			expect(
				getAriaForTrigger({ role: 'tree', isOpen: false, popoverId: 'x' })['aria-haspopup'],
			).toBe('tree');
		});

		it('returns "grid" for grid role', () => {
			expect(
				getAriaForTrigger({ role: 'grid', isOpen: false, popoverId: 'x' })['aria-haspopup'],
			).toBe('grid');
		});
	});

	describe('aria-expanded', () => {
		it('returns false when isOpen is false', () => {
			expect(
				getAriaForTrigger({ role: 'dialog', isOpen: false, popoverId: 'x' })['aria-expanded'],
			).toBe(false);
		});

		it('returns true when isOpen is true', () => {
			expect(
				getAriaForTrigger({ role: 'dialog', isOpen: true, popoverId: 'x' })['aria-expanded'],
			).toBe(true);
		});
	});

	describe('aria-controls', () => {
		it('returns the popoverId when open', () => {
			expect(
				getAriaForTrigger({ role: 'dialog', isOpen: true, popoverId: 'my-popover' })[
					'aria-controls'
				],
			).toBe('my-popover');
		});

		it('omits aria-controls when closed (host element is not in the DOM)', () => {
			const result = getAriaForTrigger({
				role: 'dialog',
				isOpen: false,
				popoverId: 'my-popover',
			});
			// `aria-controls` is set to `undefined` (not omitted) so the JSX
			// spread renders no `aria-controls` attribute on the trigger.
			expect(result['aria-controls']).toBeUndefined();
		});
	});

	it('returns all three attributes in a single call when open', () => {
		const result = getAriaForTrigger({ role: 'menu', isOpen: true, popoverId: 'menu-popup' });
		expect(result).toEqual({
			'aria-haspopup': 'menu',
			'aria-expanded': true,
			'aria-controls': 'menu-popup',
		});
	});

	it('returns only haspopup and expanded when closed', () => {
		const result = getAriaForTrigger({ role: 'menu', isOpen: false, popoverId: 'menu-popup' });
		expect(result).toEqual({
			'aria-haspopup': 'menu',
			'aria-expanded': false,
		});
	});
});
