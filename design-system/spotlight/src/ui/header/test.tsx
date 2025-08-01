import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightHeader } from './index';

const testId = 'spotlight';

describe('SpotlightHeader', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightHeader testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightHeader testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightHeader ref={ref}>Hello, world!</SpotlightHeader>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
