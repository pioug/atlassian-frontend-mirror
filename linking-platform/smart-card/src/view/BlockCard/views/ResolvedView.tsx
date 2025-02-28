/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { ActionName, ElementName, SmartLinkPosition, SmartLinkStatus } from '../../../constants';
import FlexibleCard from '../../FlexibleCard';
import {
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
} from '../../FlexibleCard/components/blocks';
import type { ActionItem } from '../../FlexibleCard/components/blocks/types';

import ResolvedViewOld from './ResolvedViewOld';
import { type FlexibleBlockCardProps } from './types';
import {
	FlexibleCardUiOptions,
	getSimulatedBetterMetadata,
	PreviewBlockOptions,
	titleBlockOptions,
} from './utils';
import { withFlexibleUIBlockCardStyle } from './utils/withFlexibleUIBlockCardStyle';

const titleBlockCssOld = css({
	gap: token('space.100', '0.5rem'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
	},
});

const titleBlockCss = css({
	gap: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"[data-smart-element='Title']": {
		fontWeight: token('font.weight.semibold'),
		color: token('color.link'),
	},
});

const footerBlockCssOld = css({
	height: '1.5rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.actions-button-group': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'button, button:hover, button:focus, button:active': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '0.875rem',
		},
	},
});

const footerBlockCss = css({
	height: '1.5rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-end',
	alignSelf: 'stretch',
});

const metadataBlockCssOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'span[data-smart-element-avatar-group]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> ul': {
			paddingLeft: '0px',
			marginRight: token('space.100', '0.5rem'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-smart-element-group]': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1rem',
	},
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
}: FlexibleBlockCardProps) => {
	const [isPreviewBlockErrored, setIsPreviewBlockErrored] = useState<boolean>(false);

	useEffect(() => {
		setIsPreviewBlockErrored(false);
	}, [url, cardState]);

	const { titleMetadata, topMetadata, bottomMetadata } = getSimulatedBetterMetadata(
		cardState.details,
	);

	const footerActions: ActionItem[] = useMemo(
		() => [
			{ name: ActionName.FollowAction, hideIcon: true },
			{ name: ActionName.PreviewAction, hideIcon: true },
			{ name: ActionName.DownloadAction, hideIcon: true },
		],
		[],
	);

	const status = cardState.status as SmartLinkStatus;

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
			ui={FlexibleCardUiOptions}
			url={url}
		>
			<TitleBlock
				{...titleBlockOptions}
				metadata={titleMetadata}
				subtitle={[{ name: ElementName.Location }]}
				metadataPosition={SmartLinkPosition.Top}
				css={[fg('platform-linking-visual-refresh-v1') ? titleBlockCss : titleBlockCssOld]}
				status={status}
			/>
			<MetadataBlock
				primary={topMetadata}
				maxLines={1}
				css={[!fg('platform-linking-visual-refresh-v1') && metadataBlockCssOld]}
				status={SmartLinkStatus.Resolved}
			/>
			<SnippetBlock />
			<MetadataBlock
				primary={bottomMetadata}
				maxLines={1}
				css={[!fg('platform-linking-visual-refresh-v1') && metadataBlockCssOld]}
				status={SmartLinkStatus.Resolved}
			/>
			{!isPreviewBlockErrored ? (
				<PreviewBlock
					{...PreviewBlockOptions}
					onError={() => {
						setIsPreviewBlockErrored(true);
					}}
					status={SmartLinkStatus.Resolved}
				/>
			) : null}
			<FooterBlock
				css={[fg('platform-linking-visual-refresh-v1') ? footerBlockCss : footerBlockCssOld]}
				actions={footerActions}
				status={SmartLinkStatus.Resolved}
			/>
		</FlexibleCard>
	);
};

const ResolvedViewExported = (props: FlexibleBlockCardProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ResolvedView {...props} />;
	} else {
		return <ResolvedViewOld {...props} />;
	}
};

export default withFlexibleUIBlockCardStyle(ResolvedViewExported);
