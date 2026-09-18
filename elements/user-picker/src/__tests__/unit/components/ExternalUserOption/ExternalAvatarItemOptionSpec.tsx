import React from 'react';

import { render, screen } from '@testing-library/react';

import { ExternalAvatarItemOption } from '../../../../components/ExternalUserOption/ExternalAvatarItemOption';

describe('ExternalAvatarItemOption', () => {
	const avatar = 'Avatar';
	const primaryText = 'PrimaryText';
	const secondaryText = 'SecondaryText';
	const sourcesInfoTooltip = 'Sources Info Tooltip';

	it('renders the avatar and primary and secondary text', async () => {
		render(
			<ExternalAvatarItemOption
				primaryText={primaryText}
				secondaryText={secondaryText}
				avatar={avatar}
			/>,
		);

		expect(screen.getByText(avatar)).toBeInTheDocument();
		expect(screen.getByText(primaryText)).toBeInTheDocument();
		expect(screen.getByText(secondaryText)).toBeInTheDocument();
		expect(screen.queryByText(sourcesInfoTooltip)).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('renders the sources information when supplied', () => {
		render(
			<ExternalAvatarItemOption
				primaryText={primaryText}
				secondaryText={secondaryText}
				avatar={avatar}
				sourcesInfoTooltip={sourcesInfoTooltip}
			/>,
		);

		expect(screen.getByText(avatar)).toBeInTheDocument();
		expect(screen.getByText(primaryText)).toBeInTheDocument();
		expect(screen.getByText(secondaryText)).toBeInTheDocument();
		expect(screen.getByText(sourcesInfoTooltip)).toBeInTheDocument();
	});
});
