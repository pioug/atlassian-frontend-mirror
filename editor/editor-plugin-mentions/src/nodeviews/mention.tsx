import React from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import type { ProviderFactory, Providers } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { MentionProvider } from '@atlaskit/mention';

import { mentionsPlugin } from '../mentionsPlugin';
import type { MentionsPlugin } from '../mentionsPluginType';
import type { MentionPluginOptions } from '../types';
import { Mention } from '../ui/Mention';

export type Props = InlineNodeViewComponentProps & {
	options: MentionPluginOptions | undefined;
	providerFactory: ProviderFactory;
	pluginInjectionApi?: ExtractInjectionAPI<MentionsPlugin>;
};

const useSharedMentionState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<typeof mentionsPlugin> | undefined) => {
		const mentionProvider = useSharedPluginStateSelector(api, 'mention.mentionProvider');
		return { mentionProvider };
	},
	(api: ExtractInjectionAPI<typeof mentionsPlugin> | undefined) => {
		const { mentionState } = useSharedPluginState(api, ['mention']);
		return { mentionProvider: mentionState?.mentionProvider };
	},
);

export const MentionNodeView = (props: Props) => {
	const { providerFactory, pluginInjectionApi } = props;
	const { id, text, accessLevel, localId } = props.node.attrs;

	const { mentionProvider } = useSharedMentionState(pluginInjectionApi);

	const renderAssistiveTextWithProviders = (providers: Providers) => {
		const mentionProviderPromise = mentionProvider
			? Promise.resolve(mentionProvider)
			: (
					providers as {
						mentionProvider?: Promise<MentionProvider>;
					}
				).mentionProvider;
		const profilecardProvider = props.options?.profilecardProvider;

		return (
			<Mention
				id={id}
				text={text}
				accessLevel={accessLevel}
				mentionProvider={mentionProviderPromise}
				profilecardProvider={profilecardProvider}
				localId={localId}
			/>
		);
	};

	return (
		<WithProviders
			providers={['mentionProvider', 'profilecardProvider']}
			providerFactory={providerFactory}
			renderNode={renderAssistiveTextWithProviders}
		/>
	);
};
