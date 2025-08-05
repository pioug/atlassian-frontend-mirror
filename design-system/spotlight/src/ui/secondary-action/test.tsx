import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightSecondaryAction } from './index';

const testId = 'spotlight';

describe('SpotlightSecondaryAction', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(
			<SpotlightSecondaryAction testId={testId}>Prev</SpotlightSecondaryAction>,
		);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightSecondaryAction testId={testId}>Prev</SpotlightSecondaryAction>);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<SpotlightSecondaryAction ref={ref}>Hello, world!</SpotlightSecondaryAction>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
