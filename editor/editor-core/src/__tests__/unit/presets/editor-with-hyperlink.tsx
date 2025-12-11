jest.mock('@atlaskit/editor-plugins/hyperlink', () => {
	return {
		hyperlinkPlugin: jest.fn().mockReturnValue({
			name: 'hyperlink',
			commands: {
				showLinkToolbar: jest.fn(),
			},
		}),
	};
});

import React from 'react';

import { render } from '@testing-library/react';

import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';

import { Editor } from '../../../index';

describe('hyperlink lpLinkPicker flag behaviour in editor with universal preset', () => {
	it('should initialise cardOptions to have lpLinkPicker false by default', async () => {
		render(<Editor appearance="full-page" />);
		expect(hyperlinkPlugin).toHaveBeenCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({
					lpLinkPicker: false,
				}),
			}),
		);

		await expect(document.body).toBeAccessible();
	});

	it('should initialise cardOptions to have lpLinkPicker true when feature flag is on', async () => {
		render(
			<Editor
				appearance="full-page"
				featureFlags={{
					'lp-link-picker': true,
				}}
			/>,
		);
		expect(hyperlinkPlugin).toHaveBeenCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({
					lpLinkPicker: true,
				}),
			}),
		);

		await expect(document.body).toBeAccessible();
	});

	it('should initialise cardOptions to have lpLinkPicker false when feature flag is off', async () => {
		render(
			<Editor
				appearance="full-page"
				featureFlags={{
					'lp-link-picker': false,
				}}
			/>,
		);
		expect(hyperlinkPlugin).toHaveBeenCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({
					lpLinkPicker: false,
				}),
			}),
		);

		await expect(document.body).toBeAccessible();
	});
});
