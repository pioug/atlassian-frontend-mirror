import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageDescriptor } from 'react-intl-next';

import { ButtonSection } from './index';

jest.mock('react-intl-next', () => ({
	...jest.requireActual('react-intl-next'),
	useIntl: jest.fn().mockReturnValue({
		formatMessage: ({ defaultMessage }: MessageDescriptor) => defaultMessage,
	}),
}));

jest.mock('@atlaskit/give-kudos', () => ({
	...jest.requireActual('@atlaskit/give-kudos'),
	GiveKudosLauncherLazy: jest
		.fn()
		.mockImplementation(({ isOpen }) => (isOpen ? <div>GiveKudosLauncherLazy</div> : null)),
}));

describe('ButtonSection', () => {
	const teamProfileUrl =
		'https://test-prod-issue-create.atlassian.net/wiki/people/team/8ee37950-7de7-41ec-aee2-2c02c95949f4';
	const cloudId = 'test-cloud-id';
	const teamId = 'test-team-id';

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ButtonSection teamProfileUrl={teamProfileUrl} cloudId={cloudId} teamId={teamId} />,
		);
		await expect(container).toBeAccessible();
	});

	it('should not render the team profile button if the url is not provided', () => {
		render(<ButtonSection cloudId={cloudId} teamId={teamId} />);
		expect(screen.queryByRole('link', { name: /View profile*/ })).not.toBeInTheDocument();
	});

	it('should render the team profile button', () => {
		render(<ButtonSection teamProfileUrl={teamProfileUrl} cloudId={cloudId} teamId={teamId} />);
		expect(screen.getByRole('link', { name: /View profile*/ })).toBeVisible();
	});

	it('should not render the show more button if no other actions are provided', () => {
		render(<ButtonSection teamProfileUrl={teamProfileUrl} cloudId={cloudId} teamId={teamId} />);
		expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
	});

	it('should render the show more button if other actions are provided', () => {
		render(
			<ButtonSection
				teamProfileUrl={teamProfileUrl}
				cloudId={cloudId}
				teamId={teamId}
				otherActions={[
					{ id: '1', item: <button>Action 1 </button> },
					{ id: '2', item: <button>Action 2 </button> },
				]}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Show more' })).toBeVisible();
	});

	it('should render the kudos button if the team has kudos enabled and show more button is clicked', async () => {
		render(
			<ButtonSection
				teamProfileUrl={teamProfileUrl}
				isKudosEnabled
				cloudId={cloudId}
				teamCentralBaseUrl="test-team-central-base-url"
				teamId={teamId}
				analyticsSource="test-analytics-source"
			/>,
		);
		const showMoreButton = screen.getByRole('button', { name: 'Show more' });
		expect(showMoreButton).toBeVisible();
		await userEvent.click(showMoreButton);

		expect(screen.getByRole('button', { name: 'Give kudos' })).toBeVisible();
	});

	it('should launch the kudos drawer when the kudos button is clicked', async () => {
		render(
			<ButtonSection
				teamProfileUrl={teamProfileUrl}
				isKudosEnabled
				cloudId={cloudId}
				teamCentralBaseUrl="test-team-central-base-url"
				teamId={teamId}
				analyticsSource="test-analytics-source"
			/>,
		);
		const showMoreButton = screen.getByRole('button', { name: 'Show more' });
		await userEvent.click(showMoreButton);

		expect(screen.getByRole('button', { name: 'Give kudos' })).toBeVisible();
		await userEvent.click(screen.getByRole('button', { name: 'Give kudos' }));
		expect(screen.getByText('GiveKudosLauncherLazy')).toBeVisible();
	});

	it('should render other actions if provided and show more button is clicked', async () => {
		render(
			<ButtonSection
				teamProfileUrl={teamProfileUrl}
				cloudId={cloudId}
				teamId={teamId}
				otherActions={[
					{ id: '1', item: <button>Action 1 </button> },
					{ id: '2', item: <button>Action 2 </button> },
				]}
			/>,
		);
		const showMoreButton = screen.getByRole('button', { name: 'Show more' });
		expect(showMoreButton).toBeVisible();
		await userEvent.click(showMoreButton);

		expect(screen.getByRole('button', { name: 'Action 1' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Action 2' })).toBeVisible();
	});
});
