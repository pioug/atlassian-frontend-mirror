import React from 'react';
import { Truncate } from '../../truncateText';
import { type TruncateProps, calculateTruncation } from '../../truncateText-compiled';
import { render, screen } from '@testing-library/react';

const setupRTL = (props: TruncateProps) => render(<Truncate {...props} />);

describe('TruncateText', () => {
	describe('Text Calculation', () => {
		it('it should not truncate text when enough size', async () => {
			const output = calculateTruncation('1234567890.ext', 14, 0);
			expect(output.left).toEqual(output.right);

			await expect(document.body).toBeAccessible();
		});

		it('it should truncate text when required', async () => {
			const output = calculateTruncation('1234567890.ext', 5, 4);
			expect(output.left).toEqual('1234567890'); // everything before 4 chars from end
			expect(output.right).toEqual('.ext'); // 4 chars from text end

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Truncate Component', () => {
		it('it should create left and right elements when required', async () => {
			setupRTL({
				text: '1234567890.ext',
				startFixedChars: 5,
				endFixedChars: 4,
			});

			expect(await screen.findByTestId('truncate-left')).toHaveTextContent('1234567890');
			expect(await screen.findByTestId('truncate-right')).toHaveTextContent('.ext');

			await expect(document.body).toBeAccessible();
		});
	});
});
