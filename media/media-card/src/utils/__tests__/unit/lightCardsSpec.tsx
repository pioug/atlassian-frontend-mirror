import React from 'react';
import { shallow } from 'enzyme';
import SpinnerIcon from '@atlaskit/spinner';

import { CardLoading } from '../../lightCards/cardLoading';
import { CardError } from '../../lightCards/cardError';
import { getDimensionsWithDefault } from '../../lightCards/getDimensionsWithDefault';
import { ErrorIcon } from '../../lightCards/errorIcon';

describe('<CardLoading />', () => {
	it('should render spinner', () => {
		const fileLoading = shallow(<CardLoading />);

		expect(fileLoading.find(SpinnerIcon)).toHaveLength(1);
	});

	describe('getDimensionsWithDefault()', () => {
		it('should use default ones when no dimensions provided', () => {
			expect(getDimensionsWithDefault()).toEqual({
				width: '100%',
				height: '100%',
			});
		});

		it('should use pixel units for provided dimensions', () => {
			expect(getDimensionsWithDefault({ width: 50, height: 50 })).toEqual({
				width: '50px',
				height: '50px',
			});
		});
	});
});

describe('<CardError />', () => {
	it('should render the right icon based on the itemType', () => {
		const fileError = shallow(<CardError />);

		expect(fileError.find(ErrorIcon)).toHaveLength(1);
	});

	describe('getDimensionsWithDefault()', () => {
		it('should use default ones when no dimensions provided', () => {
			expect(getDimensionsWithDefault()).toEqual({
				width: '100%',
				height: '100%',
			});
		});

		it('should use pixel units for provided dimensions', () => {
			expect(getDimensionsWithDefault({ width: 50, height: 50 })).toEqual({
				width: '50px',
				height: '50px',
			});
		});
	});
});
