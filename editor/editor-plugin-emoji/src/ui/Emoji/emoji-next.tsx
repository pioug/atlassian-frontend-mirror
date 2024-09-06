import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import type { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import type { EmojiId } from '@atlaskit/emoji/types';

import { type EmojiPlugin } from '../../types';

const useEmojiProvider = (pluginInjectionApi: ExtractInjectionAPI<EmojiPlugin> | undefined) => {
	const { emojiState } = useSharedPluginState(pluginInjectionApi, ['emoji']);
	return emojiState?.emojiProvider;
};

export interface EmojiProps extends EmojiId {
	allowTextFallback?: boolean;
	// @deprecated - remains for compatability with legacy emoji props
	providers?: ProviderFactory;
	fitToHeight?: number;
	showTooltip?: boolean;
	resourceConfig?: EmojiResourceConfig;
	pluginInjectionApi: ExtractInjectionAPI<EmojiPlugin> | undefined;
}

const EmojiNode = (props: EmojiProps) => {
	const {
		allowTextFallback,
		shortName,
		id,
		fallback,
		fitToHeight,
		showTooltip,
		resourceConfig,
		pluginInjectionApi,
	} = props;

	const emojiProvider = useEmojiProvider(pluginInjectionApi);

	if (allowTextFallback && !emojiProvider) {
		return (
			<span
				data-emoji-id={id}
				data-emoji-short-name={shortName}
				data-emoji-text={fallback || shortName}
			>
				{fallback || shortName}
			</span>
		);
	}

	if (!emojiProvider) {
		return null;
	}

	return (
		<ResourcedEmoji
			emojiId={{ id, fallback, shortName }}
			emojiProvider={Promise.resolve(emojiProvider)}
			showTooltip={showTooltip}
			fitToHeight={fitToHeight}
			optimistic
			optimisticImageURL={resourceConfig?.optimisticImageApi?.getUrl({
				id,
				fallback,
				shortName,
			})}
			editorEmoji={true}
		/>
	);
};

export default EmojiNode;
