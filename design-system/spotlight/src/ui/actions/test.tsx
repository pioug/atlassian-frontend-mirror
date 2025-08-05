import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightActions } from './index';

const testId = 'spotlight';

describe('SpotlightActions', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightActions testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightActions testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightActions ref={ref}>Hello, world!</SpotlightActions>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
