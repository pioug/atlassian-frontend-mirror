import React, { PureComponent } from 'react';

import { ResourcedEmoji } from '@atlaskit/emoji/element';
import type { EmojiProvider, EmojiResourceConfig } from '@atlaskit/emoji/resource';
import type { EmojiId } from '@atlaskit/emoji/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { Providers } from '../../provider-factory';
import { ProviderFactory, WithProviders } from '../../provider-factory';

export interface EmojiProps extends EmojiId {
	allowTextFallback?: boolean;
	// @deprecated - remains for compatability with legacy emoji props
	providers?: ProviderFactory;
	fitToHeight?: number;
	showTooltip?: boolean;
	resourceConfig?: EmojiResourceConfig;
	emojiProvider?: EmojiProvider;
}

class EmojiNodeClass extends PureComponent<EmojiProps, {}> {
	static displayName = 'EmojiNode';
	static defaultProps = {
		showTooltip: true,
	};

	private providerFactory: ProviderFactory;

	constructor(props: EmojiProps) {
		super(props);
		this.providerFactory = props.providers || new ProviderFactory();
	}

	componentWillUnmount() {
		if (!this.props.providers) {
			// new ProviderFactory is created if no `providers` has been set
			// in this case when component is unmounted it's safe to destroy this providerFactory
			this.providerFactory.destroy();
		}
	}

	private renderWithProvider = (providers: Providers) => {
		const { allowTextFallback, shortName, id, fallback, fitToHeight, showTooltip, resourceConfig } =
			this.props;

		if (allowTextFallback && !providers.emojiProvider) {
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

		if (!providers.emojiProvider) {
			return null;
		}

		return (
			<ResourcedEmoji
				emojiId={{ id, fallback, shortName }}
				emojiProvider={providers.emojiProvider}
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

	render() {
		return (
			<WithProviders
				providers={['emojiProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
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

const EmojiNode = (props: EmojiProps) => {
	if (fg('platform_editor_get_emoji_provider_from_config')) {
		if (props.emojiProvider) {
			return <EmojiNodeFunctional {...props} />;
		}
	}

	return <EmojiNodeClass {...props} />;
};

export default EmojiNode;
