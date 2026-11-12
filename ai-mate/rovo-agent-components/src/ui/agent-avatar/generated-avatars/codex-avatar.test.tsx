import React from 'react';

import { IntlProvider } from 'react-intl';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { AgentAvatar } from '../index';

describe('Codex avatar', () => {
	it.each([false, true])(
		'renders the Codex SVG with ADS Avatar enabled=%s',
		async (useAdsAvatar) => {
			const { container } = render(
				<IntlProvider locale="en">
					<AgentAvatar
						agentNamedId="codex_for_jira_agent"
						name="Codex for Jira"
						size="large"
						UNSAFE_useAdsAvatar={useAdsAvatar}
					/>
				</IntlProvider>,
			);

			const avatar = await screen.findByTestId('codex-agent-avatar');
			expect(avatar).toHaveAttribute('viewBox', '0 0 24 27');
			expect(avatar).toHaveAttribute('width', '40');
			expect(avatar).toHaveAttribute('height', '40');
			expect(avatar).toHaveAttribute('aria-hidden', 'true');
			expect(container.querySelector('img')).not.toBeInTheDocument();
		},
	);

	it('preserves an explicit image URL for Codex without generating an avatar', () => {
		const { container } = render(
			<IntlProvider locale="en">
				<AgentAvatar
					agentNamedId="codex_for_jira_agent"
					imageUrl="https://example.com/custom-avatar.png"
					name="Custom avatar"
				/>
			</IntlProvider>,
		);

		expect(container.querySelector('img')).toHaveAttribute(
			'src',
			'https://example.com/custom-avatar.png',
		);
	});
});
