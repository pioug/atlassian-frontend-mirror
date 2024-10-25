import '@testing-library/jest-dom';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestIcon from '@atlaskit/icon/core/migration/dashboard--activity';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../../../../constants';
import Action from '../index';
import type { ActionProps } from '../types';

describe('Action', () => {
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = userEvent.setup();
	});

	const testId = 'smart-action';

	it('renders action', async () => {
		render(<Action onClick={() => {}} testId={testId} />);
		const element = await screen.findByTestId(testId);
		expect(element).not.toBeNull();
	});

	it('does not render action without onClick', async () => {
		// @ts-ignore Ignore to perform the test.
		render(<Action testId={testId} />);
		const element = screen.queryByTestId(testId);
		expect(element).toBeNull();
	});

	describe('as button', () => {
		it('renders action with some text', async () => {
			const text = 'spaghetti';
			render(<Action onClick={() => {}} content={text} testId={testId} />);

			const element = await screen.findByTestId(testId);

			expect(element).toBeTruthy();
			expect(element.textContent).toBe('spaghetti');
		});

		it('calls onClick when button is clicked', async () => {
			const text = 'spaghetti';
			const mockOnClick = jest.fn();
			render(<Action onClick={mockOnClick} content={text} testId={testId} />);

			const element = await screen.findByTestId(testId);

			expect(element).toBeTruthy();
			expect(element.textContent).toBe('spaghetti');

			await user.click(element);
			expect(mockOnClick).toHaveBeenCalled();
		});

		describe('size', () => {
			it.each([
				[SmartLinkSize.XLarge, '1.5rem'],
				[SmartLinkSize.Large, '1.5rem'],
				[SmartLinkSize.Medium, '1rem'],
				[SmartLinkSize.Small, '1rem'],
			])('renders action in %s size', async (size: SmartLinkSize, expectedSize: string) => {
				const testIcon = <TestIcon label="test" color={token('color.icon', '#44546F')} />;
				render(<Action onClick={() => {}} size={size} testId={testId} icon={testIcon} />);

				const element = await screen.findByTestId(`${testId}-icon`);

				expect(element).toHaveStyleDeclaration('height', expectedSize);
				expect(element).toHaveStyleDeclaration('width', expectedSize);
			});
		});

		it('renders with override css', async () => {
			const overrideCss = css({
				fontStyle: 'italic',
			});
			const testId = 'css';
			await render(
				<Action content="spaghetti" onClick={() => {}} overrideCss={overrideCss} testId={testId} />,
			);
			const action = await screen.findByTestId(`${testId}-button-wrapper`);
			expect(action).toHaveStyleDeclaration('font-style', 'italic');
		});

		it('does not call onClick on loading', async () => {
			const onClick = jest.fn();
			render(<Action isLoading={true} onClick={onClick} testId={testId} />);
			const element = await screen.findByTestId(testId);
			await user.click(element);

			expect(onClick).not.toHaveBeenCalled();
		});

		it('does not call onClick when button is disabled', async () => {
			const onClick = jest.fn();
			render(<Action isDisabled={true} onClick={onClick} testId={testId} />);
			const element = await screen.findByTestId(testId);
			await user.click(element);

			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe('as dropdown item', () => {
		it('renders action', async () => {
			const text = 'spaghetti';
			render(<Action asDropDownItem={true} onClick={() => {}} content={text} />);

			const element = await screen.findByTestId(testId);

			expect(element).toBeTruthy();
			expect(element.textContent).toBe('spaghetti');
		});

		it('calls onClick when dropdown item is clicked', async () => {
			const text = 'spaghetti';
			const onClick = jest.fn();
			render(<Action asDropDownItem={true} onClick={onClick} content={text} />);

			const element = await screen.findByTestId(testId);

			expect(element).toBeTruthy();
			expect(element.textContent).toBe(text);

			await user.click(element);
			expect(onClick).toHaveBeenCalled();
		});

		it('does not call onClick on loading', async () => {
			const onClick = jest.fn();
			render(
				<Action asDropDownItem={true} content="spaghetti" isLoading={true} onClick={onClick} />,
			);

			const element = await screen.findByTestId(testId);
			await user.click(element);

			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe('as stack item', () => {
		const content = 'spaghetti';
		const setup = (props?: Partial<ActionProps>) =>
			render(<Action as="stack-item" onClick={() => {}} content={content} {...props} />);

		it('renders action', async () => {
			setup();

			const element = await screen.findByRole('button');

			expect(element).toBeInTheDocument();
			expect(element.textContent).toBe(content);
		});

		it('calls onClick when stack item is clicked', async () => {
			const onClick = jest.fn();
			setup({ onClick });

			const element = await screen.findByRole('button');

			expect(element).toBeTruthy();
			expect(element.textContent).toBe(content);

			await user.click(element);
			expect(onClick).toHaveBeenCalled();
		});

		it('does not call onClick on loading', async () => {
			const onClick = jest.fn();
			setup({ isLoading: true, onClick });

			const element = await screen.findByRole('button');
			await user.click(element);

			expect(onClick).not.toHaveBeenCalled();
		});

		it('does not call onClick on disabled', async () => {
			const onClick = jest.fn();
			setup({ isDisabled: true, onClick });

			const element = await screen.findByRole('button');
			await user.click(element);

			expect(onClick).not.toHaveBeenCalled();
		});

		describe('with icon', () => {
			const icon = <svg data-testid="test-icon" />;

			it('renders icon', async () => {
				const onClick = jest.fn();
				setup({ icon, onClick, testId });
				const element = await screen.findByTestId('test-icon');
				expect(element).toBeInTheDocument();
			});

			it('renders spinner on loading', async () => {
				const onClick = jest.fn();
				setup({
					icon,
					isLoading: true,
					onClick,
					testId,
				});
				const element = await screen.findByTestId(`${testId}-loading`);
				expect(element).toBeInTheDocument();
			});

			it('does not render spinner on loading if there is no icon', () => {
				const onClick = jest.fn();
				setup({ isLoading: true, onClick, testId });
				const element = screen.queryByTestId(`${testId}-loading`);
				expect(element).not.toBeInTheDocument();
			});
		});

		describe('with tooltip', () => {
			const tooltipMessage = 'This is tooltip';

			it('renders content as tooltip message by default', async () => {
				setup();
				const element = await screen.findByRole('button');
				await user.hover(element);
				const tooltip = await screen.findByRole('tooltip');
				expect(tooltip.textContent).toBe(content);
			});

			it('renders tooltip message', async () => {
				setup({ tooltipMessage });
				const element = await screen.findByRole('button');
				await user.hover(element);
				const tooltip = await screen.findByRole('tooltip');
				expect(tooltip.textContent).toBe(tooltipMessage);
			});

			it('hides tooltip when hideTooltip is set to true', async () => {
				setup({ tooltipMessage, hideTooltip: true });
				const element = await screen.findByRole('button');
				await user.hover(element);
				const tooltip = screen.queryByRole('tooltip');
				expect(tooltip).toBeNull();
			});
		});
	});
});
