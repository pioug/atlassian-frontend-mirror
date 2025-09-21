import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightPrimaryAction } from './index';

const testId = 'spotlight';

describe('SpotlightPrimaryAction', () => {
	it('captures and report a11y violations', async () => {
		const ref = React.createRef<HTMLButtonElement>();
		const { container } = render(
			<SpotlightPrimaryAction ref={ref} aria-label="Go to the next step" testId={testId}>
				Done
			</SpotlightPrimaryAction>,
		);

		await expect(container).toBeAccessible();
		await expect(ref.current).toHaveAttribute('aria-label', 'Go to the next step');
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightPrimaryAction testId={testId}>Done</SpotlightPrimaryAction>);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<SpotlightPrimaryAction ref={ref}>Hello, world!</SpotlightPrimaryAction>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
