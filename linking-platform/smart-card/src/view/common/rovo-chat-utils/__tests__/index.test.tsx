import type { ReactElement } from 'react';

import { createIntl } from 'react-intl';

import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import AiGenerativeTextSummaryIcon from '@atlaskit/icon/core/ai-generative-text-summary';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getPromptAction, RovoChatPromptKey } from '../index';

describe('getPromptAction', () => {
	const intl = createIntl({ locale: 'en' });
	const url = 'https://docs.google.com/spreadsheets/d/abc123/edit';

	describe('SUMMARIZE_LINK', () => {
		const getIconType = () =>
			(
				getPromptAction({ promptKey: RovoChatPromptKey.SUMMARIZE_LINK, intl, url })
					?.icon as ReactElement
			).type;

		it('uses the summary icon when platform_sl_rovo_summarize_icon_consistency is on', () => {
			passGate('platform_sl_rovo_summarize_icon_consistency');
			expect(getIconType()).toBe(AiGenerativeTextSummaryIcon);
		});

		it('uses the chat icon when platform_sl_rovo_summarize_icon_consistency is off', () => {
			failGate('platform_sl_rovo_summarize_icon_consistency');
			expect(getIconType()).toBe(AiChatIcon);
		});
	});

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
