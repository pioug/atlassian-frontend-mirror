import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import { StarIconButton } from './index';

describe('StarIconButton', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const renderComponent = ({
		isStarred = false,
		agentName = 'Test Agent',
	}: { isStarred?: boolean; agentName?: string } = {}) => {
		return render(
			<IntlProvider locale="en">
				<StarIconButton isStarred={isStarred} handleToggle={jest.fn()} agentName={agentName} />
			</IntlProvider>,
		);
	};

	it('should be accessible when not starred', async () => {
		const { container } = renderComponent({ isStarred: false });

		await expect(container).toBeAccessible();
	});

	it('should be accessible when starred', async () => {
		const { container } = renderComponent({ isStarred: true });

		await expect(container).toBeAccessible();
	});

	it('should render a label unique to the agent when not starred', () => {
		renderComponent({ isStarred: false, agentName: 'Project Testing Assistant' });

		expect(
			screen.getByRole('img', {
				name: 'Add Project Testing Assistant to favourites',
			}),
		).toBeInTheDocument();
	});

	it('should render a label unique to the agent when starred', () => {
		renderComponent({ isStarred: true, agentName: 'Project Testing Assistant' });

		expect(
			screen.getByRole('img', {
				name: 'Remove Project Testing Assistant from favourites',
			}),
		).toBeInTheDocument();
	});
});
