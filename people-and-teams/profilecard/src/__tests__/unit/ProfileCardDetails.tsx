import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

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
			it('should include nickname if applicable', () => {
				const { getByTestId } = renderComponent({
					isBot,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"full name test (jscrazy) "`);
			});

			it('should only show name if no nickname', () => {
				const { getByTestId } = renderComponent({
					isBot,
					nickname: undefined,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"full name test"`);
			});

			it('should show only once if nickname and full name match', () => {
				const { getByTestId } = renderComponent({
					isBot,
					fullName: 'Same name',
					nickname: 'Same name',
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"Same name"`);
			});

			it('should show nothing if no name or nickname provided', () => {
				const { queryByTestId } = renderComponent({
					isBot,
					fullName: undefined,
					nickname: undefined,
				});
				const component = queryByTestId('profilecard-name');
				expect(component).toBeNull();
			});

			it('should render name as a heading', () => {
				(fg as jest.Mock).mockReturnValue(true);
				const { getByRole } = renderComponent({
					isBot,
					fullName: 'Same name',
					nickname: 'Same name',
				});
				const component = getByRole('heading', { level: 2 });
				expect(component).toBeVisible();
				expect(component).toHaveTextContent('Same name');
			});
		});

		describe('for inactive user', () => {
			it('should show full name if available', () => {
				const { getByTestId } = renderComponent({
					status: 'inactive',
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"full name test"`);
			});

			it('should show nickname if no full name', () => {
				const { getByTestId } = renderComponent({
					status: 'inactive',
					fullName: undefined,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"jscrazy"`);
			});
		});

		describe('for deleted user', () => {
			it('should show nickname if available', () => {
				const { getByTestId } = renderComponent({
					status: 'closed',
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"jscrazy"`);
			});

			it('should show "Former user" if no nickname', () => {
				const { getByTestId } = renderComponent({
					status: 'closed',
					nickname: undefined,
				});
				const component = getByTestId('profilecard-name');
				expect(component.textContent).toMatchInlineSnapshot(`"Former user"`);
			});
		});
	});

	describe('Disabled account message', () => {
		describe.each(['inactive', 'closed'] as Props['status'][])(
			'%s user',
			(status: Props['status']) => {
				it('should show provided message', () => {
					const { getByText } = renderComponent({
						status,
						disabledAccountMessage: 'This account is disabled',
					});
					expect(getByText('This account is disabled')).toBeDefined();
				});

				it(`should show "just now" message for ${status} user`, () => {
					const { getByTestId } = renderComponent({
						status,
						statusModifiedDate: Date.now() / 1000,
					});

					expect(getByTestId('profilecard-disabled-account').textContent).toEqual(
						`You can no longer collaborate with this person. Their account was ${
							status === 'inactive' ? 'deactivated' : 'deleted'
						} this week.`,
					);
				});

				it(`should show message for ${status} user when modified date is not available`, () => {
					const { getByTestId } = renderComponent({
						status,
						statusModifiedDate: undefined,
					});

					expect(getByTestId('profilecard-disabled-account').textContent).toEqual(
						`You can no longer collaborate with this person. Their account has been ${
							status === 'inactive' ? 'deactivated' : 'deleted'
						}.`,
					);
				});

				it('should show lozenge if enabled', () => {
					const { getByText } = renderComponent({
						status,
						hasDisabledAccountLozenge: true,
					});

					expect(
						getByText(`Account ${status === 'closed' ? 'deleted' : 'deactivated'}`),
					).toBeDefined();
				});

				it('should not show lozenge if disabled', () => {
					const { queryByText } = renderComponent({
						status,
						hasDisabledAccountLozenge: false,
					});

					expect(
						queryByText(`Account ${status === 'closed' ? 'deleted' : 'deactivated'}`),
					).toBeNull();
				});

				it('should render name as a heading', () => {
					(fg as jest.Mock).mockReturnValue(true);
					const { getByRole } = renderComponent({
						fullName: 'Same name',
						nickname: 'Same name',
					});
					const component = getByRole('heading', { level: 2 });
					expect(component).toBeVisible();
					expect(component).toHaveTextContent('Same name');
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

		it('should render multiple lozenges as expected', () => {
			const { getByText } = renderComponent({
				customLozenges,
			});

			for (const { text } of customLozenges) {
				const childText = getTextOf(text as React.ReactElement | string);

				expect(getByText(childText)).not.toBeNull();
			}
		});

		it('should render only one lozenge if only one provided', () => {
			const { getByText } = renderComponent({
				customLozenges: [customLozenges[0]],
			});

			const childText = getTextOf(customLozenges[0].text as React.ReactElement | string);

			expect(getByText(childText)).not.toBeNull();
		});
	});
});
