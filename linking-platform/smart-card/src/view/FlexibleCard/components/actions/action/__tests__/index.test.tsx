/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import '@testing-library/jest-dom';

import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';

import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { type InternalFlexibleUiOptions } from '../../../../types';
import Action from '../index';
import type { ActionProps } from '../types';

describe('Action', () => {
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = userEvent.setup();
	});

	const testId = 'smart-action';

	it('should capture and report a11y violations', async () => {
		const { container } = render(<Action onClick={() => {}} testId={testId} content="test" />);

		await expect(container).toBeAccessible();
	});

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
		const setup = (props?: Partial<ActionProps>, ui?: InternalFlexibleUiOptions) =>
			render(<Action onClick={() => {}} testId={testId} {...props} />, {
				wrapper: getFlexibleCardTestWrapper(undefined, ui),
			});

		const runTest = (ui?: InternalFlexibleUiOptions) => {
			it('renders action with some text', async () => {
				const text = 'spaghetti';
				setup({ content: text }, ui);

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element).toHaveTextContent('spaghetti');
			});

			it('calls onClick when button is clicked', async () => {
				const text = 'spaghetti';
				const mockOnClick = jest.fn();
				setup({ onClick: mockOnClick, content: text }, ui);

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element).toHaveTextContent('spaghetti');

				await user.click(element);
				expect(mockOnClick).toHaveBeenCalled();
			});

			it('renders with override css', async () => {
				const overrideCss = css({
					fontStyle: 'italic',
				});
				const testId = 'css';
				render(
					<Action content="spaghetti" onClick={() => {}} css={overrideCss} testId={testId} />,
					{ wrapper: getFlexibleCardTestWrapper(undefined, ui) },
				);
				const action = await screen.findByTestId(`${testId}-button-wrapper`);
				expect(action).toHaveStyle('font-style: italic');
			});

			it('does not call onClick on loading', async () => {
				const onClick = jest.fn();
				setup({ isLoading: true, onClick }, ui);
				const element = await screen.findByTestId(testId);
				await user.click(element);

				expect(onClick).not.toHaveBeenCalled();
			});

			it('does not call onClick when button is disabled', async () => {
				const onClick = jest.fn();
				setup({ isDisabled: true, onClick }, ui);
				const element = await screen.findByTestId(testId);
				await user.click(element);

				expect(onClick).not.toHaveBeenCalled();
			});

			describe('with tooltip', () => {
				const tooltipMessage = 'This is tooltip';

				it('renders content as tooltip message by default', async () => {
					setup({ content: 'spaghetti', onClick: () => {} }, ui);

					const element = await screen.findByRole('button');
					await user.hover(element);
					const tooltip = await screen.findByRole('tooltip');
					expect(tooltip).toHaveTextContent('spaghetti');
				});

				it('renders tooltip message', async () => {
					setup({ onClick: () => {}, content: 'spaghetti', tooltipMessage }, ui);

					const element = await screen.findByRole('button');
					await user.hover(element);
					const tooltip = await screen.findByRole('tooltip');
					expect(tooltip).toHaveTextContent(tooltipMessage);
				});

				it('hides tooltip when hideTooltip is set to true', async () => {
					setup({ onClick: () => {}, content: 'spaghetti', hideTooltip: true, tooltipMessage }, ui);
					const element = await screen.findByRole('button');
					await user.hover(element);
					const tooltip = screen.queryByRole('tooltip');
					expect(tooltip).toBeNull();
				});
			});
		};

		describe.each([true, false])('with ui.hideLegacyButton %s', (hideLegacyButton: boolean) => {
			runTest({ hideLegacyButton });
		});

		describe.each([true, false])(
			'with ui.removeBlockRestriction %s',
			(removeBlockRestriction: boolean) => {
				runTest({ removeBlockRestriction });
			},
		);
	});

	describe('as dropdown item', () => {
		it('should capture and report a11y violations', async () => {
			const text = 'spaghetti';
			const { container } = render(
				<DropdownMenu trigger="open menu">
					<DropdownItemGroup>
						<Action asDropDownItem={true} onClick={() => {}} content={text} ariaLabel={text} />
					</DropdownItemGroup>
				</DropdownMenu>,
			);

			await expect(container).toBeAccessible();
		});

		it('renders action', async () => {
			const text = 'spaghetti';
			render(<Action asDropDownItem={true} onClick={() => {}} content={text} />);

			const element = await screen.findByTestId(testId);

			expect(element).toBeTruthy();
			expect(element).toHaveTextContent('spaghetti');
		});

		it('calls onClick when dropdown item is clicked', async () => {
			const text = 'spaghetti';
			const onClick = jest.fn();
			render(<Action asDropDownItem={true} onClick={onClick} content={text} />);

			const element = await screen.findByTestId(testId);

			expect(element).toBeTruthy();
			expect(element).toHaveTextContent(text);

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
			expect(element).toHaveTextContent(content);
		});

		it('calls onClick when stack item is clicked', async () => {
			const onClick = jest.fn();
			setup({ onClick });

			const element = await screen.findByRole('button');

			expect(element).toBeTruthy();
			expect(element).toHaveTextContent(content);

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
				expect(tooltip).toHaveTextContent(content);
			});

			it('renders tooltip message', async () => {
				setup({ tooltipMessage });
				const element = await screen.findByRole('button');
				await user.hover(element);
				const tooltip = await screen.findByRole('tooltip');
				expect(tooltip).toHaveTextContent(tooltipMessage);
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
