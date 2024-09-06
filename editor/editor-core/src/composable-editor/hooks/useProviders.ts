import { useEffect } from 'react';

import type {
	CardProvider,
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { CardPlugin } from '@atlaskit/editor-plugins/card';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import { type EmojiPlugin } from '@atlaskit/editor-plugins/emoji';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';
import { type EmojiProvider } from '@atlaskit/emoji';
import { fg } from '@atlaskit/platform-feature-flags';

import { usePresetContext } from '../../presets/context';

interface UseProvidersProps {
	contextIdentifierProvider: Promise<ContextIdentifierProvider> | undefined;
	mediaProvider: Promise<MediaProvider> | undefined;
	cardProvider: Promise<CardProvider> | undefined;
	emojiProvider: Promise<EmojiProvider> | undefined;
}

/**
 * This hook is used to replace the old approach of using the `providerFactory`.
 *
 * Because plugins can't update their initial configuration, this hook listens to changes
 * and calls a command to push the update to the plugins shared state.
 *
 * In the future ideally consumers implement this behaviour themselves.
 */
export const useProviders = ({
	contextIdentifierProvider,
	mediaProvider,
	cardProvider,
	emojiProvider,
}: UseProvidersProps) => {
	const editorApi =
		usePresetContext<
			[
				OptionalPlugin<ContextIdentifierPlugin>,
				OptionalPlugin<MediaPlugin>,
				OptionalPlugin<CardPlugin>,
				OptionalPlugin<EmojiPlugin>,
			]
		>();

	useEffect(() => {
		async function setProvider() {
			if (!contextIdentifierProvider) {
				return;
			}
			const provider = await contextIdentifierProvider;
			editorApi?.core?.actions.execute(
				editorApi?.contextIdentifier?.commands.setProvider({
					contextIdentifierProvider: provider,
				}),
			);
		}
		setProvider();
	}, [contextIdentifierProvider, editorApi]);

	useEffect(() => {
		if (mediaProvider) {
			editorApi?.media?.actions.setProvider(mediaProvider);
		}
	}, [mediaProvider, editorApi]);

	useEffect(() => {
		if (cardProvider) {
			editorApi?.card?.actions.setProvider(cardProvider);
		}
	}, [cardProvider, editorApi]);

	useEffect(() => {
		if (fg('platform_editor_get_emoji_provider_from_config')) {
			if (emojiProvider) {
				editorApi?.emoji?.actions.setProvider(emojiProvider);
			}
		}
	}, [emojiProvider, editorApi]);
};
