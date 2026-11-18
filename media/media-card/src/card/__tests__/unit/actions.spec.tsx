import React from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { createDownloadAction } from '../../createDownloadAction';

const mockFormatMessage = (descriptor: { defaultMessage: string }) => descriptor.defaultMessage;

describe('createDownloadAction', () => {
	const baseAction = {
		handler: jest.fn(),
	};

	it('should capture and report a11y violations', async () => {
		const action = createDownloadAction(baseAction, mockFormatMessage as any);
		const { container } = render(<>{action.icon}</>);
		await expect(container).toBeAccessible();
	});

	it('sets DownloadIcon as decorative (aria-hidden) so it is not exposed to assistive technology', () => {
		const action = createDownloadAction(baseAction, mockFormatMessage as any);
		render(<>{action.icon}</>);
		// label="" + aria-hidden → no role="img" exposed to AT
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});
});
