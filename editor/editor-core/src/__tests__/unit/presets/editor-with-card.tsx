jest.mock('@atlaskit/editor-plugins/card', () => {
	return {
		cardPlugin: jest.fn().mockReturnValue({
			name: 'card',
			commands: {
				showLinkToolbar: jest.fn(),
			},
		}),
	};
});
import React from 'react';

import { render } from '@testing-library/react';

import type { CardOptions } from '@atlaskit/editor-common/card';
import { cardPlugin } from '@atlaskit/editor-plugins/card';

import { Editor } from '../../../index';

describe('hyperlink lpLinkPicker flag behaviour in editor with universal preset', () => {
	describe('cardPlugin is called with the right config', () => {
		const linkingCardOptions: CardOptions = {
			provider: Promise.resolve({} as any),
		};
		it('should initialise cardOptions to have lpLinkPicker false by default', async () => {
			render(<Editor appearance="full-page" linking={{ smartLinks: linkingCardOptions }} />);
			expect(cardPlugin).toHaveBeenCalledWith(
				expect.objectContaining({
					config: expect.objectContaining({
						lpLinkPicker: false,
					}),
				}),
			);
		});

		it('should initialise cardOptions to have lpLinkPicker true when feature flag is on', async () => {
			render(
				<Editor
					appearance="full-page"
					linking={{ smartLinks: linkingCardOptions }}
					featureFlags={{
						'lp-link-picker': true,
					}}
				/>,
			);
			expect(cardPlugin).toHaveBeenCalledWith(
				expect.objectContaining({
					config: expect.objectContaining({
						lpLinkPicker: true,
					}),
				}),
			);
		});

		it('should initialise cardOptions to have lpLinkPicker false when feature flag is off', async () => {
			render(
				<Editor
					appearance="full-page"
					linking={{ smartLinks: linkingCardOptions }}
					featureFlags={{
						'lp-link-picker': false,
					}}
				/>,
			);
			expect(cardPlugin).toHaveBeenCalledWith(
				expect.objectContaining({
					config: expect.objectContaining({
						lpLinkPicker: false,
					}),
				}),
			);
		});
	});
});
