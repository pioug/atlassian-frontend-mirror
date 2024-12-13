import React from 'react';

import { useIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/emoji';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { type EmojiPlugin, type EmojiPluginOptions } from '../emojiPluginType';
import Emoji from '../ui/Emoji';
import { NdpEmoji } from '../ui/NdpEmoji';

const EmojiAssistiveTextComponent = React.memo(({ emojiShortName }: { emojiShortName: string }) => {
	const intl = useIntl();
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<span style={{ fontSize: 0 }}>
			{`${intl.formatMessage(messages.emojiNodeLabel)} ${emojiShortName}`}
		</span>
	);
});

export type Props = InlineNodeViewComponentProps & {
	providerFactory: ProviderFactory;
	options?: EmojiPluginOptions;
	api?: ExtractInjectionAPI<EmojiPlugin>;
};

const useEmojiProvider = (pluginInjectionApi: ExtractInjectionAPI<EmojiPlugin> | undefined) => {
	const { emojiState } = useSharedPluginState(pluginInjectionApi, ['emoji']);
	return emojiState?.emojiProvider;
};

export function EmojiNodeView(props: Props) {
	const { shortName, id, text } = props.node.attrs;

	const emojiProvider = useEmojiProvider(props.api);

	if (props.options?.emojiNodeDataProvider) {
		return (
			<NdpEmoji node={props.node} emojiNodeDataProvider={props.options.emojiNodeDataProvider} />
		);
	}

	return (
		<>
			<EmojiAssistiveTextComponent emojiShortName={shortName}></EmojiAssistiveTextComponent>
			<span>
				<Emoji
					emojiProvider={emojiProvider}
					providers={props.providerFactory}
					id={id}
					shortName={shortName}
					fallback={text}
				/>
			</span>
		</>
	);
}
