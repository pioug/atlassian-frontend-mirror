import { createIntl } from 'react-intl';

import { getPromptAction, RovoChatPromptKey } from '../index';

describe('getPromptAction', () => {
	const intl = createIntl({ locale: 'en' });
	const url = 'https://docs.google.com/spreadsheets/d/abc123/edit';

	describe('VISUALIZE', () => {
		it('converts the prompt into a paragraph with the link as an inline card', () => {
			const action = getPromptAction({ promptKey: RovoChatPromptKey.VISUALIZE, intl, url });

			expect(action?.content).toBe('Visualize');
			expect(action?.data.prompt).toEqual({
				type: 'doc',
				version: 1,
				content: [
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'Visualize this link ' },
							{ type: 'inlineCard', attrs: { url } },
						],
					},
				],
			});
		});
	});
});
