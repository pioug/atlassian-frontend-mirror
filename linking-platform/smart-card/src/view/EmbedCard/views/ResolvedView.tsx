/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';
import Loadable from 'react-loadable';

import LinkGlyph from '@atlaskit/icon/core/link';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { token } from '@atlaskit/tokens';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';

import { CardDisplay } from '../../../constants';
import extractRovoChatAction from '../../../extractors/flexible/actions/extract-rovo-chat-action';
import { getExtensionKey } from '../../../state/helpers';
import useEmbedRovoActionsFooterExperiment from '../../../state/hooks/use-embed-rovo-actions-footer-experiment';
import useRovoConfig from '../../../state/hooks/use-rovo-config';
import { getPreviewUrlWithTheme, isProfileType } from '../../../utils';
import type { InternalCardActionOptions as CardActionOptions } from '../../Card/types';
import { getRovoPostAuthPromptKeys } from '../../common/rovo-post-auth-prompts';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { Frame } from '../components/Frame';
import { ImageIcon } from '../components/ImageIcon';
import { type ContextViewModel, type FrameStyle } from '../types';
import { useEmbedResolvePostMessageListener } from '../useEmbedResolvePostMessageListener';

const EmbedRovoActionsFooter = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "smart-card-embed-rovo-actions-footer" */ '../components/rovo-actions-footer'
		).then((module) => module.default),
	loading: () => null,
});
EmbedRovoActionsFooter.displayName = 'lazy(EmbedRovoActionsFooter)';

