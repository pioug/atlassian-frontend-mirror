import React from 'react';

import { fg } from "@atlaskit/platform-feature-flags";
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import useInlineActionNudgeExperiment from '../../../state/hooks/use-inline-action-nudge-experiment';
import useInlineTailoredActionExperiment from '../../../state/hooks/use-inline-tailored-action-experiment';
import { HoverCard } from '../../HoverCard';
import { RovoActionsCta, InlineRovoActionButton } from '../common/rovo-actions-cta';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

import { renderLozenge } from './renderLozenge';
import { type InlineCardResolvedViewFunctionalProps } from './types';

export function InlineCardResolvedViewBase({
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

export function InlineCardResolvedViewFunctionalWithRovoActions({
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
	const { isEnabled } = useInlineActionNudgeExperiment(link, showHoverPreview, actionOptions);
	const { isEnabled: isInlineTailoredRovoActionEnabled } = useInlineTailoredActionExperiment(link, showHoverPreview, actionOptions);

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
			{isEnabled && !fg('platform_sl_3p_auth_inline_tailored_cta_killswitch') && <RovoActionsCta testId={`${testId}-rovo-actions-cta`} />}
			{isInlineTailoredRovoActionEnabled && <InlineRovoActionButton testId={`${testId}-rovo-actions-cta`} url={link} />}
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

// Todo: replace with platform_sl_3p_auth_inline_tailored_cta_killswitch after cleanup of rovogrowth-640-inline-action-nudge-fg
export const InlineCardResolvedViewFunctional: React.FC<InlineCardResolvedViewFunctionalProps> =
	componentWithFG(
		'rovogrowth-640-inline-action-nudge-fg',
		InlineCardResolvedViewFunctionalWithRovoActions,
		InlineCardResolvedViewBase,
	);
