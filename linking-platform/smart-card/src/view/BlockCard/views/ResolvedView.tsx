/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { browser } from '@atlaskit/linking-common/user-agent';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { ActionName, CardDisplay, ElementName, SmartLinkPosition } from '../../../constants';
import extractRovoChatAction from '../../../extractors/flexible/actions/extract-rovo-chat-action';
import { getExtensionKey } from '../../../state/helpers';
import useRovoConfig from '../../../state/hooks/use-rovo-config';
import FlexibleCard from '../../FlexibleCard';
import { RovoChatPromptKey } from '../../FlexibleCard/components/actions/rovo-chat-action';
import {
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
} from '../../FlexibleCard/components/blocks';
import type { ActionItem } from '../../FlexibleCard/components/blocks/types';

import { type FlexibleBlockCardProps } from './types';
import {
	FlexibleCardUiOptions,
	getSimulatedBetterMetadata,
	PreviewBlockOptions,
	titleBlockOptions,
} from './utils';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

const titleBlockCss = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
		color: token('color.link'),
	},
});

const footerBlockCss = css({
	height: '1.5rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	alignSelf: 'stretch',
});

const footerBlockSafariStyles = css({
	height: '100%',
});

/**
 * This view represents a Block card that has an 'Resolved' status.
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const ResolvedView = ({
	cardState,
	onClick,
	onError,
	onResolve,
	actionOptions,
	testId = 'smart-block-resolved-view',
	url,
	CompetitorPrompt,
	hideIconLoadingSkeleton,
}: FlexibleBlockCardProps) => {
	const [isPreviewBlockErrored, setIsPreviewBlockErrored] = useState<boolean>(false);
	const extensionKey = getExtensionKey(cardState.details);
	const rovoConfig = fg('platform_sl_3p_auth_rovo_block_card_kill_switch')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useRovoConfig()
		: undefined;

	const showRovoResolvedView = fg('platform_sl_3p_auth_rovo_block_card_kill_switch')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useMemo(
				() =>
					cardState?.status === 'resolved' &&
					cardState.details &&
					extractRovoChatAction({
						response: cardState.details,
						rovoConfig,
						actionOptions: actionOptions,
					}) !== undefined,
				[actionOptions, cardState?.details, cardState?.status, rovoConfig],
			)
		: undefined;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { safari = false } = useMemo(() => browser(), []);

	useEffect(() => {
		setIsPreviewBlockErrored(false);
	}, [url, cardState]);

	const { titleMetadata, topMetadata, bottomMetadata } = getSimulatedBetterMetadata(
		cardState.details,
	);

	const prompts = useMemo(() => {
		if (fg('platform_sl_3p_auth_rovo_block_card_kill_switch')) {
			const defaultPrompts = [
				RovoChatPromptKey.KEY_HIGHLIGHTS
			];

			const linkType = cardState.details?.data?.['@type'];

			if (extensionKey === 'slack-object-provider') {
				return [RovoChatPromptKey.FIND_OPEN_QUESTIONS, ...defaultPrompts];
			}
			if (
				extensionKey === 'google-object-provider' &&
				linkType?.includes('schema:PresentationDigitalDocument')
			) {
				return [RovoChatPromptKey.IDENTIFY_KEY_POINTS, ...defaultPrompts];
			}
			if (
				extensionKey === 'google-object-provider' &&
				linkType?.includes('schema:SpreadsheetDigitalDocument')
			) {
				return [RovoChatPromptKey.IDENTIFY_KEY_TRENDS, ...defaultPrompts];
			}

			return [RovoChatPromptKey.SUMMARIZE_LINK, ...defaultPrompts];
		}
		return [];
	}, [cardState?.details?.data, extensionKey]);

	const footerActions: ActionItem[] = useMemo(() => {
		if (showRovoResolvedView && fg('platform_sl_3p_auth_rovo_block_card_kill_switch')) {
			return [
				{
					name: ActionName.RovoChatAction,
					prompts: prompts,
					iconSize: 'small',
					cardAppearance: CardDisplay.Block,
				},
				{ name: ActionName.FollowAction, iconSize: 'small' },
				{ name: ActionName.DownloadAction, iconSize: 'small' },
			];
		}

		return [
			{ name: ActionName.FollowAction, hideIcon: true },
			{ name: ActionName.PreviewAction, hideIcon: true },
			{ name: ActionName.DownloadAction, hideIcon: true },
		];
	}, [showRovoResolvedView, prompts]);

	const uiOptions = FlexibleCardUiOptions;
	uiOptions.enableSnippetRenderer = true;
	uiOptions.hideLoadingSkeleton = hideIconLoadingSkeleton;

	return (
		<FlexibleCard
			appearance="block"
			cardState={cardState}
			onClick={onClick}
			onError={onError}
			onResolve={onResolve}
			origin="smartLinkCard"
			actionOptions={actionOptions}
			testId={testId}
			ui={uiOptions}
			url={url}
		>
			<TitleBlock
				{...titleBlockOptions}
				metadata={titleMetadata}
				subtitle={[{ name: ElementName.Location }]}
				metadataPosition={SmartLinkPosition.Top}
				css={[titleBlockCss]}
				CompetitorPrompt={CompetitorPrompt}
				url={url}
				hideIconLoadingSkeleton={hideIconLoadingSkeleton}
			/>
			<MetadataBlock primary={topMetadata} maxLines={1} />
			<SnippetBlock />
			<MetadataBlock primary={bottomMetadata} maxLines={1} />
			{!isPreviewBlockErrored ? (
				<PreviewBlock
					{...PreviewBlockOptions}
					onError={() => {
						setIsPreviewBlockErrored(true);
					}}
				/>
			) : null}
			<FooterBlock
				css={[footerBlockCss, safari && footerBlockSafariStyles]}
				actions={footerActions}
				isPreviewBlockErrored={isPreviewBlockErrored}
			/>
		</FlexibleCard>
	);
};

const _default_1: (props: FlexibleBlockCardProps) => JSX.Element =
	withFlexibleUIBlockCardStyle(ResolvedView);
export default _default_1;
