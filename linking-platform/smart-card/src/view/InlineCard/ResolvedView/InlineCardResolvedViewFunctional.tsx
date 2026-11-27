import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import useInlineTailoredAction from '../../../state/hooks/use-inline-tailored-actions';
import { HoverCard } from '../../HoverCard';
import { InlineCardAction } from '../common/inline-card-action';
import { InlineRovoActionButton } from '../common/rovo-actions-cta';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { renderLozenge } from './renderLozenge';
import { type InlineCardResolvedViewFunctionalProps } from './types';

export function InlineCardResolvedViewFunctional({
	id,
	title = '',
	isSelected,
	isHovered,
	onClick,
	onAuxClick,
	onContextMenu,
	icon,
	link,
	testId = 'inline-card-resolved-view',
	titleTextColor,
	titlePrefix,
	showHoverPreview = false,
	hoverPreviewOptions,
	actionOptions,
	truncateInline,
	type,
	hideIconLoadingSkeleton,
	lozenge,
}: InlineCardResolvedViewFunctionalProps): React.JSX.Element {
	const { isEnabled: isInlineTailoredRovoActionEnabled } = useInlineTailoredAction(
		link,
		showHoverPreview,
		actionOptions,
	);

	// TODO https://hello.jira.atlassian.cloud/browse/NAVX-4436: fire analytics with cohort
	const frame = (
		<Frame
			testId={testId}
			link={link}
			isSelected={isSelected}
			isHovered={isHovered}
			onClick={onClick}
			onAuxClick={onAuxClick}
			onContextMenu={onContextMenu}
			truncateInline={truncateInline}
		>
			<IconAndTitleLayout
				emoji={titlePrefix}
				icon={icon}
				title={title}
				titleTextColor={titleTextColor}
				type={type}
				hideIconLoadingSkeleton={hideIconLoadingSkeleton}
			/>
			{renderLozenge(lozenge)}
			{fg('platform_sl_3p_auth_visualize_killswitch') ? (
				<InlineCardAction
					id={id}
					testId={testId}
					url={link}
					actionOptions={actionOptions}
					showHoverPreview={showHoverPreview}
				/>
			) : (
				isInlineTailoredRovoActionEnabled && (
					<InlineRovoActionButton
						testId={`${testId}-rovo-actions-cta`}
						url={link}
						actionOptions={actionOptions}
					/>
				)
			)}
		</Frame>
	);

	if (!showHoverPreview || !link) {
		return frame;
	}

	return (
		<HoverCard
			id={id}
			url={link}
			actionOptions={actionOptions}
			hoverPreviewOptions={hoverPreviewOptions}
		>
			{frame}
		</HoverCard>
	);
}
