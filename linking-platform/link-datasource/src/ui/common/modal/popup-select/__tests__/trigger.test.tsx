import React, { createRef } from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import PopupTrigger, { type PopupTriggerProps } from '../trigger';
import { type SelectOption } from '../types';

const defaultProps: PopupTriggerProps = {
	label: 'Filter',
	testId: 'test-popup',
};

const renderPopupTrigger = (props: Partial<PopupTriggerProps> = {}, ref?: React.Ref<HTMLButtonElement>) => {
	return render(<PopupTrigger ref={ref} {...defaultProps} {...props} />);
};

describe('PopupTrigger', () => {
	describe('basic rendering', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = renderPopupTrigger();
			await expect(container).toBeAccessible();
		});	

		it('should render the trigger button with the label', () => {
			renderPopupTrigger();

			expect(screen.getByTestId('test-popup-trigger--button')).toBeInTheDocument();
			expect(screen.getByText('Filter')).toBeInTheDocument();
		});

		it('should render with isSelected state', () => {
			renderPopupTrigger({ isSelected: true });

			const button = screen.getByTestId('test-popup-trigger--button');
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});

		it('should render with isDisabled state', () => {
			renderPopupTrigger({ isDisabled: true });

			const button = screen.getByTestId('test-popup-trigger--button');
			expect(button).toBeDisabled();
		});

        it('should render loading button when isLoading is true', () => {
			renderPopupTrigger({ isLoading: true });

			expect(screen.getByTestId('test-popup-trigger--loading-button')).toBeInTheDocument();
			expect(screen.queryByTestId('test-popup-trigger--button')).not.toBeInTheDocument();
		});

		it('should not render loading button when isLoading is true but isDisabled is also true', () => {
			renderPopupTrigger({ isLoading: true, isDisabled: true });

			expect(screen.queryByTestId('test-popup-trigger--loading-button')).not.toBeInTheDocument();
			expect(screen.getByTestId('test-popup-trigger--button')).toBeInTheDocument();
		});
	});

	describe('selected options', () => {
		const selectedOptions: ReadonlyArray<SelectOption> = [
			{ label: 'Option 1', value: 'option1', optionType: 'iconLabel', icon: '' },
		];

		it('should display the first selected option label', () => {
			renderPopupTrigger({ selectedOptions });

			expect(screen.getByText(/Option 1/)).toBeInTheDocument();
		});

		it('should display badge with count when multiple options are selected', () => {
			const multipleOptions: ReadonlyArray<SelectOption> = [
				{ label: 'Option 1', value: 'option1', optionType: 'iconLabel', icon: '' },
				{ label: 'Option 2', value: 'option2', optionType: 'iconLabel', icon: '' },
				{ label: 'Option 3', value: 'option3', optionType: 'iconLabel', icon: '' },
			];

			renderPopupTrigger({ selectedOptions: multipleOptions });

			expect(screen.getByText('+2')).toBeInTheDocument();
		});

		it('should not display badge when only one option is selected', () => {
			renderPopupTrigger({ selectedOptions });

			expect(screen.queryByText('+0')).not.toBeInTheDocument();
		});
	});

	describe('ref forwarding with feature flag', () => {
		ffTest.on(
			'platform_navx_sllv_dropdown_escape_and_focus_fix',
			'ref forwarding when feature flag is on',
			() => {
				it('should forward ref to the button element', () => {
					const ref = createRef<HTMLButtonElement>();
					renderPopupTrigger({}, ref);

					expect(ref.current).not.toBeNull();
					expect(ref.current?.tagName).toBe('BUTTON');
					expect(ref.current).toBe(screen.getByTestId('test-popup-trigger--button'));
				});

				it('should forward ref to the loading button element when loading', () => {
					const ref = createRef<HTMLButtonElement>();
					renderPopupTrigger({ isLoading: true }, ref);

					expect(ref.current).not.toBeNull();
					expect(ref.current?.tagName).toBe('BUTTON');
					expect(ref.current).toBe(screen.getByTestId('test-popup-trigger--loading-button'));
				});
			},
		);

		ffTest.off(
			'platform_navx_sllv_dropdown_escape_and_focus_fix',
			'ref forwarding when feature flag is off',
			() => {
				it('should forward ref to the Box wrapper element', () => {
					const ref = createRef<HTMLButtonElement>();
					renderPopupTrigger({}, ref);

					expect(ref.current).not.toBeNull();
					// When flag is off, ref is on the Box wrapper (a div)
					expect(ref.current?.tagName).toBe('DIV');
					expect(ref.current).toBe(screen.getByTestId('test-popup-trigger'));
				});

				it('should forward ref to the Box wrapper element when loading', () => {
					const ref = createRef<HTMLButtonElement>();
					renderPopupTrigger({ isLoading: true }, ref);

					expect(ref.current).not.toBeNull();
					// When flag is off, ref is on the Box wrapper (a div)
					expect(ref.current?.tagName).toBe('DIV');
					expect(ref.current).toBe(screen.getByTestId('test-popup-trigger'));
				});
			},
		);
	});

	describe('accessibility', () => {
		it('should have aria-expanded attribute on the button', () => {
			renderPopupTrigger({ isSelected: false });

			const button = screen.getByTestId('test-popup-trigger--button');
			expect(button).toHaveAttribute('aria-expanded', 'false');
		});

		it('should set aria-expanded to true when isSelected', () => {
			renderPopupTrigger({ isSelected: true });

			const button = screen.getByTestId('test-popup-trigger--button');
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});
	});
});

