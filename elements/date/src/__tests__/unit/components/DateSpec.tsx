import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Date } from '../../../components/Date';
import { type DateProps } from '../../../';

describe('Date', () => {
	const renderDate = (props: Partial<DateProps> = {}) =>
		render(<Date value={586137600000} {...props} />);

	const getText = () => screen.getByRole('button').textContent;

	describe('format', () => {
		it('should render date formated', async () => {
			renderDate();
			expect(getText()).toEqual('29/07/1988');

			await expect(document.body).toBeAccessible();
		});

		it('should use custom format', async () => {
			renderDate({ format: 'MM/dd/yyyy' });
			expect(getText()).toEqual('07/29/1988');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('color', () => {
		it('should use default color', async () => {
			renderDate();
			expect(screen.getByRole('button')).toHaveCompiledCss('color', 'var(--ds-text,#292a2e)');

			await expect(document.body).toBeAccessible();
		});

		it('should set custom color', async () => {
			renderDate({ color: 'red' });
			expect(screen.getByRole('button')).toHaveCompiledCss(
				'color',
				'var(--ds-text-accent-red,#ae2e24)',
			);

			await expect(document.body).toBeAccessible();
		});
	});

	// current implementation actually does not support className
	describe('className', () => {
		it('should set className', async () => {
			renderDate({ className: 'custom-class' });
			expect(screen.getByRole('button')).toHaveClass('custom-class');

			await expect(document.body).toBeAccessible();
		});
	});

	// current implementation actually does not support onClick
	describe('onClick', () => {
		it('should set onClick', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();
			renderDate({ onClick });
			await user.click(screen.getByRole('button'));
			expect(onClick).toHaveBeenCalledTimes(1);
			expect(onClick).toHaveBeenCalledWith(586137600000, expect.anything());

			await expect(document.body).toBeAccessible();
		});
	});

	describe('children', () => {
		it('should be formated value', async () => {
			renderDate();
			expect(getText()).toEqual('29/07/1988');

			await expect(document.body).toBeAccessible();
		});

		it('should be children property', async () => {
			renderDate({ children: '29 - 07 - 1988' });
			expect(getText()).toEqual('29 - 07 - 1988');

			await expect(document.body).toBeAccessible();
		});

		it('should be children property', async () => {
			const children = jest.fn();
			children.mockReturnValueOnce('[29|07|1988]');
			renderDate({ children });
			expect(getText()).toEqual('[29|07|1988]');

			await expect(document.body).toBeAccessible();
		});
	});
});
