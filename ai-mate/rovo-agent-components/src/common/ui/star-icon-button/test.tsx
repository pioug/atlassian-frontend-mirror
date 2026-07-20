import React from 'react';

import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen } from '@atlassian/testing-library';

import { StarIconButton } from './index';

describe('StarIconButton', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const renderComponent = ({
		isStarred = false,
		agentName = 'Test Agent',
		useIconButton = true,
	}: { isStarred?: boolean; agentName?: string; useIconButton?: boolean } = {}) => {
		if (useIconButton) {
			passGate('rovo_agent_star_icon_button');
		} else {
			failGate('rovo_agent_star_icon_button');
		}

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
			screen.getByRole('button', {
				name: 'Add Project Testing Assistant to favourites',
			}),
		).toBeInTheDocument();
	});

	it('should render a label unique to the agent when starred', () => {
		renderComponent({ isStarred: true, agentName: 'Project Testing Assistant' });

		expect(
			screen.getByRole('button', {
				name: 'Remove Project Testing Assistant from favourites',
			}),
		).toBeInTheDocument();
	});

	it('should preserve the legacy button when the feature gate is disabled', () => {
		renderComponent({
			isStarred: false,
			agentName: 'Project Testing Assistant',
			useIconButton: false,
		});

		expect(
			screen.getByRole('img', {
				name: 'Add Project Testing Assistant to favourites',
			}),
		).toBeInTheDocument();
	});
});
