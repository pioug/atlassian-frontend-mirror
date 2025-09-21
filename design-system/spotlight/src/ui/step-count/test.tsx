import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightStepCount } from './index';

const testId = 'spotlight';

describe('SpotlightStepCount', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightStepCount testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightStepCount testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightStepCount ref={ref}>1 of 3</SpotlightStepCount>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('1 of 3 steps');
	});
});
