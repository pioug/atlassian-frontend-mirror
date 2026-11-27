import { RovoChatPromptKey } from '../../rovo-chat-utils';
import { getRovoPostAuthPromptKeys } from '../index';

describe('getRovoPostAuthPromptKeys', () => {
	it.each(['google-object-provider', 'onedrive-object-provider'])(
		'returns summarize post-auth prompts for %s',
		(extensionKey) => {
			expect(
				getRovoPostAuthPromptKeys({
					extensionKey,
				}),
			).toEqual([RovoChatPromptKey.SUMMARIZE_DOCUMENT, RovoChatPromptKey.KEY_HIGHLIGHTS]);
		},
	);

	it.each(['github-object-provider', 'gitlab-object-provider'])(
		'returns code post-auth prompts for %s',
		(extensionKey) => {
			expect(
				getRovoPostAuthPromptKeys({
					extensionKey,
				}),
			).toEqual([RovoChatPromptKey.EXPLAIN_CODE, RovoChatPromptKey.KEY_HIGHLIGHTS]);
		},
	);
});
