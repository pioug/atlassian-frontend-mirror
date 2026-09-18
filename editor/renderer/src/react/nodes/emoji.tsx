/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { PureComponent, memo } from 'react';
import type { FC, NamedExoticComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { EmojiAttributes } from '@atlaskit/adf-schema/emoji';
import { messages } from '@atlaskit/editor-common/emoji';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { isSingleEmoji } from '@atlaskit/editor-common/utils/isSingleEmoji';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import type { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import type { EmojiId, EmojiProviderLookupOrder } from '@atlaskit/emoji/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useInlineAnnotationProps } from '../../ui/annotations/element/useInlineAnnotationProps';
import type { MarkDataAttributes } from '../../ui/annotations/element/useInlineAnnotationProps';
export interface EmojiProps extends EmojiId, EmojiAttributes, MarkDataAttributes {
	allowTextFallback?: boolean;
	emojiProviderLookupOrder?: EmojiProviderLookupOrder;
	fitToHeight?: number;
	providers?: ProviderFactory;
	resourceConfig?: EmojiResourceConfig;
	showTooltip?: boolean;
}
// eslint-disable-next-line @repo/internal/react/no-class-components -- class kept for WithProviders compatibility
class EmojiNode extends PureComponent<EmojiProps, object> {
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
		const {
			allowTextFallback,
			shortName,
			id,
			fallback,
			fitToHeight,
			showTooltip,
			emojiProviderLookupOrder,
			resourceConfig,
		} = this.props;

		if (allowTextFallback && !providers.emojiProvider) {
			// When the gate is enabled and the fallback text is not a single
			// standard Unicode emoji (i.e. this is a custom emoji whose fallback
			// is a `:shortname:`-style string), render the Unicode Replacement
			// Character (U+FFFD) instead of the shortName text. Standard emojis
			// continue to fall back to their Unicode text representation.
			const fallbackText = fallback || shortName;
			const useReplacementChar =
				fg('platform_editor_custom_emoji_unicode_fallback') && !isSingleEmoji(fallbackText);
			const renderedFallbackText = useReplacementChar ? '\uFFFD' : fallbackText;
			const accessibleLabel = `${messages.emojiNodeLabel.defaultMessage} ${shortName}`;

			return (
				<span
					aria-label={useReplacementChar ? accessibleLabel : undefined}
					data-emoji-id={id}
					data-emoji-short-name={shortName}
					data-emoji-text={renderedFallbackText}
					role={useReplacementChar ? 'img' : undefined}
					title={useReplacementChar ? shortName : undefined}
				>
					{renderedFallbackText}
				</span>
			);
		}

		if (!providers.emojiProvider) {
			return null;
		}

		const customFallback =
			fg('platform_editor_custom_emoji_unicode_fallback') && !isSingleEmoji(fallback || shortName)
				? '\uFFFD'
				: undefined;

		return (
			<ResourcedEmoji
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				emojiId={{ id, fallback, shortName }}
				emojiProviderLookupOrder={emojiProviderLookupOrder}
				emojiProvider={providers.emojiProvider}
				showTooltip={showTooltip}
				fitToHeight={fitToHeight}
				optimistic
				customFallback={customFallback}
				optimisticImageURL={resourceConfig?.optimisticImageApi?.getUrl({
					id,
					fallback,
					shortName,
				})}
				editorEmoji={true}
				renderUnicodeEmojiAsImage={false}
				onEmojiLoadSuccess={resourceConfig?.onEmojiLoadSuccess}
				onEmojiLoadFail={resourceConfig?.onEmojiLoadFail}
			/>
		);
	};

	render() {
		return (
			<WithProviders
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				providers={['emojiProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}

export const EmojiItemComponent: FC<EmojiProps> = (props) => {
	const { id, providers, shortName, text, fitToHeight, emojiProviderLookupOrder, resourceConfig } =
		props;

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
					emojiProviderLookupOrder={emojiProviderLookupOrder}
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
			emojiProviderLookupOrder={emojiProviderLookupOrder}
			resourceConfig={resourceConfig}
		/>
	);
};

const _default_1: NamedExoticComponent<EmojiProps> = memo(EmojiItemComponent);
export default _default_1;
