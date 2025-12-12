import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ProfileCardDetails } from '../../components/User/ProfileCardDetails';
import { type LozengeProps } from '../../types';

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		useIntl: jest.fn().mockReturnValue({
			locale: 'en',
			formatMessage: (descriptor: any) => descriptor.defaultMessage,
			FormattedMessage: ({ descriptor }: any) => descriptor.defaultMessage,
		}),
	};
});

jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual<any>('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
}));

type Props = Parameters<typeof ProfileCardDetails>[0];

const defaultProps: Props = {
	fireAnalyticsWithDuration: jest.fn(),
	fullName: 'full name test',
	status: 'active',
	nickname: 'jscrazy',
	companyName: 'Atlassian',
	fireAnalyticsWithDurationNext: jest.fn(),
};

const renderComponent = (props: Partial<Props> = {}) =>
	render(
		<IntlProvider locale="en" defaultLocale="en-US">
			<ProfileCardDetails {...defaultProps} {...props} />
		</IntlProvider>,
	);

describe('ProfileCardDetails', () => {
	describe('name', () => {
		describe.each([
			['active user', false],
			['bot account', true],
		])('for %s', (_, isBot) => {
			it('should include nickname if applicable', async () => {
				const { getByTestId } = renderComponent({
					isBot,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"full name test (jscrazy) "`);

				await expect(document.body).toBeAccessible();
			});

			it('should only show name if no nickname', async () => {
				const { getByTestId } = renderComponent({
					isBot,
					nickname: undefined,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"full name test"`);

				await expect(document.body).toBeAccessible();
			});

			it('should show only once if nickname and full name match', async () => {
				const { getByTestId } = renderComponent({
					isBot,
					fullName: 'Same name',
					nickname: 'Same name',
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"Same name"`);

				await expect(document.body).toBeAccessible();
			});

			it('should show nothing if no name or nickname provided', async () => {
				const { queryByTestId } = renderComponent({
					isBot,
					fullName: undefined,
					nickname: undefined,
				});
				const component = queryByTestId('profilecard-name');
				expect(component).toBeNull();

				await expect(document.body).toBeAccessible();
			});

			it('should render name as a heading', async () => {
				const { getByRole } = renderComponent({
					isBot,
					fullName: 'Same name',
					nickname: 'Same name',
				});
				const component = getByRole('heading', { level: 2 });
				expect(component).toBeVisible();
				expect(component).toHaveTextContent('Same name');

				await expect(document.body).toBeAccessible();
			});
		});

		describe('for inactive user', () => {
			it('should show full name if available', async () => {
				const { getByTestId } = renderComponent({
					status: 'inactive',
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"full name test"`);

				await expect(document.body).toBeAccessible();
			});

			it('should show nickname if no full name', async () => {
				const { getByTestId } = renderComponent({
					status: 'inactive',
					fullName: undefined,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"jscrazy"`);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('for deleted user', () => {
			it('should show nickname if available', async () => {
				const { getByTestId } = renderComponent({
					status: 'closed',
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"jscrazy"`);

				await expect(document.body).toBeAccessible();
			});

			it('should show "Former user" if no nickname', async () => {
				const { getByTestId } = renderComponent({
					status: 'closed',
					nickname: undefined,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"Former user"`);

				await expect(document.body).toBeAccessible();
			});
		});

		describe('for service account', () => {
			it('should show "SERVICE ACCOUNT" tag', async () => {
				const { getByTestId, getByText } = renderComponent({
					fullName: 'Service account name',
					nickname: 'sa',
					isServiceAccount: true,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"Service account name (sa) "`);
				expect(getByText('SERVICE ACCOUNT')).toBeDefined();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('for long name', () => {
			ffTest.on('enable_profilecard_text_truncation_tooltip', 'enabled', () => {
				it('should show tooltip if name is long and truncated', async () => {
					const longName =
						'This is a very long name that will definitely be truncated in the profile card';
					const { getByTestId } = renderComponent({
						fullName: longName,
					});
					const nameElement = getByTestId('profilecard-name');

					// Mock the element to be truncated (scrollWidth > clientWidth)
					Object.defineProperty(nameElement, 'scrollWidth', {
						writable: true,
						configurable: true,
						value: 200,
					});
					Object.defineProperty(nameElement, 'clientWidth', {
						writable: true,
						configurable: true,
						value: 100,
					});

					await act(async () => {
						await userEvent.hover(nameElement);
					});

					const tooltip = await screen.findByRole('tooltip');
					expect(tooltip).toBeInTheDocument();
					expect(tooltip).toHaveTextContent(longName);

					await expect(document.body).toBeAccessible();
				});
			});
			ffTest.off('enable_profilecard_text_truncation_tooltip', 'disabled', () => {
				it('should not show tooltip even if name is long and truncated', async () => {
					const longName =
						'This is a very long name that will definitely be truncated in the profile card';
					const { getByTestId } = renderComponent({
						fullName: longName,
					});
					const nameElement = getByTestId('profilecard-name');

					// Mock the element to be truncated (scrollWidth > clientWidth)
					Object.defineProperty(nameElement, 'scrollWidth', {
						writable: true,
						configurable: true,
						value: 200,
					});
					Object.defineProperty(nameElement, 'clientWidth', {
						writable: true,
						configurable: true,
						value: 100,
					});

					await act(async () => {
						await userEvent.hover(nameElement);
					});

					expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

					await expect(document.body).toBeAccessible();
				});
			});
		});
	});

	describe('Disabled account message', () => {
		describe.each(['inactive', 'closed'] as Props['status'][])(
			'%s user',
			(status: Props['status']) => {
				it('should show provided message', async () => {
					const { getByText } = renderComponent({
						status,
						disabledAccountMessage: 'This account is disabled',
					});
					expect(getByText('This account is disabled')).toBeDefined();

					await expect(document.body).toBeAccessible();
				});

				it(`should show "just now" message for ${status} user`, async () => {
					const { getByTestId } = renderComponent({
						status,
						statusModifiedDate: Date.now() / 1000,
					});

					expect(getByTestId('profilecard-disabled-account').textContent).toEqual(
						`You can no longer collaborate with this person. Their account was ${
							status === 'inactive' ? 'deactivated' : 'deleted'
						} this week.`,
					);

					await expect(document.body).toBeAccessible();
				});

				it(`should show message for ${status} user when modified date is not available`, async () => {
					const { getByTestId } = renderComponent({
						status,
						statusModifiedDate: undefined,
					});

					expect(getByTestId('profilecard-disabled-account').textContent).toEqual(
						`You can no longer collaborate with this person. Their account has been ${
							status === 'inactive' ? 'deactivated' : 'deleted'
						}.`,
					);

					await expect(document.body).toBeAccessible();
				});

				it('should show lozenge if enabled', async () => {
					const { getByText } = renderComponent({
						status,
						hasDisabledAccountLozenge: true,
					});

					expect(
						getByText(`Account ${status === 'closed' ? 'deleted' : 'deactivated'}`),
					).toBeDefined();

					await expect(document.body).toBeAccessible();
				});

				it('should not show lozenge if disabled', async () => {
					const { queryByText } = renderComponent({
						status,
						hasDisabledAccountLozenge: false,
					});

					expect(
						queryByText(`Account ${status === 'closed' ? 'deleted' : 'deactivated'}`),
					).toBeNull();

					await expect(document.body).toBeAccessible();
				});

				it('should render name as a heading', async () => {
					const { getByRole } = renderComponent({
						fullName: 'Same name',
						nickname: 'Same name',
					});
					const component = getByRole('heading', { level: 2 });
					expect(component).toBeVisible();
					expect(component).toHaveTextContent('Same name');

					await expect(document.body).toBeAccessible();
				});
			},
		);
	});

	describe('Custom lozenges', () => {
		const customLozenges: LozengeProps[] = [
			{
				text: 'Guest',
				appearance: 'new',
				isBold: true,
			},
			{
				text: 'Cool Bean',
				appearance: 'removed',
			},
			{
				text: <div>Another Role</div>,
				appearance: 'inprogress',
				isBold: true,
			},
		];

		const getTextOf = (elem: React.ReactElement | string | null): string => {
			if (typeof elem === 'string') {
				return elem.toString();
			}

			if (!elem) {
				return '';
			}

			return getTextOf(elem.props.children);
		};

		it('should render multiple lozenges as expected', async () => {
			const { getByText } = renderComponent({
				customLozenges,
			});

			for (const { text } of customLozenges) {
				const childText = getTextOf(text as React.ReactElement | string);

				expect(getByText(childText)).not.toBeNull();
			}

			await expect(document.body).toBeAccessible();
		});

		it('should render only one lozenge if only one provided', async () => {
			const { getByText } = renderComponent({
				customLozenges: [customLozenges[0]],
			});

			const childText = getTextOf(customLozenges[0].text as React.ReactElement | string);

			expect(getByText(childText)).not.toBeNull();

			await expect(document.body).toBeAccessible();
		});
	});
});
