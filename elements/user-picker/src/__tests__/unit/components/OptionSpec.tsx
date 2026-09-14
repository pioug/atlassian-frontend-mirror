import noop from 'lodash/noop';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Option } from '../../../components/Option';
import {
	type Custom,
	type Email,
	type ExternalUser,
	type Group,
	type Team,
	type User,
} from '../../../types';

describe('Option', () => {
	const renderOption = (props: Record<string, unknown>) =>
		render(
			<IntlProvider locale="en" messages={{}}>
				<Option
					getStyles={noop}
					cx={noop}
					getClassNames={noop}
					innerProps={{}}
					isDisabled={false}
					isFocused={false}
					selectProps={{}}
					{...(props as any)}
				/>
			</IntlProvider>,
		);

	describe('UserOption', () => {
		const user: User = {
			id: 'abc-123',
			name: 'Jace Beleren',
			publicName: 'jbeleren',
			avatarUrl: 'http://avatars.atlassian.com/jace.png',
			type: 'user',
		};

		it('renders the user option content', async () => {
			renderOption({
				data: { data: user, label: user.name, value: user.id },
				isSelected: true,
				status: 'online',
			});

			expect(await screen.findByText(user.name)).toBeInTheDocument();
			expect(screen.getByText('(jbeleren)')).toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('passes the default option content through renderOptionContent', async () => {
			renderOption({
				data: { data: user, label: user.name, value: user.id },
				isSelected: true,
				renderOptionContent: (defaultContent: React.ReactNode) => (
					<div data-testid="wrapped-option-content">{defaultContent}</div>
				),
			});

			expect(await screen.findByTestId('wrapped-option-content')).toContainElement(
				screen.getByText(user.name),
			);
		});
	});

	describe('ExternalUserOption', () => {
		const externalUser: ExternalUser = {
			id: 'external-user-123',
			name: 'That Awesome External User',
			type: 'user',
			isExternal: true,
			sources: [],
		};

		it('renders the external user option content', async () => {
			renderOption({
				data: {
					data: externalUser,
					label: externalUser.name,
					value: externalUser.id,
				},
				status: 'online',
				isSelected: true,
			});

			expect(await screen.findByText(externalUser.name)).toBeInTheDocument();
			expect(await screen.findByTestId('source-icon')).toBeInTheDocument();
		});
	});

	describe('EmailOption', () => {
		const email: Email = {
			type: 'email',
			id: 'test@test.com',
			name: 'test@test.com',
		};

		it('renders the email option content', async () => {
			renderOption({
				data: { data: email, label: email.name, value: email.id },
				isSelected: false,
				selectProps: { emailLabel: 'Invite' },
			});

			expect(screen.getByText(email.name)).toBeInTheDocument();
			expect(await screen.findByTestId('user-picker-email-secondary-text')).toHaveTextContent(
				'Invite',
			);
		});
	});

	describe('TeamOption', () => {
		const team: Team = {
			id: 'team-123',
			name: 'That Awesome team',
			type: 'team',
		};

		it('renders the team option content', async () => {
			renderOption({
				data: { data: team, label: team.name, value: team.id },
				isSelected: true,
			});

			expect(screen.getByText(team.name)).toBeInTheDocument();
		});
	});

	describe('GroupOption', () => {
		const group: Group = {
			id: 'group-123',
			name: 'group-that-groups-groups',
			type: 'group',
		};

		it('renders the group option content', async () => {
			renderOption({
				data: { data: group, label: group.name, value: group.id },
				isSelected: true,
			});

			expect(screen.getByText(group.name)).toBeInTheDocument();
			expect(await screen.findByTestId('user-picker-group-secondary-text')).toBeInTheDocument();
		});
	});

	describe('CustomOption', () => {
		const custom: Custom = {
			id: 'custom-123',
			name: 'custom-options',
			type: 'custom',
		};

		it('renders the custom option content', async () => {
			renderOption({
				data: { data: custom, label: custom.name, value: custom.id },
				isSelected: true,
			});

			expect(screen.getByText(custom.name)).toBeInTheDocument();
		});
	});
});
