import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightHeadline } from './index';

const testId = 'spotlight';

describe('SpotlightHeadline', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(
			<SpotlightHeadline testId={testId}>Hello, world!</SpotlightHeadline>,
		);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightHeadline testId={testId}>Hello, world!</SpotlightHeadline>);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightHeadline ref={ref}>Hello, world!</SpotlightHeadline>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
