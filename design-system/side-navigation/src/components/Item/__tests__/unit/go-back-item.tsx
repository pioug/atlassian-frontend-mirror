import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { GoBackItem } from '../../index';

describe('<GoBackItem />', () => {
	it('should callback on click only once', () => {
		const callback = jest.fn();
		render(<GoBackItem onClick={callback}>Go Back</GoBackItem>);

		fireEvent.click(screen.getByText('Go Back'));
		fireEvent.click(screen.getByText('Go Back'));

		expect(callback).toHaveBeenCalledTimes(1);
	});
});
