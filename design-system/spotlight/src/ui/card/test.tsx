import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightCard } from './index';

const testId = 'SpotlightCard';

describe('SpotlightCard', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightCard testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds SpotlightCard by its testid', async () => {
		render(<SpotlightCard testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightCard ref={ref}>Hello, world!</SpotlightCard>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
