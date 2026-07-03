/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { messages } from '@atlaskit/editor-common/emoji';
import { fg } from '@atlaskit/platform-feature-flags';
import type { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { PureComponent, memo } from 'react';
import type { FC, NamedExoticComponent } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { EmojiId } from '@atlaskit/emoji/types';
import { useInlineAnnotationProps } from '../../ui/annotations/element/useInlineAnnotationProps';
import type { MarkDataAttributes } from '../../ui/annotations/element/useInlineAnnotationProps';
import type { EmojiAttributes } from '@atlaskit/adf-schema';

/**
 * Check if the supplied fallback text is a single standard Unicode emoji.
 *
 * Mirrors `isSingleEmoji` from `@atlaskit/editor-plugin-emoji` so the renderer
 * can apply the same custom-emoji fallback heuristic without depending on a
 * plugin package.
 */

function isSingleEmoji(fallbackText: string): boolean {
	const emojiRegex =
		// Ignored via go/ees019
		// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
		// eslint-disable-next-line e18e/prefer-static-regex
		/^(\p{Emoji_Presentation}(?:[\u{1F3FB}-\u{1F3FF}])?|\p{Extended_Pictographic}\u{FE0F}(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}\p{Extended_Pictographic}\u{FE0F}?(?:[\u{1F3FB}-\u{1F3FF}])?)*|\p{Extended_Pictographic}\u{FE0F}?(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}\p{Extended_Pictographic}\u{FE0F}?(?:[\u{1F3FB}-\u{1F3FF}])?)+|\p{Regional_Indicator}\p{Regional_Indicator})$/u;
	return emojiRegex.test(fallbackText);
}

export interface EmojiProps extends EmojiId, EmojiAttributes, MarkDataAttributes {
	allowTextFallback?: boolean;
	fitToHeight?: number;
	providers?: ProviderFactory;
	resourceConfig?: EmojiResourceConfig;
	showTooltip?: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
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
		const { allowTextFallback, shortName, id, fallback, fitToHeight, showTooltip, resourceConfig } =
			this.props;

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

		return (
			<ResourcedEmoji
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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

const _default_1: NamedExoticComponent<EmojiProps> = memo(EmojiItemComponent);
export default _default_1;
