import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { renderWithAnalyticsListener as render } from '@atlassian/ptc-test-utils';

import { type ContainerTypes } from '../../../../common/types';

import { TeamLinkCard } from './index';

jest.mock('../../../../common/utils/get-container-properties', () => ({
	getContainerProperties: jest.fn(() => ({
		description: 'Test Description',
		containerTypeText: 'Test Type',
	})),
}));

jest.mock('../../../../common/utils/get-link-domain', () => ({
	getDomainFromLinkUri: jest.fn((url: string) => {
		if (url === 'https://www.loom.com/share/123') {
			return 'loom.com';
		}
		return 'example.com';
	}),
}));

const defaultProps = {
	containerType: 'ConfluenceSpace' as ContainerTypes,
	title: 'Test Container',
	containerId: 'test-id',
	link: 'https://example.com',
	onDisconnectButtonClick: jest.fn(),
	onEditLinkClick: jest.fn(),
};

const renderWithIntl = (component: React.ReactElement) => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('TeamLinkCard Analytics', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const event = {
		action: 'clicked',
		actionSubject: 'container',
		actionSubjectId: 'teamContainer',
		attributes: {
			containerSelected: {
				container: 'ConfluenceSpace',
				containerId: 'test-id',
			},
		},
	};

	const eventWithLinkDomain = {
		...event,
		attributes: {
			containerSelected: {
				container: 'WebLink',
				containerId: 'test-id',
				linkDomain: 'loom.com',
			},
		},
	};

	it('should fire legacy analytics event when container link is clicked', async () => {
		const { expectEventToBeFired } = renderWithIntl(<TeamLinkCard {...defaultProps} />);

		const link = screen.getByTestId('team-link-card-linkable-content');
		expect(link).toBeInTheDocument();
		await userEvent.click(link);

		expectEventToBeFired('ui', event);
	});

	it('should fire legacy analytics event with linkDomain when WebLink container link is clicked', async () => {
		const { expectEventToBeFired } = renderWithIntl(
			<TeamLinkCard
				{...defaultProps}
				containerType="WebLink"
				link="https://www.loom.com/share/123"
			/>,
		);

		const link = screen.getByTestId('team-link-card-linkable-content');
		expect(link).toBeInTheDocument();
		await userEvent.click(link);
		expectEventToBeFired('ui', eventWithLinkDomain);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<TeamLinkCard {...defaultProps} />);
		await userEvent.click(screen.getByTestId('team-link-card-linkable-content'));
		await expect(container).toBeAccessible();
	});
});
