import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createEditorProviders } from './createEditorProviders';
import mockEmojiProvider from './mockEmojiProvider';
import { type FetchProxy } from '../utils/fetch-proxy';

export function createDefaultProviderFactory(fetchProxy: FetchProxy) {
	const { mediaProvider, mentionProvider, cardProvider, taskDecisionProvider } =
		createEditorProviders(fetchProxy);

	return ProviderFactory.create({
		mediaProvider,
		mentionProvider,
		cardProvider,
		emojiProvider: Promise.resolve(mockEmojiProvider),
		taskDecisionProvider,
	});
}
