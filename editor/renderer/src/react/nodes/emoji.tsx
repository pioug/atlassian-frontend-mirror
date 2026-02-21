/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { type EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { PureComponent, memo, type FC } from 'react';
import {
	ProviderFactory,
	WithProviders,
	type Providers,
} from '@atlaskit/editor-common/provider-factory';
import type { EmojiId } from '@atlaskit/emoji/types';
import {
	useInlineAnnotationProps,
	type MarkDataAttributes,
} from '../../ui/annotations/element/useInlineAnnotationProps';
import { type EmojiAttributes } from '@atlaskit/adf-schema';

export interface EmojiProps extends EmojiId, EmojiAttributes, MarkDataAttributes {
	allowTextFallback?: boolean;
	fitToHeight?: number;
	providers?: ProviderFactory;
	resourceConfig?: EmojiResourceConfig;
	showTooltip?: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class EmojiNode extends PureComponent<EmojiProps, Object> {
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
				onEmojiLoadSuccess={resourceConfig?.onEmojiLoadSuccess}
				onEmojiLoadFail={resourceConfig?.onEmojiLoadFail}
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

export const EmojiItemComponent: FC<EmojiProps> = (props) => {
	const { id, providers, shortName, text, fitToHeight, resourceConfig } = props;

	const inlineAnnotationProps = useInlineAnnotationProps(props);

	if (fg('editor_inline_comments_on_inline_nodes')) {
		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			<span {...inlineAnnotationProps}>
				<EmojiNode
					allowTextFallback={true}
					id={id}
					shortName={shortName}
					fallback={text}
					providers={providers}
					fitToHeight={fitToHeight}
					resourceConfig={resourceConfig}
				/>
			</span>
		);
	}

	return (
		<EmojiNode
			allowTextFallback={true}
			id={id}
			shortName={shortName}
			fallback={text}
			providers={providers}
			fitToHeight={fitToHeight}
			resourceConfig={resourceConfig}
		/>
	);
};

export default memo(EmojiItemComponent);
