/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';
import { di } from 'react-magnetic-di';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import { ElementName, SmartLinkDirection, SmartLinkSize, SmartLinkWidth } from '../../../constants';
import { messages } from '../../../messages';
import { useFlexibleCardContext } from '../../../state/flexible-ui-context';
import { hasAuthScopeOverrides } from '../../../state/helpers';
import useSocialProofExperiment from '../../../state/hooks/use-social-proof-experiment';
import UnauthorisedViewContent from '../../common/UnauthorisedViewContent';
import FlexibleCard from '../../FlexibleCard';
import ActionGroup from '../../FlexibleCard/components/blocks/action-group';
import Block from '../../FlexibleCard/components/blocks/block';
import ElementGroup from '../../FlexibleCard/components/blocks/element-group';
import { type ActionItem } from '../../FlexibleCard/components/blocks/types';
import { renderElementItems } from '../../FlexibleCard/components/blocks/utils';
import { LinkIcon, Title } from '../../FlexibleCard/components/elements';
import { AuthorizeAction } from '../actions/AuthorizeAction';

import unauthIllustrationGeneral from './assets/general@2x.png';
import SocialProofMessage from './SocialProofMessage';
import { type FlexibleBlockCardProps } from './types';
import { type UnresolvedViewProps } from './unresolved-view/types';
import { FlexibleCardUiOptions, titleBlockOptions } from './utils';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

interface UnauthorisedViewFrameProps extends FlexibleBlockCardProps {
	content: ReactNode;
	providerName?: string;
	testId: string;
}

const contentStyles = css({
	color: token('color.text'),
	marginTop: token('space.100'),
	font: token('font.body'),
});

const contentAdditionalStyles = css({
	marginBottom: token('space.200'),
	maxWidth: '100%',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

const newTitleBlockStyles = css({
	gap: '0',
});

const intermediumGapStyles = css({
	gap: token('space.150'),
});

const titleBlockStyles = css({
	fontWeight: token('font.weight.semibold'),
	color: token('color.link'),
});

const previewBlockStyle = css({
	width: 'min(320px, 55%)',
	alignSelf: 'stretch',
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'@container my-card (max-width: 370px)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&': {
			display: 'none',
		},
	},
});

const previewBlockStyleWithOverlap = css({
	width: 'calc(min(320px, 55%) - 45px)',
});

const linkIconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'@container my-card (max-width: 150px)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&': {
			display: 'none',
		},
	},
});

const containerStyles = css({
	containerType: 'inline-size',
	containerName: 'my-card',
});

const previewBlockImageStyle = css({
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	height: '100%',
	width: 'min(320px, 55%)',
	backgroundSize: 'contain',
	backgroundPosition: 'center',
	backgroundRepeat: 'no-repeat',
});

const styles = cssMap({
	titleBoxCard: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
});

