import React, { useMemo } from 'react';

import { ResourcedEmoji } from '@atlaskit/emoji/element';
import type { EmojiProvider, EmojiResourceConfig } from '@atlaskit/emoji/resource';
import type { EmojiId } from '@atlaskit/emoji/types';

import { type ProviderFactory } from '../../provider-factory';

export interface EmojiProps extends EmojiId {
	allowTextFallback?: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	// @deprecated - remains for compatability with legacy emoji props
	providers?: ProviderFactory;
	fitToHeight?: number;
	showTooltip?: boolean;
	resourceConfig?: EmojiResourceConfig;
	emojiProvider?: EmojiProvider;
}

const EmojiNodeFunctional = (props: EmojiProps) => {
	const {
		allowTextFallback,
		shortName,
		id,
		fallback,
		fitToHeight,
		showTooltip,
		resourceConfig,
		emojiProvider,
	} = props;

	const emojiId = useMemo(() => ({ shortName, id, fallback }), [shortName, id, fallback]);
	const emojiProviderResolver = useMemo(() => Promise.resolve(emojiProvider), [emojiProvider]);

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
			emojiId={emojiId}
			emojiProvider={emojiProviderResolver as Promise<EmojiProvider>}
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

const EmojiNode = (props: EmojiProps) => {
	return <EmojiNodeFunctional {...props} />;
};

export default React.memo(EmojiNode);
