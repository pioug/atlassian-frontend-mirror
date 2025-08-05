import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightFooter } from './index';

const testId = 'spotlight';

describe('SpotlightFooter', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightFooter testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightFooter testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightFooter ref={ref}>Hello, world!</SpotlightFooter>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
