import React from 'react';

import { render, screen } from '@testing-library/react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ErrorMessage, HelperMessage, ValidMessage } from '@atlaskit/form';

const props = {
	testId: 'testId',
	children: ['test'],
};

describe('Messages', () => {
	describe('aria-live attributes', () => {
		[ErrorMessage, HelperMessage, ValidMessage].forEach((Component, index) => {
			it(`${Component.name} should have aria-live`, () => {
				render(<Component {...props} key={index} />);
				expect(screen.getByTestId('testId')).toHaveAttribute('aria-live', 'polite');
			});
		});
	});
});
