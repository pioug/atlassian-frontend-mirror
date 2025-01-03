import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ProviderFactory, Providers } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MentionProvider } from '@atlaskit/mention';

import type { MentionsPlugin } from '../mentionsPluginType';
import type { MentionPluginOptions } from '../types';
import { Mention } from '../ui/Mention';

export type Props = InlineNodeViewComponentProps & {
	options: MentionPluginOptions | undefined;
	providerFactory: ProviderFactory;
	pluginInjectionApi?: ExtractInjectionAPI<MentionsPlugin>;
};

export const MentionNodeView = (props: Props) => {
	const { providerFactory, pluginInjectionApi } = props;
	const { id, text, accessLevel, localId } = props.node.attrs;

	const { mentionState } = useSharedPluginState(pluginInjectionApi, ['mention']);
	const mentionProvider = mentionState?.mentionProvider;

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
