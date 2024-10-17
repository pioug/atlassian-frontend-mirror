import { useEffect } from 'react';

import type {
	AutoformattingProvider,
	CardProvider,
	ContextIdentifierProvider,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { CardPlugin } from '@atlaskit/editor-plugins/card';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import { type CustomAutoformatPlugin } from '@atlaskit/editor-plugins/custom-autoformat';
import { type EmojiPlugin } from '@atlaskit/editor-plugins/emoji';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';
import { type TasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { type EmojiProvider } from '@atlaskit/emoji';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

interface UseProvidersProps {
	editorApi:
		| PublicPluginAPI<
				[
					OptionalPlugin<ContextIdentifierPlugin>,
					OptionalPlugin<MediaPlugin>,
					OptionalPlugin<CardPlugin>,
					OptionalPlugin<EmojiPlugin>,
					OptionalPlugin<CustomAutoformatPlugin>,
					OptionalPlugin<TasksAndDecisionsPlugin>,
				]
		  >
		| undefined;
	contextIdentifierProvider: Promise<ContextIdentifierProvider> | undefined;
	mediaProvider: Promise<MediaProvider> | undefined;
	cardProvider: Promise<CardProvider> | undefined;
	emojiProvider: Promise<EmojiProvider> | undefined;
	autoformattingProvider: Promise<AutoformattingProvider> | undefined;
	taskDecisionProvider: Promise<TaskDecisionProvider> | undefined;
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
	editorApi,
	contextIdentifierProvider,
	mediaProvider,
	cardProvider,
	emojiProvider,
	autoformattingProvider,
	taskDecisionProvider,
}: UseProvidersProps) => {
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
		if (emojiProvider) {
			editorApi?.emoji?.actions.setProvider(emojiProvider);
		}
	}, [emojiProvider, editorApi]);

	useEffect(() => {
		if (autoformattingProvider) {
			editorApi?.customAutoformat?.actions.setProvider(autoformattingProvider);
		}
	}, [autoformattingProvider, editorApi]);

	useEffect(() => {
		if (taskDecisionProvider) {
			editorApi?.taskDecision?.actions.setProvider(taskDecisionProvider);
		}
	}, [taskDecisionProvider, editorApi]);
};
