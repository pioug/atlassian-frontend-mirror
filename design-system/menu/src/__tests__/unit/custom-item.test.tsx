import React from 'react';

import { render, screen } from '@testing-library/react';

import CustomItem from '../../menu-item/custom-item';

type ButtonComponentProps = React.ComponentPropsWithRef<'button'> & {
	'data-testid'?: string;
};

const ButtonComponent = ({
	children,
	onClick,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	tabIndex,
	role,
	'aria-disabled': ariaDisabled,
	'data-testid': testId,
}: ButtonComponentProps) => (
	// eslint-disable-next-line react/button-has-type
	<button
		onClick={onClick}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
		onFocus={onFocus}
		onBlur={onBlur}
		tabIndex={tabIndex}
		role={role}
		aria-disabled={ariaDisabled}
		data-testid={testId}
	>
		{children}
	</button>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('CustomItem', () => {
	describe('aria-disabled', () => {
		it('should not have aria-disabled attribute when isDisabled is false', () => {
			render(
				<CustomItem testId="custom-item" component={ButtonComponent}>
					Customer Feedback
				</CustomItem>,
			);

			const item = screen.getByTestId('custom-item');
			expect(item).not.toHaveAttribute('aria-disabled');
		});

		it('should have aria-disabled="true" when isDisabled is true', () => {
			render(
				<CustomItem testId="custom-item" component={ButtonComponent} isDisabled>
					Customer Feedback
				</CustomItem>,
			);

			const item = screen.getByTestId('custom-item');
			expect(item).toHaveAttribute('aria-disabled', 'true');
		});
	});
});
