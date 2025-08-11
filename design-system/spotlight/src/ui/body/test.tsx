import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightBody } from './index';

const testId = 'spotlight';

describe('SpotlightBody', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightBody testId={testId}>Hello, world!</SpotlightBody>);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightBody testId={testId}>Hello, world!</SpotlightBody>);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightBody ref={ref}>Hello, world!</SpotlightBody>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
