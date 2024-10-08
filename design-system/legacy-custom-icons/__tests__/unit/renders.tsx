import React from 'react';

import { render, screen } from '@testing-library/react';

import componentList from '../../examples/artifacts/icons';

describe('Render legacy custom icons', () => {
	Object.keys(componentList).forEach((componentName) => {
		test(`${componentName} renders`, () => {
			// @ts-expect-error
			const Component = componentList[componentName];
			render(<Component testId={componentName} />);
			expect(screen.getByTestId(componentName)).toBeInTheDocument();
		});
	});
});
