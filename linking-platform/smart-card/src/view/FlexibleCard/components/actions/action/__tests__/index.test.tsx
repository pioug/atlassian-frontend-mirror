/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import '@testing-library/jest-dom';
import { css, jsx } from '@compiled/react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing/skip-file-decorator';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { type InternalFlexibleUiOptions } from '../../../../types';
import Action from '../index';
import type { ActionProps } from '../types';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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

		describe.each([
			{ role: 'button', href: undefined },
			{ role: 'link', href: 'https://www.link-url.com' },
		])('refreshed icon-only $role', ({ role, href }) => {
			const tooltipMessage = 'Open preview';
			const ariaLabel = 'Open preview for the project guide';
			const icon = <svg aria-hidden="true" />;

			it('uses the accessible name and keeps the tooltip text', async () => {
				passGate('platform_smart_link_preview_a11y_label');
				setup({ icon, href, tooltipMessage, ariaLabel }, { hideLegacyButton: true });

				const element = screen.getByRole(role, { name: ariaLabel });
				expect(element).toHaveAccessibleName(ariaLabel);
				await user.hover(element);

				expect(await screen.findByRole('tooltip')).toHaveTextContent(tooltipMessage);
				expect(screen.getByRole('tooltip')).not.toHaveTextContent(ariaLabel);
			});

			it('keeps the tooltip as its accessible name when the gate is off', () => {
				failGate('platform_smart_link_preview_a11y_label');
				setup({ icon, href, tooltipMessage, ariaLabel }, { hideLegacyButton: true });

				expect(screen.getByRole(role, { name: tooltipMessage })).toHaveAccessibleName(
					tooltipMessage,
				);
			});

			it('uses the tooltip when no accessible name is supplied', () => {
				passGate('platform_smart_link_preview_a11y_label');
				setup({ icon, href, tooltipMessage }, { hideLegacyButton: true });

				expect(screen.getByRole(role, { name: tooltipMessage })).toHaveAccessibleName(
					tooltipMessage,
				);
			});
		});
	});

	describe('as dropdown item', () => {
		describe.each<Partial<ActionProps>>([{ as: 'dropdown-item' }, { asDropDownItem: true }])(
			'with presentation props %p',
			(props) => {
				it('uses the supplied accessible name', () => {
					passGate('platform_smart_link_preview_a11y_label');
					render(
						<Action
							{...props}
							onClick={() => {}}
							content="Open preview"
							ariaLabel="Open preview for the project guide"
						/>,
					);

					expect(
						screen.getByRole('menuitem', { name: 'Open preview for the project guide' }),
					).toHaveAccessibleName('Open preview for the project guide');
				});

				it('keeps its content as the accessible name when the gate is off', () => {
					failGate('platform_smart_link_preview_a11y_label');
					render(
						<Action
							{...props}
							onClick={() => {}}
							content="Open preview"
							ariaLabel="Open preview for the project guide"
						/>,
					);

					expect(screen.getByRole('menuitem', { name: 'Open preview' })).toHaveAccessibleName(
						'Open preview',
					);
				});
			},
		);

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
