import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { MultiValue } from '../../../components/MultiValue';
import { scrollToValue } from '../../../components/scrollToValue';
import { type Email, EmailType, type User, type Team } from '../../../types';

jest.mock('@atlaskit/react-select/components', () => ({
	...jest.requireActual('@atlaskit/react-select/components'),
	components: {
		...jest.requireActual('@atlaskit/react-select/components').components,
		MultiValue: ({ children }: any) => <div>{children}</div>,
	},
}));

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon/main', () => ({
	...jest.requireActual('@atlaskit/people-teams-ui-public/verified-team-icon/main'),
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
}));

jest.mock('../../../components/AvatarOrIcon', () => ({
	AvatarOrIcon: (props: any) => <div>AvatarOrIcon - {JSON.stringify(props)}</div>,
}));

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: (props: any) => <div>SizeableAvatar - {JSON.stringify(props)}</div>,
}));

jest.mock('@atlaskit/tag/avatar-tag', () => ({
	...jest.requireActual('@atlaskit/tag/avatar-tag'),
	__esModule: true,
	default: (props: { text: string }) => (
		<div data-testid="user-picker-avatar-tag">{props.text}</div>
	),
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

	describe('archived team lozenge', () => {
		const renderMultiValueWithIntl = (props: any = {}) =>
			render(
				<IntlProvider locale="en">
					<MultiValue
						data={data}
						removeProps={{ onClick: jest.fn() }}
						selectProps={{ isDisabled: false }}
						{...props}
					/>
				</IntlProvider>,
			);

		it('should render Archived lozenge when team state is DISBANDED', async () => {
			const disbandedTeam: Team = {
				name: 'Archived Team',
				type: 'team',
				id: 'team-disbanded',
				state: 'DISBANDED',
			};

			renderMultiValueWithIntl({
				data: {
					label: disbandedTeam.name,
					value: disbandedTeam.id,
					data: disbandedTeam,
				},
			});

			expect(screen.getByText('Archived')).toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('should not render Archived lozenge when team state is ACTIVE', async () => {
			const activeTeam: Team = {
				name: 'Active Team',
				type: 'team',
				id: 'team-active',
				state: 'ACTIVE',
			};

			renderMultiValueWithIntl({
				data: {
					label: activeTeam.name,
					value: activeTeam.id,
					data: activeTeam,
				},
			});

			expect(screen.queryByText('Archived')).not.toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('should not render Archived lozenge for user (non-team) option', async () => {
			const user: User = {
				name: 'John Doe',
				id: 'user-1',
				avatarUrl: 'http://example.com/avatar.png',
			};

			renderMultiValueWithIntl({
				data: {
					label: user.name,
					value: user.id,
					data: user,
				},
			});

			expect(screen.queryByText('Archived')).not.toBeInTheDocument();
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

	describe('AvatarTag (platform-dst-lozenge-tag-badge-visual-uplifts)', () => {
		it('should render AvatarTag for user when flag is on', async () => {
			passGate('platform-dst-lozenge-tag-badge-visual-uplifts');

			renderMultiValue();

			const avatarTag = await screen.findByTestId('user-picker-avatar-tag');
			expect(avatarTag).toBeInTheDocument();
			expect(avatarTag).toHaveTextContent('Jace Beleren');

			await expect(document.body).toBeAccessible();
		});

		it('should render AvatarTag for team when flag is on', async () => {
			passGate('platform-dst-lozenge-tag-badge-visual-uplifts');

			const team: Team = {
				name: 'Design System',
				type: 'team',
				id: 'team-123',
				verified: true,
			};

			renderMultiValue({
				data: {
					label: team.name,
					value: team.id,
					data: team,
				},
			});

			const avatarTag = await screen.findByTestId('user-picker-avatar-tag');
			expect(avatarTag).toBeInTheDocument();
			expect(avatarTag).toHaveTextContent('Design System');

			await expect(document.body).toBeAccessible();
		});

		it('should render SizeableAvatar for user when flag is off', async () => {
			failGate('platform-dst-lozenge-tag-badge-visual-uplifts');

			renderMultiValue();

			expect(
				await screen.findByText(
					'SizeableAvatar - {"appearance":"multi","src":"http://avatars.atlassian.com/jace.png","type":"person"}',
				),
			).toBeInTheDocument();
			expect(screen.queryByTestId('user-picker-avatar-tag')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});
});
