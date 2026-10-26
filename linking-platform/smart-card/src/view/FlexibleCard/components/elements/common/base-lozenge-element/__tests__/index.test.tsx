/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import '@testing-library/jest-dom';
import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl';

import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import { ElementName } from '../../../../../../../constants';
import * as uiOptions from '../../../../../../../state/flexible-ui-context/useFlexibleUiOptionContext';
import * as useInvoke from '../../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../../state/hooks/use-resolve';
import BaseLozengeElement, { type BaseLozengeElementProps } from '../index';

describe('Element: Lozenge', () => {
	const testId = 'smart-element-lozenge';
	const defaultText = 'Some status';
	const defaultAppearance = 'inprogress';

	const renderComponent = (props?: Partial<BaseLozengeElementProps>) => {
		const { text = defaultText, appearance = defaultAppearance, ...rest } = props || {};

		const overrideCss = css({
			fontStyle: 'italic',
		});

		const component = (
			<IntlProvider locale="en">
				<BaseLozengeElement
					text={text}
					appearance={appearance}
					testId={testId}
					css={overrideCss}
					{...rest}
				/>
			</IntlProvider>
		);
		return render(component);
	};

	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent();

		await expect(container).toBeAccessible();
	});

	it('renders element', async () => {
		renderComponent();

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(defaultText);
	});

	it('does not render when no text in element', async () => {
		renderComponent({ text: '' });
		expect(screen.queryByTestId(testId)).toBeNull();
	});

	describe('renders element with different appearances', () => {
		const appearances: Array<BaseLozengeElementProps['appearance']> = [
			'default',
			'inprogress',
			'moved',
			'new',
			'removed',
			'success',
		];
		for (const appearance of appearances) {
			it(`renders with ${appearance} appearance`, async () => {
				renderComponent({ appearance });

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element).toHaveTextContent(defaultText);
			});
		}
	});

	it('renders with default appearance when given an unexpected appearance', async () => {
		renderComponent({ appearance: 'spaghetti' as any });
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent(defaultText);
	});

	it('renders with override css', async () => {
		renderComponent();

		const element = await screen.findByTestId(testId);

		expect(element).toHaveCompiledCss('font-style', 'italic');
	});

	describe('action', () => {
		const triggerTestId = `${testId}--trigger`;
		const action = {
			read: {
				action: {
					actionType: SmartLinkActionType.GetStatusTransitionsAction,
					resourceIdentifiers: {
						issueKey: 'issue-id',
						hostname: 'some-hostname',
					},
				},
				providerKey: 'object-provider',
			},
			update: {
				action: {
					actionType: SmartLinkActionType.StatusUpdateAction,
					resourceIdentifiers: {
						issueKey: 'issue-id',
						hostname: 'some-hostname',
					},
				},
				providerKey: 'object-provider',
			},
		};

		afterEach(() => {
			jest.clearAllMocks();
			jest.restoreAllMocks();
		});

		describe.each([false, true])('lozenge visual uplift: %s', (visualUplift) => {
			it.each([
				{ name: ElementName.State, billplatGate: true, optIn: true },
				{ name: ElementName.State, billplatGate: false, optIn: true },
				{ name: ElementName.State, billplatGate: true, optIn: false },
				{ name: ElementName.State, billplatGate: true, optIn: undefined },
				{ name: ElementName.Priority, billplatGate: true, optIn: true },
			])(
				'supports status selection: name=$name billplatGate=$billplatGate optIn=$optIn',
				async ({ name, billplatGate, optIn }) => {
					(billplatGate ? passGate : failGate)('billplat_jira_list_dropdown_top_layer');
					(visualUplift ? passGate : failGate)('platform-dst-lozenge-tag-badge-visual-uplifts');
					jest.spyOn(uiOptions, 'useFlexibleUiOptionContext').mockReturnValue({
						shouldRenderStatusToParent: optIn,
					});
					const invoke = jest.fn().mockResolvedValue([{ id: 'done', text: 'Done' }]);
					jest.spyOn(useInvoke, 'default').mockReturnValue(invoke);
					jest.spyOn(useResolve, 'default').mockReturnValue(jest.fn());
					renderComponent({ action, name });
					const trigger = await screen.findByRole('button', {
						name: `Change status: ${defaultText}`,
					});
					expect(trigger).not.toHaveAttribute('aria-owns');
					await userEvent.click(trigger);
					const menu = await screen.findByRole('menu');
					const menuId = trigger.getAttribute('aria-controls');
					expect(menuId).toBeTruthy();
					const content = document.getElementById(menuId ?? '');
					expect(content).toContainElement(menu);

					expect(trigger).not.toHaveAttribute('aria-owns');
					await userEvent.click(within(menu).getByRole('menuitem', { name: 'Done' }));
					await waitFor(() =>
						expect(invoke).toHaveBeenCalledWith(
							expect.objectContaining({
								action: expect.objectContaining({
									actionType: SmartLinkActionType.StatusUpdateAction,
								}),
							}),
						),
					);
					await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
					expect(trigger).toHaveAccessibleName('Change status: Done');

					await userEvent.click(trigger);
					await screen.findByRole('menu');
					await userEvent.keyboard('{Escape}');
					await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
					expect(trigger).not.toHaveAttribute('aria-owns');
				},
			);
		});

		it('renders with action', async () => {
			jest.spyOn(useInvoke, 'default').mockReturnValue(jest.fn());
			jest.spyOn(useResolve, 'default').mockReturnValue(jest.fn());

			renderComponent({ action });

			const element = await screen.findByTestId(triggerTestId);

			expect(element).toBeTruthy();
		});
	});
});