const getBetterTitle = (url: string) => {
	// List of regexps to extract human-readable titles from URLs
	// Each regex should have a capture group for the title at index 1
	const titleExtractors: RegExp[] = [
		// Dropbox: https://www.dropbox.com/scl/fi/scebraopvx4bni0sechq9/Atlas23_D1_A_0014.jpg?rlkey=... -> Atlas23_D1_A_0014.jpg
		/^https:\/\/www\.dropbox\.com\/scl\/fi\/[^\/]+\/([^\/\?]+)/,
		// Dropbox: https://www.dropbox.com/home/Teamwork%20Ecosystem?preview=xsociety00.dat -> Teamwork Ecosystem
		/^https:\/\/www\.dropbox\.com\/home\/([^\/\?]+)/,
		// Dropbox: https://www.dropbox.com/home?preview=Insomnia-All_2019-03-14.json -> Insomnia-All_2019-03-14.json
		/^https:\/\/www\.dropbox\.com\/home\?(?:.*?&)?preview=([^&#]+)/,
		// Dropbox: https://www.dropbox.com/preview/AI%20Contest -> AI Contest
		/^https:\/\/www\.dropbox\.com\/preview\/([^&?]+)/,
		// Dropbox: https://www.dropbox.com/s/votiehk00g4opif/xsociety00.dat?dl=0 -> xsociety00.dat
		/^https:\/\/www\.dropbox\.com\/(?:s|sh|sc|t)\/[^\/]+\/([^\/\?]+)/,
		// Figma: https://www.figma.com/slides/vW47To0dYPnT7jlrJdUd7h/Universal-Create-in-TwC?node-id=... -> Universal-Create-in-TwC
		// Also supports: /file/, /design/, /board/, /proto/
		/^https:\/\/(?:[\w.-]+\.)?figma\.com\/(?:design|board|file|proto|slides)\/[0-9a-zA-Z]{22,128}\/([^\/\?]+)/,
		// OneDrive: https://1drv.ms/w/s!ABC123DEF456/Project_Plan.docx?e=abcdEF -> Project_Plan.docx
		/^https:\/\/1drv\.ms\/[a-z]+\/s![^\/]+\/([^\/\?]+)/,
		// Miro: https://miro.com/app/board/uXjVOPnT123=/my-board-name/ -> my-board-name
		/^https:\/\/miro\.com\/app\/board\/[^\/]+\/([^\/\?]+)\/?/,
	];

	// Try each extractor pattern
	for (const pattern of titleExtractors) {
		const match = url.match(pattern);
		if (match) {
			const extracted = decodeURIComponent(match[1]);
			if (extracted) {
				return extracted;
			}
		}
	}

	try {
		const { pathname, search } = new URL(url);
		if (pathname.length > 1) {
			return pathname.substring(1);
		}
		if (search) {
			return search;
		}
		// Fall back to the full URL when there is no useful path/search to display,
		// so the title (and the underlying link) always has accessible text.
		return url;
	} catch {
		return url;
	}
};

const UnauthorisedBlock = ({
	actions,
	children,
	url,
	CompetitorPrompt,
	testId,
}: Pick<
	UnresolvedViewProps,
	'actions' | 'children' | 'url' | 'CompetitorPrompt' | 'testId' | 'cardState'
>) => {
	const { ui, data } = useFlexibleCardContext() ?? { ui: undefined, data: undefined };

	const hasActions = actions && actions.length > 0;
	const actionGroup = hasActions ? (
		<ActionGroup size={SmartLinkSize.Large} items={actions} />
	) : null;

	const competitorPrompt =
		CompetitorPrompt && data?.url ? (
			<CompetitorPrompt sourceUrl={data?.url} linkType={'card'} />
		) : null;

	const title = (
		<Title
			hideTooltip={false}
			maxLines={1}
			theme={ui?.theme}
			text={getBetterTitle(url)}
			css={titleBlockStyles}
		/>
	);

	const { position } = titleBlockOptions;

	let overrideUrl = data?.preview?.url ?? unauthIllustrationGeneral;

	return (
		<Block {...titleBlockOptions} testId={`${testId}-errored-view`} css={containerStyles}>
			<ElementGroup
				direction={SmartLinkDirection.Vertical}
				width={SmartLinkWidth.Flexible}
				size={SmartLinkSize.Medium}
				css={intermediumGapStyles}
			>
				<Block>
					<LinkIcon
						position={position}
						size={SmartLinkSize.Medium}
						isTiledIcon={true}
						css={linkIconStyles}
					/>

					<ElementGroup
						direction={SmartLinkDirection.Vertical}
						width={SmartLinkWidth.Flexible}
						css={newTitleBlockStyles}
						size={SmartLinkSize.Large}
					>
						{competitorPrompt ? (
							<Box xcss={styles.titleBoxCard}>
								{title}
								{competitorPrompt}
							</Box>
						) : (
							title
						)}
						<ElementGroup size={SmartLinkSize.Medium} direction={SmartLinkDirection.Horizontal}>
							{renderElementItems([{ name: ElementName.HostName }])}
						</ElementGroup>
					</ElementGroup>
				</Block>
				{children}
				{actionGroup}
			</ElementGroup>

			{hasActions ? (
				<div css={[previewBlockStyle, previewBlockStyleWithOverlap]}>
					<div css={previewBlockImageStyle} style={{ backgroundImage: `url(${overrideUrl})` }} />
				</div>
			) : null}
		</Block>
	);
};

/**
 * This view represents a Block card that has an 'Unauthorized' status .
 * It should have a "Connect" button that will allow a user to connect their account and view the block card.
 *
 * @see SmartLinkStatus
 * @see FlexibleCardProps
 */
const UnauthorisedViewFrame = ({
	content,
	providerName,
	testId,
	...props
}: UnauthorisedViewFrameProps) => {
	const { onAuthorize } = props;
	const { fireEvent } = useAnalyticsEvents();

	const handleAuthorize = useCallback(() => {
		if (onAuthorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			onAuthorize();
		}
	}, [onAuthorize, fireEvent]);

	const actions = useMemo<ActionItem[]>(
		() => (onAuthorize ? [AuthorizeAction(handleAuthorize, providerName)] : []),
		[handleAuthorize, onAuthorize, providerName],
	);

	return (
		<FlexibleCard
			appearance="block"
			onAuthorize={onAuthorize}
			origin="smartLinkCard"
			testId={testId}
			ui={FlexibleCardUiOptions}
			{...props}
		>
			<UnauthorisedBlock
				actions={actions}
				cardState={props.cardState}
				CompetitorPrompt={props.CompetitorPrompt}
				testId={testId}
				url={props.url}
			>
				<div
					css={[contentStyles, actions.length > 0 ? contentAdditionalStyles : undefined]}
					data-testid={`${testId}-content`}
				>
					{content}
				</div>
			</UnauthorisedBlock>
		</FlexibleCard>
	);
};

const UnauthorisedViewBase = ({
	testId = 'smart-block-unauthorized-view',
	...props
}: FlexibleBlockCardProps) => {
	const { cardState, onAuthorize } = props;
	const providerName = extractSmartLinkProvider(cardState.details)?.text;
	const isProductIntegrationSupported = hasAuthScopeOverrides(cardState.details);

	const content = useMemo(
		() =>
			onAuthorize ? (
				<UnauthorisedViewContent
					providerName={providerName}
					isProductIntegrationSupported={isProductIntegrationSupported}
					testId={testId}
				/>
			) : (
				<FormattedMessage
					{...messages[
						providerName
							? 'unauthorised_account_description'
							: 'unauthorised_account_description_no_provider'
					]}
					values={{ context: providerName }}
				/>
			),
		[isProductIntegrationSupported, onAuthorize, providerName, testId],
	);

	return (
		<UnauthorisedViewFrame
			{...props}
			content={content}
			providerName={providerName}
			testId={testId}
		/>
	);
};

/**
 * Experiment wrapper: fires social proof exposure and renders social proof UI when FG is on.
 * TODO: remove when social-proof-3p-unauth-block-fg is cleaned up
 */
const UnauthorisedViewWithExperiment = ({
	testId = 'smart-block-unauthorized-view',
	...props
}: FlexibleBlockCardProps): JSX.Element => {
	const extensionKey = props.cardState?.details?.meta?.key;
	di(useSocialProofExperiment);
	const providerName = extractSmartLinkProvider(props.cardState.details)?.text;
	const { connections } = useSmartLinkContext();
	const { isTreatment, tier, connectedPct } = useSocialProofExperiment(
		providerName ? extensionKey : undefined,
		connections.client.baseUrlOverride,
	);

	if (!isTreatment || !providerName) {
		return <UnauthorisedViewBase {...props} testId={testId} />;
	}

	return (
		<AnalyticsContext data={{ attributes: { experiment: 'social_proof_3p_unauth_block_exp', cohort: 'treatment', tier } }}>
			<UnauthorisedViewFrame
				{...props}
				content={
					<SocialProofMessage
						tier={tier}
						connectedPct={connectedPct}
						providerName={providerName}
					/>
				}
				providerName={providerName}
				testId={testId}
			/>
		</AnalyticsContext>
	);
};

const UnauthorisedViewWithoutExperiment = (props: FlexibleBlockCardProps): JSX.Element => {
	return <UnauthorisedViewBase {...props} />;
};

const UnauthorisedView = componentWithFG(
	'social-proof-3p-unauth-block-fg',
	UnauthorisedViewWithExperiment,
	UnauthorisedViewWithoutExperiment,
);

const _default_1: (props: FlexibleBlockCardProps) => JSX.Element =
	withFlexibleUIBlockCardStyle(UnauthorisedView);
export default _default_1;
