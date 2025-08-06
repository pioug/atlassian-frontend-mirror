import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightControls } from './index';

const testId = 'spotlight';

describe('SpotlightControls', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightControls testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightControls testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<SpotlightControls ref={ref}>Hello, world!</SpotlightControls>);
		expect(ref.current).toBeDefined();
		expect(ref.current?.textContent).toEqual('Hello, world!');
	});
});
