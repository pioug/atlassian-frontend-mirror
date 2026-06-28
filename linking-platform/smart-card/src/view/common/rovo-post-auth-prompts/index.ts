import { RovoChatPromptKey } from '../rovo-chat-utils';

export type RovoPostAuthPromptKeysOptions = {
	extensionKey?: string;
};

export const getRovoPostAuthPromptKeys = ({
	extensionKey,
}: RovoPostAuthPromptKeysOptions): RovoChatPromptKey[] => {
	const defaultPrompts = [RovoChatPromptKey.KEY_HIGHLIGHTS];

	if (extensionKey === 'github-object-provider' || extensionKey === 'gitlab-object-provider') {
		return [RovoChatPromptKey.EXPLAIN_CODE, ...defaultPrompts];
	}
	return [RovoChatPromptKey.SUMMARIZE_DOCUMENT, ...defaultPrompts];
};
