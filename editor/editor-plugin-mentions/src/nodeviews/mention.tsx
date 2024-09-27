import React from 'react';

import type { ProviderFactory, Providers } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { MentionProvider } from '@atlaskit/mention';

import type { MentionPluginOptions } from '../types';
import { Mention } from '../ui/Mention';

export type Props = InlineNodeViewComponentProps & {
	options: MentionPluginOptions | undefined;
	providerFactory: ProviderFactory;
};

export const MentionNodeView = (props: Props) => {
	const { providerFactory } = props;
	const { id, text, accessLevel, localId } = props.node.attrs;

	const renderAssistiveTextWithProviders = (providers: Providers) => {
		const { mentionProvider } = providers as {
			mentionProvider?: Promise<MentionProvider>;
		};
		const profilecardProvider = props.options?.profilecardProvider;

		return (
			<Mention
				id={id}
				text={text}
				accessLevel={accessLevel}
				mentionProvider={mentionProvider}
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
