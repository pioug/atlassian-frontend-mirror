import { applyInitialFocus } from '@atlaskit/top-layer/apply-initial-focus';

function createContainer(): {
	container: HTMLElement;
	firstButton: HTMLButtonElement;
	secondButton: HTMLButtonElement;
} {
	const container = document.createElement('div');
	container.tabIndex = -1;
	const firstButton = document.createElement('button');
	firstButton.textContent = 'First';
	const secondButton = document.createElement('button');
	secondButton.textContent = 'Second';
	container.append(firstButton, secondButton);
	document.body.append(container);
	return { container, firstButton, secondButton };
}

describe('applyInitialFocus', () => {
	afterEach(() => {
		document.body.replaceChildren();
	});

	it('focuses the role default when focus is outside the container', () => {
		const { container, firstButton } = createContainer();

		const result = applyInitialFocus({ container, role: 'dialog' });

		expect(firstButton).toHaveFocus();
		expect(result).toEqual({ applied: true, target: firstButton });
	});

	it('keeps focus that is already inside the container (for example a React autoFocus field)', () => {
		const { container, secondButton } = createContainer();
		secondButton.focus();

		const result = applyInitialFocus({ container, role: 'dialog' });

		expect(secondButton).toHaveFocus();
		expect(result).toEqual({ applied: true, target: secondButton });
	});

	it('keeps focus that is already inside the container over an initialFocusRef target', () => {
		const { container, firstButton, secondButton } = createContainer();
		secondButton.focus();

		const result = applyInitialFocus({
			container,
			initialFocusRef: { current: firstButton },
			role: 'dialog',
		});

		expect(secondButton).toHaveFocus();
		expect(result).toEqual({ applied: true, target: secondButton });
	});

	it('moves focus when the container itself has focus', () => {
		const { container, firstButton } = createContainer();
		container.focus();

		const result = applyInitialFocus({ container, role: 'dialog' });

		expect(firstButton).toHaveFocus();
		expect(result).toEqual({ applied: true, target: firstButton });
	});

	it('does not move focus for a role without initial focus', () => {
		const { container } = createContainer();
		const outside = document.createElement('button');
		document.body.append(outside);
		outside.focus();

		const result = applyInitialFocus({ container, role: 'tooltip' });

		expect(outside).toHaveFocus();
		expect(result).toEqual({ applied: false, target: null });
	});
});
