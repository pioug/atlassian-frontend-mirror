import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { ExternalUserOption } from '../../../components/ExternalUserOption/main';
import { type ExternalUser, type UserSource, type UserSourceResult } from '../../../types';
import { ExusUserSourceProvider } from '../../../clients/UserSourceProvider';
import { createAndFireEventInElementsChannel } from '../../../analytics';
import { IntlProvider } from 'react-intl-next';

jest.mock('../../../../src/analytics', () => ({
	__esModule: true,
	...(jest.requireActual('../../../../src/analytics') as object),
	createAndFireEventInElementsChannel: jest.fn().mockReturnValue(jest.fn()),
}));

describe('ExternalUserOption', () => {
	const source = 'google';
	const user: ExternalUser = {
		id: 'abc123abc123abc123abc123',
		name: 'Jace Beleren',
		email: 'jbeleren@email.com',
		avatarUrl: 'http://avatars.atlassian.com/jace.png',
		lozenge: 'WORKSPACE',
		isExternal: true,
		sources: [source] as UserSource[],
	};

	const userRequiresHydration: ExternalUser = {
		...user,
		requiresSourceHydration: true,
	};

	// Check for text within some HTML that ignores it being split across nodes
	// eg. <div>jbeleren<span>@email.com</span></div>
	const hasTextIgnoringHtml = (matchingText: string) => (content: string, node: Element | null) => {
		const hasText = (node: Element | null) => node?.textContent === matchingText;
		const nodeHasText = hasText(node);
		const childrenDontHaveText = Array.from(node!.children).every((child) => !hasText(child));

		return nodeHasText && childrenDontHaveText;
	};

	it('should name, email and avatar', async () => {
		render(
			<IntlProvider messages={{}} locale="en">
				<ExternalUserOption user={user} status="approved" isSelected={false} />
			</IntlProvider>,
		);
		expect(screen.getByText(hasTextIgnoringHtml(user.email!))).toBeTruthy();
		expect(screen.getByText(user.name)).toBeTruthy();
		expect(screen.getByRole('img')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should render byline as the secondary text instead of email if byline is passed in', async () => {
		user.byline = 'custom byline';

		render(
			<IntlProvider messages={{}} locale="en">
				<ExternalUserOption user={user} status="approved" isSelected={false} />
			</IntlProvider>,
		);
		expect(screen.queryByText(hasTextIgnoringHtml(user.email!))).not.toBeInTheDocument();
		expect(screen.getByText(hasTextIgnoringHtml(user.byline!))).toBeTruthy();
		expect(screen.getByText(user.name)).toBeTruthy();
		expect(screen.getByRole('img')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	ffTest.on('jira_ai_agent_avatar_user_picker_user_option', 'on', () => {
		it('should render a avatar with the appropriate shape if avatarAppearanceShape is supplied', async () => {
			const getAppearanceForAppTypeSpy = jest.spyOn(
				require('@atlaskit/avatar'),
				'getAppearanceForAppType',
			);
			user.appType = 'agent';

			render(
				<IntlProvider messages={{}} locale="en">
					<ExternalUserOption user={user} status="approved" isSelected={false} />
				</IntlProvider>,
			);

			expect(getAppearanceForAppTypeSpy).toHaveBeenCalledWith('agent');
			expect(getAppearanceForAppTypeSpy).toHaveReturnedWith('hexagon');

			const hexagonAvatar = screen.getByTestId('hexagon-focus-container');
			expect(hexagonAvatar).toBeInTheDocument();

			getAppearanceForAppTypeSpy.mockRestore();

			await expect(document.body).toBeAccessible();
		});
	});

	ffTest.off('jira_ai_agent_avatar_user_picker_user_option', 'off', () => {
		it('should not render a hexagon avatar with the appropriate shape if avatarAppearanceShape is supplied when fg jira_ai_agent_avatar_user_picker_user_option is disabled', async () => {
			const getAppearanceForAppTypeSpy = jest.spyOn(
				require('@atlaskit/avatar'),
				'getAppearanceForAppType',
			);
			user.appType = 'agent';

			render(
				<IntlProvider messages={{}} locale="en">
					<ExternalUserOption user={user} status="approved" isSelected={false} />
				</IntlProvider>,
			);

			expect(getAppearanceForAppTypeSpy).not.toHaveBeenCalled();

			// The hexagon container wrapper does not exist
			const hexagonAvatar = screen.queryByTestId(/hexagon.*container/i);
			expect(hexagonAvatar).not.toBeInTheDocument();

			// When feature flag is off, no avatarAppearanceShape is passed, so Avatar uses default circle
			const avatarElement = screen.getByRole('img');
			expect(avatarElement).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	it('should render a tooltip containing the user sources', async () => {
		const { getByTestId, getByRole, findByRole } = render(
			<IntlProvider messages={{}} locale="en">
				<ExternalUserOption user={user} status="approved" isSelected={false} />
			</IntlProvider>,
		);
		// Sources info icon is visible
		expect(getByTestId('source-icon')).toBeTruthy();
		// Hover over tooltip
		fireEvent.mouseOver(getByTestId('source-icon'));
		await findByRole('tooltip');
		const tooltip = getByRole('tooltip');

		// Tooltip has single source displayed
		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Found in:');
		});

		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Google');
		});

		await expect(document.body).toBeAccessible();
	});

	it('should render tooltip elements and merge async sources into the tooltip contents', async () => {
		const mockFetch = jest.fn(
			() =>
				new Promise<UserSourceResult[]>((resolve) => {
					resolve([
						{
							sourceId: '1234',
							sourceType: 'slack',
						},
					]);
				}),
		);
		const { getByTestId, getByRole, findByRole } = render(
			<IntlProvider messages={{}} locale="en">
				<ExusUserSourceProvider fetchUserSource={mockFetch}>
					<ExternalUserOption user={userRequiresHydration} status="approved" isSelected={false} />
				</ExusUserSourceProvider>
			</IntlProvider>,
		);
		// Hover over tooltip
		fireEvent.mouseOver(getByTestId('source-icon'));
		await findByRole('tooltip');
		const tooltip = getByRole('tooltip');
		// Tooltip has expected sources displayed
		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Found in:');
		});

		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Google');
		});

		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Slack');
		});

		await expect(document.body).toBeAccessible();
	});

	it('should not render tooltip elements when sources collection is empty and user is not external', async () => {
		const userWithEmptySources = {
			...user,
			isExternal: false,
			sources: [],
		};
		const { queryByTestId } = render(
			<IntlProvider messages={{}} locale="en">
				<ExternalUserOption user={userWithEmptySources} status="approved" isSelected={false} />
			</IntlProvider>,
		);
		// Sources info icon is not visible
		expect(queryByTestId('source-icon')).not.toBeTruthy();

		await expect(document.body).toBeAccessible();
	});

	it('should render tooltip elements when sources collection is empty and user is external', async () => {
		const userWithEmptySources = {
			...user,
			sources: [],
		};
		const { queryByTestId } = render(
			<IntlProvider messages={{}} locale="en">
				<ExternalUserOption user={userWithEmptySources} status="approved" isSelected={false} />
			</IntlProvider>,
		);
		// Sources info icon is visible
		expect(queryByTestId('source-icon')).toBeTruthy();

		await expect(document.body).toBeAccessible();
	});

	it('should not render an error in the tooltip if the fetch call fails', async () => {
		const fetchSpy = jest
			.fn()
			.mockImplementation(() => Promise.reject(new Error('Failed to fetch')));
		// Empty sources so that we show the error
		const userWithEmptySources = {
			...userRequiresHydration,
			sources: [],
		};

		const { getByTestId, getByRole, findByRole } = render(
			<ExusUserSourceProvider fetchUserSource={fetchSpy}>
				<IntlProvider messages={{}} locale="en">
					<ExternalUserOption user={userWithEmptySources} status="approved" isSelected={false} />
				</IntlProvider>
			</ExusUserSourceProvider>,
		);
		// Sources info icon is visible
		expect(getByTestId('source-icon')).toBeTruthy();
		// Hover over tooltip
		fireEvent.mouseOver(getByTestId('source-icon'));
		await findByRole('tooltip');
		const tooltip = getByRole('tooltip');
		// Tooltip has error
		await waitFor(() => {
			expect(tooltip).toHaveTextContent("We can't connect you right now.");
		});

		await expect(document.body).toBeAccessible();
	});

	it('should not call fetch sources if user does not require source hydration', async () => {
		const mockFetch = jest.fn(
			() =>
				new Promise<UserSourceResult[]>((resolve) => {
					resolve([
						{
							sourceId: '1234',
							sourceType: 'slack',
						},
					]);
				}),
		);

		const userNoHydration: ExternalUser = {
			...user,
			requiresSourceHydration: false,
		};

		const { getByTestId, getByRole, findByRole } = render(
			<ExusUserSourceProvider fetchUserSource={mockFetch}>
				<IntlProvider messages={{}} locale="en">
					<ExternalUserOption user={userNoHydration} status="approved" isSelected={false} />
				</IntlProvider>
			</ExusUserSourceProvider>,
		);
		// Sources info icon is visible
		expect(getByTestId('source-icon')).toBeTruthy();
		// Hover over tooltip
		fireEvent.mouseOver(getByTestId('source-icon'));
		await findByRole('tooltip');
		const tooltip = getByRole('tooltip');

		// Tooltip has single source displayed
		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Found in:');
		});
		await waitFor(() => {
			expect(tooltip).toHaveTextContent('Google');
		});
		await waitFor(() => {
			expect(tooltip).not.toHaveTextContent('Slack');
		});

		// fetch was not called
		expect(mockFetch).toBeCalledTimes(0);

		await expect(document.body).toBeAccessible();
	});

	describe('Analytics Events', () => {
		it('should fire an event when the sources tooltip is viewed', async () => {
			expect.assertions(2);
			const { getByTestId, findByRole } = render(
				<IntlProvider messages={{}} locale="en">
					<ExternalUserOption user={user} status="approved" isSelected={false} />
				</IntlProvider>,
			);
			// Sources info icon is visible
			expect(getByTestId('source-icon')).toBeTruthy();
			// Hover over tooltip
			fireEvent.mouseOver(getByTestId('source-icon'));
			await findByRole('tooltip');
			// Event is fired when tooltip is displayed
			expect(createAndFireEventInElementsChannel).toHaveBeenCalledWith({
				action: 'displayed',
				actionSubject: 'userInfo',
				attributes: {
					accountId: 'abc123abc123abc123abc123',
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					sources: ['google'],
				},
				eventType: 'ui',
			});
		});

		it('should not include PII when the sources tooltip is viewed', async () => {
			expect.assertions(2);
			const { getByTestId, findByRole } = render(
				<IntlProvider messages={{}} locale="en">
					<ExternalUserOption
						user={{ ...user, id: 'test@atlassian.com' }}
						status="approved"
						isSelected={false}
					/>
				</IntlProvider>,
			);
			// Sources info icon is visible
			expect(getByTestId('source-icon')).toBeTruthy();
			// Hover over tooltip
			fireEvent.mouseOver(getByTestId('source-icon'));
			await findByRole('tooltip');
			// Event is fired when tooltip is displayed
			expect(createAndFireEventInElementsChannel).toHaveBeenCalledWith({
				action: 'displayed',
				actionSubject: 'userInfo',
				attributes: {
					accountId: null,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					sources: ['google'],
				},
				eventType: 'ui',
			});
		});
	});
});
