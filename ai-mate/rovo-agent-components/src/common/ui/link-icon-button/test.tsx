import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { render, screen } from '@atlassian/testing-library';

import { LinkIconButton } from './index';

describe('LinkIconButton', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const renderComponent = (agentName: string) => {
		return render(
			<IntlProvider locale="en">
				<LinkIconButton handleCopy={jest.fn()} agentName={agentName} />
			</IntlProvider>,
		);
	};

	it('should be accessible', async () => {
		const { container } = renderComponent('Project Testing Assistant');

		await expect(container).toBeAccessible();
	});

	it('should render a label unique to the agent', () => {
		renderComponent('Project Testing Assistant');

		expect(
			screen.getByRole('button', { name: 'Copy link to Project Testing Assistant' }),
		).toBeInTheDocument();
	});
});
