import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should support test id', async () => {
	render(<Button testId="iamTheDataTestId">Button</Button>);

	expect(screen.getByTestId('iamTheDataTestId')).toBeInTheDocument();
});
