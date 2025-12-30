import '@testing-library/jest-dom';

import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import PremiumIcon from '@atlaskit/icon/core/premium';
import { token } from '@atlaskit/tokens';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ActionName } from '../../../../../../constants';
import { messages } from '../../../../../../messages';
import { type ActionItem, type CustomActionItem } from '../../types';
import ActionGroup from '../index';

describe('ActionGroup', () => {
	const testId = 'smart-element-test';
	let containerOnClick = jest.fn();

	const setup = (itemsCount: number, visibleButtonsNum?: number) => {
		const makeActionItem: (_: any, i: number) => ActionItem = (_, i) => ({
			onClick: jest.fn(),
			name: ActionName.DeleteAction,
			testId: `${testId}-${i + 1}`,
			hideContent: false,
			hideIcon: false,
		});
		const items = Array(itemsCount).fill(null).map(makeActionItem);

		return render(
			<IntlProvider locale="en">
				<div onClick={containerOnClick}>
					<ActionGroup items={items} visibleButtonsNum={visibleButtonsNum} />
				</div>
			</IntlProvider>,
		);
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('when there is just one action item', () => {
		it('renders action group', async () => {
			const { container } = setup(1);

			const actionGroup = await waitFor(() => container.firstChild);

			expect(actionGroup).toBeTruthy();
			expect(actionGroup).toHaveTextContent('Delete');
		});

		it('should not render ellipse button', async () => {
			setup(1);
			expect(screen.queryByTestId('action-group-more-button')).toBeNull();
		});
	});

	describe.each([3, 2, 1])('with up to %d buttons visible', (visibleButtonsNum) => {
		describe(`when there is ${visibleButtonsNum} actions`, () => {
			it(`should render ${visibleButtonsNum} actions as a buttons`, async () => {
				setup(visibleButtonsNum, visibleButtonsNum);
				for (let i = 0; i < visibleButtonsNum; i++) {
					const element = await screen.findByTestId(`smart-element-test-${i + 1}`);
					expect(element).toBeDefined();
				}
			});

			it('should not render ellipse button', async () => {
				setup(visibleButtonsNum, visibleButtonsNum);
				expect(screen.queryByTestId('action-group-more-button')).toBeNull();
			});
		});

		describe(`when there is more then ${visibleButtonsNum} actions`, () => {
			it(`should render ${visibleButtonsNum - 1} first action item(s) as a button(s)`, async () => {
				setup(visibleButtonsNum + 1, visibleButtonsNum);
				// First minus one buttons are stand alone buttons
				for (let i = 0; i < visibleButtonsNum - 1; i++) {
					const element = await screen.findByTestId(`smart-element-test-${i + 1}`);
					expect(element).toBeDefined();
				}
				// Rest are not stand alone buttons
				for (let i = visibleButtonsNum - 1; i < visibleButtonsNum + 1; i++) {
					expect(screen.queryByTestId(`smart-element-test-${i + 1}`)).toBeNull();
				}
			});

			it(`should render ellipse button for all but ${
				visibleButtonsNum - 1
			} first actions`, async () => {
				setup(visibleButtonsNum + 1, visibleButtonsNum);
				const element = await screen.findByTestId('action-group-more-button');
				expect(element).toBeDefined();
			});

			it('should render rest of the actions when "more actions" button is clicked', async () => {
				setup(visibleButtonsNum + 1, visibleButtonsNum);
				const moreButton = await screen.findByTestId('action-group-more-button');
				await userEvent.click(moreButton);

				/**
				 * for visibleButtonsNum = 3 and total 4 buttons,
				 * dropdown shows actions #3, #4 (indices 2, 3)
				 *
				 * for visibleButtonsNum = 2 and total 3 buttons,
				 * dropdown shows actions #2, #3 (indices 1, 2)
				 *
				 * for visibleButtonsNum = 1 and total 2 buttons,
				 * dropdown shows actions #1, #2 (indices 0, 1)
				 */
				for (let i = 0; i < 2; i++) {
					const secondActionElement = await screen.findByTestId(
						`smart-element-test-${i + visibleButtonsNum}`,
					);
					expect(secondActionElement).toBeDefined();
					expect(secondActionElement).toHaveTextContent('Delete');
				}
			});

			it('renders tooltip when "more actions" button is hovered', async () => {
				setup(visibleButtonsNum + 1, visibleButtonsNum);
				const moreButton = await screen.findByTestId('action-group-more-button');
				fireEvent.mouseOver(moreButton);
				const tooltip = await screen.findByTestId('action-group-more-button-tooltip');

				expect(tooltip).toBeTruthy();
				expect(tooltip.textContent).toBe(messages.more_actions.defaultMessage);
			});
		});
	});

	describe('renderActionItems', () => {
		const testId = 'smart-element-test';
		const setup = async (
			name: ActionName,
			hideContent: boolean,
			hideIcon: boolean,
			asDropDownItems: boolean = false,
		) => {
			const onClick = () => {};
			const commonProps = { onClick, testId, hideContent, hideIcon };
			const action =
				name === ActionName.CustomAction
					? ({
							name: ActionName.CustomAction,
							...commonProps,
							icon: <PremiumIcon label="magic" color={token('color.icon', '#44546F')} />,
							content: 'Magic!',
						} as CustomActionItem)
					: {
							name,
							...commonProps,
						};

			const visibleButtonsNum = asDropDownItems ? 0 : undefined;

			const renderResult = render(
				<ActionGroup items={[action]} visibleButtonsNum={visibleButtonsNum} />,
				{ wrapper: getFlexibleCardTestWrapper(context) },
			);

			if (asDropDownItems) {
				const moreButton = await screen.findByTestId('action-group-more-button');
				await userEvent.click(moreButton);
				await screen.findByRole('menu');
			}

			return renderResult;
		};

		it('should capture and report a11y violations', async () => {
			const onClick = jest.fn();
			const { container } = render(
				<ActionGroup items={[{ name: ActionName.DeleteAction, onClick, testId }]} />,
				{
					wrapper: getFlexibleCardTestWrapper(context),
				},
			);

			await expect(container).toBeAccessible();
		});

		it('should be able to render DropdownItem element', async () => {
			await setup(ActionName.DeleteAction, false, false, true);
			const elements = screen.getAllByRole('menuitem');
			expect(elements).toHaveLength(1);
		});

		describe.each([[ActionName.DeleteAction, 'Delete', 'smart-element-test-icon']])(
			'with %s action',
			(actionName: ActionName, expectedContent: string, iconTestId: string) => {
				describe.each([
					['as dropdown item', true],
					['as button', false],
				])('%s', (_: string, asDropdownItem: boolean) => {
					it('should render both content and icon', async () => {
						await setup(actionName, false, false, asDropdownItem);

						const element = await screen.findByTestId(testId);
						expect(element).toBeDefined();

						const icon = await screen.findByTestId(iconTestId);
						expect(icon).toBeDefined();

						expect(element).toHaveTextContent(expectedContent);
					});

					it('should render only content', async () => {
						await setup(actionName, false, true, asDropdownItem);

						const element = await screen.findByTestId(testId);
						expect(element).toBeDefined();

						expect(screen.queryByTestId(iconTestId)).toBeNull();

						expect(element).toHaveTextContent(expectedContent);
					});

					if (asDropdownItem) {
						it('should render content even if hideContent is true', async () => {
							await setup(actionName, true, false, asDropdownItem);

							const element = await screen.findByTestId(testId);
							expect(element).toBeDefined();

							const icon = await screen.findByTestId(iconTestId);
							expect(icon).toBeDefined();

							expect(element).toHaveTextContent(expectedContent);
						});
					} else {
						it('should render only icon', async () => {
							await setup(actionName, true, false, asDropdownItem);

							const element = await screen.findByTestId(testId);
							expect(element).toBeDefined();

							const icon = await screen.findByTestId(iconTestId);
							expect(icon).toBeDefined();

							expect(element).toHaveTextContent('');
						});
					}
				});
			},
		);

		it('calls onClick when action is clicked', async () => {
			const user = userEvent.setup();
			const onClick = jest.fn();
			render(<ActionGroup items={[{ name: ActionName.DeleteAction, onClick, testId }]} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const action = await screen.findByTestId(testId);
			await user.click(action);

			expect(onClick).toHaveBeenCalled();
		});
	});
});