const styles = cssMap({
	contentWithFooter: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: 0,
	},
	frameWithFooter: {
		flexGrow: 1,
		minHeight: 0,
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-start',
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

type EmbedFrameWithRovoFooterProps = {
	actionOptions?: CardActionOptions;
	details?: JsonLd.Response;
	frame: React.ReactNode;
	link: string;
	testId: string;
};

const EmbedFrameWithRovoFooter = ({
	actionOptions,
	details,
	frame,
	link,
	testId,
}: EmbedFrameWithRovoFooterProps) => {
	const { rovoOptions, product } = useRovoConfig();
	const { isEnabled: isEmbedRovoActionsFooterEnabled } = useEmbedRovoActionsFooterExperiment(
		link,
		actionOptions,
		rovoOptions,
		product,
	);
	const rovoActionData = React.useMemo(
		() =>
			isEmbedRovoActionsFooterEnabled && details
				? extractRovoChatAction({
						response: details,
						rovoConfig: { rovoOptions, product },
						product,
						actionOptions,
						appearance: CardDisplay.Embed,
						isEmbedRovoActionsFooterExperimentEnabled: isEmbedRovoActionsFooterEnabled,
					})
				: undefined,
		[actionOptions, details, isEmbedRovoActionsFooterEnabled, product, rovoOptions],
	);
	const prompts = React.useMemo(() => {
		if (!isEmbedRovoActionsFooterEnabled) {
			return [];
		}

		return getRovoPostAuthPromptKeys({
			extensionKey: getExtensionKey(details),
		});
	}, [details, isEmbedRovoActionsFooterEnabled]);
	const footer = React.useMemo(
		() =>
			rovoActionData && prompts.length > 0 ? (
				<EmbedRovoActionsFooter
					actionData={rovoActionData}
					prompts={prompts}
					testId={`${testId}-rovo-actions-footer`}
				/>
			) : undefined,
		[prompts, rovoActionData, testId],
	);

	return footer ? (
		<div css={styles.contentWithFooter}>
			<div css={styles.frameWithFooter}>{frame}</div>
			<div css={styles.footer}>{footer}</div>
		</div>
	) : (
		frame
	);
};

const EmbedFrameWithoutRovoFooter = ({ frame }: EmbedFrameWithRovoFooterProps) => frame;

const EmbedFrameWithOptionalRovoFooter = componentWithFG(
	'platform_sl_3p_auth_rovo_embed_footer_kill_switch',
	EmbedFrameWithRovoFooter,
	EmbedFrameWithoutRovoFooter,
);

export interface EmbedCardResolvedViewProps {
	actionOptions?: CardActionOptions;
	/** Component to prompt for competitor link */
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	/** The context view model */
	context?: ContextViewModel;
	details?: JsonLd.Response;
	/** The extension key */
	extensionKey?: string;
	/** A prop that determines the style of a frame: whether to show it, hide it or only show it when a user hovers over embed */
	frameStyle?: FrameStyle;
	/** For image icons in the title, whether to hide the loading skeleton while the image is loading. */
	hideIconLoadingSkeleton?: boolean;
	inheritDimensions?: boolean;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/* It determines whether a link source supports different design theme modes */
	isSupportTheming?: boolean;
	/** A flag that determines whether link source can be trusted in iframe **/
	isTrusted?: boolean;
	/** The link to display */
	link: string;
	/** Optional middle-click handler. */
	onAuxClick?: React.EventHandler<React.MouseEvent>;
	/** The optional click handler */
	onClick?: (evt: React.MouseEvent) => void;
	/** Optional right-click handler. */
	onContextMenu?: React.EventHandler<React.MouseEvent>;
	/** Optional callback for when user dwells cursor over iframe - for analytics **/
	onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
	/** Optional callback for when user navigates into an iframe - for analytics **/
	onIframeFocus?: () => void;
	/** Optional callback for when user hovers over an iframe - for analytics **/
	onIframeMouseEnter?: () => void;
	/** Optional callback for when user stops hovering over an iframe - for analytics **/
	onIframeMouseLeave?: () => void;
	/** The src to be used for the `iframe` */
	preview?: { aspectRatio?: number; src?: string };
	/** For testing purposes only. */
	testId?: string;
	/** The title of the link */
	title?: string;
	/** Type of the object */
	type?: string[];
}

export const EmbedCardResolvedView: React.ForwardRefExoticComponent<
	EmbedCardResolvedViewProps & React.RefAttributes<HTMLIFrameElement>
> = React.forwardRef<HTMLIFrameElement, EmbedCardResolvedViewProps>(
	(
		{
			actionOptions,
			link,
			context,
			details,
			onClick,
			onAuxClick,
			onContextMenu,
			isSelected,
			frameStyle,
			preview,
			title,
			isTrusted,
			testId = 'embed-card-resolved-view',
			inheritDimensions,
			onIframeDwell,
			onIframeFocus,
			onIframeMouseEnter,
			onIframeMouseLeave,
			isSupportTheming,
			type,
			CompetitorPrompt,
			hideIconLoadingSkeleton,
			extensionKey,
		},
		embedIframeRef,
	) => {
		const iconFromContext = context?.icon;
		const iconLabel = context?.iconLabel;
		const src = typeof iconFromContext === 'string' ? iconFromContext : undefined;
		const text = title || context?.text;
		const linkGlyph = React.useMemo(
			() => <LinkGlyph label="icon" testId="embed-card-fallback-icon" color="currentColor" />,
			[],
		);

		const icon = React.useMemo(() => {
			if (React.isValidElement(iconFromContext)) {
				return iconFromContext;
			}

			return (
				<ImageIcon
					src={src}
					{...(fg('platform_lp_use_entity_icon_url_for_icon') ? { alt: iconLabel } : undefined)}
					default={linkGlyph}
					appearance={isProfileType(type) ? 'round' : 'square'}
					hideLoadingSkeleton={hideIconLoadingSkeleton}
				/>
			);
		}, [iconFromContext, src, linkGlyph, type, hideIconLoadingSkeleton, iconLabel]);

		useEmbedResolvePostMessageListener({
			url: link,
			embedIframeRef,
		});

		const themeState = useThemeObserver();
		let previewUrl = preview?.src;

		if (previewUrl && isSupportTheming) {
			previewUrl = getPreviewUrlWithTheme(previewUrl, themeState);
		}

		const [isMouseOver, setMouseOver] = React.useState(false);
		const frame = (
			<Frame
				url={previewUrl}
				isTrusted={isTrusted}
				testId={testId}
				ref={embedIframeRef}
				onIframeDwell={onIframeDwell}
				onIframeFocus={onIframeFocus}
				onIframeMouseEnter={onIframeMouseEnter}
				onIframeMouseLeave={onIframeMouseLeave}
				isMouseOver={isMouseOver}
				title={text}
				extensionKey={extensionKey}
			/>
		);
		const frameWithFooter = (
			<EmbedFrameWithOptionalRovoFooter
				actionOptions={actionOptions}
				details={details}
				frame={frame}
				link={link}
				testId={testId}
			/>
		);

		return (
			<ExpandedFrame
				isSelected={isSelected}
				frameStyle={frameStyle}
				href={link}
				testId={testId}
				icon={icon}
				text={text}
				onClick={onClick}
				onAuxClick={onAuxClick}
				onContextMenu={onContextMenu}
				inheritDimensions={inheritDimensions}
				setOverflow={false}
				CompetitorPrompt={CompetitorPrompt}
				onContentMouseEnter={() => {
					setMouseOver(true);
					onIframeMouseEnter?.();
				}}
				onContentMouseLeave={() => {
					setMouseOver(false);
					onIframeMouseLeave?.();
				}}
			>
				{frameWithFooter}
			</ExpandedFrame>
		);
	},
);
