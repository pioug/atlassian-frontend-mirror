import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MultiValue, scrollToValue } from '../../../components/MultiValue';
import { type Email, EmailType, type User, type Team } from '../../../types';
import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/icon/core/migration/email', () => {
	return ({ label }: any) => <div aria-label={label}>EmailIcon</div>;
});

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

/**
 * ffTest.on is causing some issues, given the mock is only temporary I'm just manually mocking the fg function
 */
jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
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

	const shallowMultiValue = ({ components, ...props }: any = { components: {} }) =>
		shallow(
			<MultiValue
				data={data}
				removeProps={{ onClick }}
				selectProps={{ isDisabled: false }}
				{...props}
			/>,
		);

	const renderMultiValue = ({ components, ...props }: any = { components: {} }) =>
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

	it('should scroll to open from bottom', () => {
		const current = mockHtmlElement({ top: 10, height: 20 });
		const parent = mockHtmlElement({ height: 100 });
		scrollToValue(current, parent);
		expect(current.scrollIntoView).toHaveBeenCalled();
		expect(current.scrollIntoView).toHaveBeenCalledWith();
	});

	it('should scroll to open from top', () => {
		const current = mockHtmlElement({ top: 90, height: 20 });
		const parent = mockHtmlElement({ height: 100 });
		scrollToValue(current, parent);
		expect(current.scrollIntoView).toHaveBeenCalled();
		expect(current.scrollIntoView).toHaveBeenCalledWith(false);
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

			expect(await screen.findByText('EmailIcon')).toBeInTheDocument();
			expect(await screen.findByLabelText('invite')).toBeInTheDocument();
		});
	});

	describe('Team', () => {
		const team: Team = {
			name: 'team name',
			type: 'team',
			id: 'team-id',
		};

		(fg as jest.Mock).mockReturnValue(true);

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
		});

		it('should not render verified team icon if team is not verified', () => {
			renderTeamValue({
				...team,
				verified: false,
			});
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();
		});
	});
});
