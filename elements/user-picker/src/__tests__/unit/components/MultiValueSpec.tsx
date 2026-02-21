import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MultiValue, scrollToValue } from '../../../components/MultiValue';
import { type Email, EmailType, type User, type Team } from '../../../types';

jest.mock('@atlaskit/select', () => ({
	...jest.requireActual('@atlaskit/select'),
	components: {
		...jest.requireActual('@atlaskit/select').components,
		MultiValue: ({ children }: any) => <div>{children}</div>,
	},
}));

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon', () => ({
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
}));

jest.mock('../../../components/AvatarOrIcon', () => ({
	AvatarOrIcon: (props: any) => <div>AvatarOrIcon - {JSON.stringify(props)}</div>,
}));

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: (props: any) => <div>SizeableAvatar - {JSON.stringify(props)}</div>,
}));

const mockHtmlElement = (rect: Partial<DOMRect>): HTMLDivElement =>
	({
		getBoundingClientRect: jest.fn(() => rect),
		scrollIntoView: jest.fn(),
	}) as any;

describe('MultiValue', () => {
	const data = {
		label: 'Jace Beleren',
		data: {
			id: 'abc-123',
			name: 'Jace Beleren',
			publicName: 'jbeleren',
			avatarUrl: 'http://avatars.atlassian.com/jace.png',
		} as User,
	};
	const onClick = jest.fn();

	const shallowMultiValue = ({ _components, ...props }: any = { components: {} }) =>
		shallow(
			<MultiValue
				data={data}
				removeProps={{ onClick }}
				selectProps={{ isDisabled: false }}
				{...props}
			/>,
		);

	const renderMultiValue = ({ _components, ...props }: any = { components: {} }) =>
		render(
			<MultiValue
				data={data}
				removeProps={{ onClick }}
				selectProps={{ isDisabled: false }}
				{...props}
			/>,
		);

	afterEach(() => {
		onClick.mockClear();
	});

	it('should scroll to open from bottom', async () => {
		const current = mockHtmlElement({ top: 10, height: 20 });
		const parent = mockHtmlElement({ height: 100 });
		scrollToValue(current, parent);
		expect(current.scrollIntoView).toHaveBeenCalled();
		expect(current.scrollIntoView).toHaveBeenCalledWith();

		await expect(document.body).toBeAccessible();
	});

	it('should scroll to open from top', async () => {
		const current = mockHtmlElement({ top: 90, height: 20 });
		const parent = mockHtmlElement({ height: 100 });
		scrollToValue(current, parent);
		expect(current.scrollIntoView).toHaveBeenCalled();
		expect(current.scrollIntoView).toHaveBeenCalledWith(false);

		await expect(document.body).toBeAccessible();
	});

	describe('shouldComponentUpdate', () => {
		const defaultProps = {
			data: data,
			isFocused: false,
			innerProps: {},
		};
		test.each([
			[false, defaultProps],
			[
				true,
				{
					...defaultProps,
					isFocused: true,
				},
			],
			[
				true,
				{
					...defaultProps,
					data: {
						...data,
						data: {
							...data.data,
							publicName: 'crazy_jace',
						},
					},
				},
			],
			[
				true,
				{
					...defaultProps,
					data: {
						...data,
						label: 'crazy_jace',
					},
				},
			],
			[
				true,
				{
					...defaultProps,
					innerProps: {},
				},
			],
		])('should return %s for nextProps %p', (shouldUpdate, nextProps) => {
			const component = shallowMultiValue(defaultProps);
			const instance = component.instance();
			expect(
				instance &&
					instance.shouldComponentUpdate &&
					instance.shouldComponentUpdate(nextProps, {}, {}),
			).toEqual(shouldUpdate);
		});
	});

	describe('Email', () => {
		const email: Email = {
			type: EmailType,
			id: 'test@test.com',
			name: 'test@test.com',
		};

		it('should render AddOptionAvatar for email data', async () => {
			renderMultiValue({
				data: { data: email, label: email.name },
				innerProps: {},
				selectProps: {
					emailLabel: 'invite',
				},
			});

			const emailIcon = await screen.getByTestId('add-option-avatar-email-icon');

			expect(emailIcon).toBeInTheDocument();
			expect(emailIcon).toHaveAttribute('aria-hidden', 'true');

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Team', () => {
		const team: Team = {
			name: 'team name',
			type: 'team',
			id: 'team-id',
		};

		const renderTeamValue = (team: Team) =>
			renderMultiValue({
				data: {
					label: team.name,
					value: team.id,
					data: team,
				},
			});

		it('should render verified team icon if team is verified', async () => {
			renderTeamValue({
				...team,
				verified: true,
			});

			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should not render verified team icon if team is not verified', async () => {
			renderTeamValue({
				...team,
				verified: false,
			});
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('Group', () => {
		const mockGroup = {
			name: 'group name',
			type: 'group' as const,
			id: 'group-id',
		};

		const renderGroupValue = (group: any, includeTeamsUpdates = false) =>
			renderMultiValue({
				data: {
					label: group.name,
					value: group.id,
					data: {
						...group,
						includeTeamsUpdates,
					},
				},
			});

		it('should render verified icon for group when includeTeamsUpdates is true', async () => {
			renderGroupValue(mockGroup, true);

			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should not render verified icon for group when includeTeamsUpdates is false', async () => {
			renderGroupValue(mockGroup, false);

			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('icon support', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;

		it('should render AvatarOrIcon when icon is provided', async () => {
			const userWithIcon = {
				...data.data,
				icon: mockIcon,
			};

			renderMultiValue({
				data: { ...data, data: userWithIcon },
			});

			expect(
				await screen.findByText(
					'AvatarOrIcon - {"appearance":"multi","icon":{"type":"div","key":null,"ref":null,"props":{"data-testid":"test-icon","children":"Icon"},"_owner":null,"_store":{}},"src":"http://avatars.atlassian.com/jace.png","type":"person"}',
				),
			).toBeInTheDocument();
		});

		it('should render AvatarOrIcon with iconColor when both icon and iconColor are provided', async () => {
			const iconColor = '#FF0000';
			const userWithIconAndColor = {
				...data.data,
				icon: mockIcon,
				iconColor,
			};

			renderMultiValue({
				data: { ...data, data: userWithIconAndColor },
			});

			expect(
				await screen.findByText(
					'AvatarOrIcon - {"appearance":"multi","icon":{"type":"div","key":null,"ref":null,"props":{"data-testid":"test-icon","children":"Icon"},"_owner":null,"_store":{}},"iconColor":"#FF0000","src":"http://avatars.atlassian.com/jace.png","type":"person"}',
				),
			).toBeInTheDocument();
		});

		it('should render SizeableAvatar when no icon is provided', async () => {
			renderMultiValue();

			expect(
				await screen.findByText(
					'SizeableAvatar - {"appearance":"multi","src":"http://avatars.atlassian.com/jace.png","type":"person"}',
				),
			).toBeInTheDocument();
		});
	});
});
