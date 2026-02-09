import React from 'react';

import { screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import * as atlassianContext from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	type AnalyticsEventAttributes,
	useAnalyticsEvents as useAnalyticsEventsNext,
} from '@atlaskit/teams-app-internal-analytics';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener as render,
} from '@atlassian/ptc-test-utils';

import { flexiTime } from '../../../__tests__/unit/helper/_mock-analytics';
import type { AnalyticsFromDuration } from '../../../types';
import { fireEvent, profileCardRendered } from '../../../util/analytics';
import TeamProfileCard from '../TeamProfileCard';

const createMembers = (count: number) => {
	return Array.from({ length: count }, (_, i) => ({
		id: String(i),
		fullName: `user-${i}`,
		avatarUrl: `avatar-url-${i}`,
	}));
};

const createTeam = (membersCount: number = 2) => ({
	id: 'team-1',
	displayName: 'Test Team',
	description: 'This is a test team',
	members: createMembers(membersCount),
	largeHeaderImageUrl: 'large-image-url',
	smallHeaderImageUrl: 'small-image-url',
	isVerified: true,
});

const actions = [
	{
		label: 'Action 1',
		link: 'https://example.com/action1',
		callback: jest.fn(),
		id: 'action-1',
	},
];

mockRunItLaterSynchronously();
jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon', () => ({
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
}));

jest.mock('@atlaskit/platform-feature-flags');

jest.mock('@atlaskit/atlassian-context', () => ({
	...jest.requireActual('@atlaskit/atlassian-context'),
	isFedRamp: jest.fn(() => false),
}));

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	initialize: jest.fn(),
	initializeCalled: jest.fn(),
	initializeFromValues: jest.fn(),
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
	initializeCompleted: () => true,
}));

const TeamProfileCardTestWrapper = (props = {}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { fireEvent: fireEventNext } = useAnalyticsEventsNext();
	const fireAnalyticsWithDuration = (generator: AnalyticsFromDuration) => {
		const event = generator(0);
		fireEvent(createAnalyticsEvent, event);
	};

	const fireAnalyticsWithDurationNext = <K extends keyof AnalyticsEventAttributes>(
		eventKey: K,
		generator: (duration: number) => AnalyticsEventAttributes[K],
	) => {
		const attributes = generator(0);
		fireEventNext(eventKey, attributes);
	};

	return (
		<IntlProvider locale="en">
			<TeamProfileCard
				analytics={fireAnalyticsWithDuration}
				analyticsNext={fireAnalyticsWithDurationNext}
				team={createTeam()}
				viewingUserId="1"
				generateUserLink={jest.fn()}
				onUserClick={jest.fn()}
				viewProfileLink="https://example.com/profile"
				viewProfileOnClick={jest.fn()}
				actions={actions}
				{...props}
			/>
		</IntlProvider>
	);
};

const renderComponent = (props = {}) => {
	return render(<TeamProfileCardTestWrapper {...props} />);
};

describe('TeamProfileCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(performance, 'now').mockReturnValue(1000);
	});

	test('renders the verified team icon when team is verified', () => {
		renderComponent();

		expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
		expect(screen.getByText('Test Team')).toBeInTheDocument();
		expect(screen.getByText('This is a test team')).toBeInTheDocument();
		expect(screen.getByText('VerifiedTeamIcon')).toBeInTheDocument();
	});

	test('does not render the verified team icon when team is not verified', () => {
		renderComponent({ team: { ...createTeam(), isVerified: false } });

		expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
		expect(screen.getByText('Test Team')).toBeInTheDocument();
		expect(screen.getByText('This is a test team')).toBeInTheDocument();
		expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();
	});

	test('displays a more indicator when there are more than 9 reports', () => {
		renderComponent({ team: createTeam(10) });
		const moreIndicator = screen.getByText('+2', { selector: 'button' });
		expect(moreIndicator).toBeInTheDocument();
		expect(moreIndicator).toHaveAttribute('aria-label', '+2 more members');
	});

	test('renders the avatar group with the overrides', () => {
		renderComponent({ team: createTeam(10) });

		const avatarGroup = screen.getByTestId('profilecard-avatar-group--avatar-group');
		const firstAvatar = screen.getByTestId('first-member');
		expect(avatarGroup).toBeInTheDocument();
		expect(firstAvatar).toBeInTheDocument();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent();
		await expect(container).toBeAccessible();
	});

	describe('DISBANDED team state', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			// Enable new team profile by default (not FedRamp environment)
			(atlassianContext.isFedRamp as jest.Mock).mockReturnValue(false);
			(fg as jest.Mock).mockReturnValue(false);
		});

		it('displays archived lozenge when team is DISBANDED', () => {
			const disbandedTeam = {
				...createTeam(),
				state: 'DISBANDED' as const,
			};
			renderComponent({ team: disbandedTeam });

			expect(screen.getByText('Archived')).toBeInTheDocument();
		});

		it('does not display archived lozenge when team is ACTIVE', () => {
			const activeTeam = {
				...createTeam(),
				state: 'ACTIVE' as const,
			};
			renderComponent({ team: activeTeam });

			expect(screen.queryByText('Archived')).not.toBeInTheDocument();
		});

		it('does not display archived lozenge when team state is undefined', () => {
			const teamWithoutState = createTeam();
			renderComponent({ team: teamWithoutState });

			expect(screen.queryByText('Archived')).not.toBeInTheDocument();
		});

		it('does not display archived lozenge when new team profile is disabled', () => {
			// Disable new team profile: isFedRamp = true AND fg = false
			(atlassianContext.isFedRamp as jest.Mock).mockReturnValue(true);
			(fg as jest.Mock).mockReturnValue(false);
			const disbandedTeam = {
				...createTeam(),
				state: 'DISBANDED' as const,
			};
			renderComponent({ team: disbandedTeam });

			expect(screen.queryByText('Archived')).not.toBeInTheDocument();
		});
	});

	describe('analytics', () => {
		const event = flexiTime(
			profileCardRendered('team', 'content', {
				duration: 0,
				numActions: 2,
				memberCount: 2,
				includingYou: true,
				descriptionLength: 19,
				titleLength: 9,
			}),
		);
		// Payload to GASv3 does not contain eventType
		const { eventType: _eventType, ...eventWithoutType } = event;

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			test('fires the analytics events', () => {
				const { expectEventToBeFired } = renderComponent();
				expectEventToBeFired('ui', eventWithoutType);
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			test('fires the analytics events', () => {
				const { expectEventToBeFired } = renderComponent();
				expectEventToBeFired('ui', eventWithoutType);
			});
		});
	});
});
