import React from 'react';

import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '../../common/utils/test';

import { VerifiedTeamIcon } from './main';

describe('VerifiedTeamIcon', () => {
	it('should render the icon', () => {
		renderWithIntl(<VerifiedTeamIcon />);

		expect(screen.getByLabelText('Verified Team')).toBeVisible();
	});

	it('should render the icon with a default tooltip if showTooltip is passed', async () => {
		renderWithIntl(<VerifiedTeamIcon showTooltip />);
		const verifiedTeamIcon = screen.getByTestId('verified-team-icon');
		expect(verifiedTeamIcon).toBeVisible();

		await act(async () => {
			await userEvent.hover(verifiedTeamIcon);
		});

		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(
			/this team is verified because it can only be changed by admin/i,
		);
	});

	it('should render the icon with a custom tooltip if both showTooltip and customTooltipContent are passed', async () => {
		renderWithIntl(<VerifiedTeamIcon showTooltip customTooltipContent="Custom tooltip content" />);

		const verifiedTeamIcon = screen.getByTestId('verified-team-icon');
		expect(verifiedTeamIcon).toBeVisible();

		await act(async () => {
			await userEvent.hover(verifiedTeamIcon);
		});

		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(/^Custom tooltip content/);
	});

	it('should not render the icon with a tooltip if only customTooltipContent is passed but showTooltip is not passed', async () => {
		renderWithIntl(<VerifiedTeamIcon customTooltipContent="Custom tooltip content" />);

		const verifiedTeamIcon = screen.getByLabelText('Verified Team');
		expect(verifiedTeamIcon).toBeVisible();

		await act(async () => {
			await userEvent.hover(verifiedTeamIcon);
		});

		expect(await screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<VerifiedTeamIcon />);
		await expect(container).toBeAccessible();
	});
});
