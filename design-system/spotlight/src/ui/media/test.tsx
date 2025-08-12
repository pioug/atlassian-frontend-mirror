import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightMedia } from './index';

const testId = 'spotlight';

describe('SpotlightMedia', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightMedia testId={testId}>Hello, world!</SpotlightMedia>);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightMedia testId={testId}>Hello, world!</SpotlightMedia>);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightMedia ref={ref}>Hello, world!</SpotlightMedia>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
