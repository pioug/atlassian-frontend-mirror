import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { render, screen } from '@atlassian/testing-library';

import { createDownloadAction } from '../../createDownloadAction';

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn().mockReturnValue(false),
}));

const mockFormatMessage = (descriptor: { defaultMessage: string }) => descriptor.defaultMessage;

describe('createDownloadAction', () => {
	const baseAction = {
		handler: jest.fn(),
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		(fg as jest.Mock).mockReturnValue(false);
		const action = createDownloadAction(baseAction, mockFormatMessage as any);
		const { container } = render(<>{action.icon}</>);
		await expect(container).toBeAccessible();
	});

	describe('DownloadIcon label — feature gate platform-a11y-media-card-download-icon-decorative', () => {
		it('sets label="Download" on DownloadIcon when gate is off', () => {
			(fg as jest.Mock).mockReturnValue(false);
			const action = createDownloadAction(baseAction, mockFormatMessage as any);
			render(<>{action.icon}</>);
			// label="Download" → role="img" with accessible name
			expect(screen.getByRole('img', { name: 'Download' })).toBeInTheDocument();
		});

		it('sets icon as decorative (aria-hidden) when gate is on', () => {
			(fg as jest.Mock).mockReturnValue(true);
			const action = createDownloadAction(baseAction, mockFormatMessage as any);
			render(<>{action.icon}</>);
			// label="" + aria-hidden → no role="img" exposed to AT
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});
	});
});
