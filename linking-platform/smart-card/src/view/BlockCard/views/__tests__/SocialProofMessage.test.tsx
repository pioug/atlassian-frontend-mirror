import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import SocialProofMessage from '../SocialProofMessage';

const renderWithIntl = (ui: React.ReactElement) =>
	render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('SocialProofMessage', () => {
	describe('not-low tier', () => {
		it('renders percentage with provider name', () => {
			renderWithIntl(
				<SocialProofMessage tier="not-low" connectedPct={45} providerName="OneDrive" />,
			);

			expect(screen.getByTestId('smart-block-social-proof-message')).toBeInTheDocument();
			expect(screen.getByText(/45%/)).toBeInTheDocument();
			expect(screen.getByText('OneDrive')).toBeInTheDocument();
		});

		it('renders provider in bold', () => {
			renderWithIntl(
				<SocialProofMessage tier="not-low" connectedPct={72} providerName="Google Drive" />,
			);

			const providerEl = screen.getByText('Google Drive');
			expect(providerEl.tagName).toBe('STRONG');
		});

		it('renders percentage in bold', () => {
			renderWithIntl(<SocialProofMessage tier="not-low" connectedPct={30} providerName="Slack" />);

			const pctEl = screen.getByText('30%');
			expect(pctEl.tagName).toBe('STRONG');
		});

		it('defaults percentage to 0 when connectedPct is undefined', () => {
			renderWithIntl(<SocialProofMessage tier="not-low" providerName="Figma" />);

			expect(screen.getByText(/0%/)).toBeInTheDocument();
		});
	});

	describe('low tier', () => {
		it('renders without percentage', () => {
			renderWithIntl(<SocialProofMessage tier="low" providerName="OneDrive" />);

			expect(screen.getByTestId('smart-block-social-proof-message')).toBeInTheDocument();
			expect(screen.getByText('OneDrive')).toBeInTheDocument();
			expect(screen.queryByText(/%/)).not.toBeInTheDocument();
		});

		it('renders provider in bold', () => {
			renderWithIntl(<SocialProofMessage tier="low" providerName="Slack" />);

			const providerEl = screen.getByText('Slack');
			expect(providerEl.tagName).toBe('STRONG');
		});
	});

	it('uses custom testId when provided', () => {
		renderWithIntl(<SocialProofMessage tier="low" providerName="Box" testId="custom-test-id" />);

		expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<SocialProofMessage tier="not-low" connectedPct={45} providerName="OneDrive" />,
		);
		await expect(container).toBeAccessible();
	});
});
