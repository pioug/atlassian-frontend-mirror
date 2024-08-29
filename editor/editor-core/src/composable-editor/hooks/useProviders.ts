import { useEffect } from 'react';

import type {
	CardProvider,
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { CardPlugin } from '@atlaskit/editor-plugins/card';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';

import { usePresetContext } from '../../presets/context';

interface UseProvidersProps {
	contextIdentifierProvider: Promise<ContextIdentifierProvider> | undefined;
	mediaProvider: Promise<MediaProvider> | undefined;
	cardProvider: Promise<CardProvider> | undefined;
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
}: UseProvidersProps) => {
	const editorApi =
		usePresetContext<
			[
				OptionalPlugin<ContextIdentifierPlugin>,
				OptionalPlugin<MediaPlugin>,
				OptionalPlugin<CardPlugin>,
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
};
