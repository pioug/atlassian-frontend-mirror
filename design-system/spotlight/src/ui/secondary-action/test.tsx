import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightSecondaryAction } from './index';

const testId = 'spotlight';

describe('SpotlightSecondaryAction', () => {
	it('captures and report a11y violations', async () => {
		const ref = React.createRef<HTMLButtonElement>();
		const { container } = render(
			<SpotlightSecondaryAction ref={ref} aria-label="Go to the previous step" testId={testId}>
				Back
			</SpotlightSecondaryAction>,
		);

		await expect(container).toBeAccessible();
		await expect(ref.current).toHaveAttribute('aria-label', 'Go to the previous step');
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightSecondaryAction testId={testId}>Back</SpotlightSecondaryAction>);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<SpotlightSecondaryAction ref={ref}>Hello, world!</SpotlightSecondaryAction>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
