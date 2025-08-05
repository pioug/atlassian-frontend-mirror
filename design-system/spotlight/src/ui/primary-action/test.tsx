import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightPrimaryAction } from './index';

const testId = 'spotlight';

describe('SpotlightPrimaryAction', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(
			<SpotlightPrimaryAction testId={testId}>Done</SpotlightPrimaryAction>,
		);

		await expect(container).toBeAccessible();
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
