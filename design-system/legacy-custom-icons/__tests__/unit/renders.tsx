import React from 'react';

import { render, screen } from '@testing-library/react';

import * as componentList from '../../examples/artifacts/icons';

describe('Render legacy custom icons', () => {
	test.each(Object.entries(componentList))(`%p renders`, (componentName, Component) => {
		render(<Component testId={componentName} label={`${componentName} icon`} />);

		const icon = screen.getByTestId(componentName);
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAccessibleName(`${componentName} icon`);
	});
});
