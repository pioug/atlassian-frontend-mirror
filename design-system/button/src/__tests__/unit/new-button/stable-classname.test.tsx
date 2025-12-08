import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

it('should have stable class names when re-rendering for all button variants', () => {
	variants.forEach(({ Component }) => {
		const { rerender, unmount } = render(<Component testId="button">Button</Component>);
		const button = screen.getByTestId('button');
		const original: string = button.className;

		rerender(<Component testId="button">Button</Component>);

		expect(original).toBe(button.className);

		// Clean up for next variant
		unmount();
	});
});
