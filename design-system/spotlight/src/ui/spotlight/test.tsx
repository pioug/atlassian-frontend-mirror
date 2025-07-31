import React from 'react';

import { render, screen } from '@testing-library/react';

import { Spotlight } from './index';

const testId = 'spotlight';

describe('Spotlight', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<Spotlight testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<Spotlight testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<Spotlight ref={ref}>Hello, world!</Spotlight>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
