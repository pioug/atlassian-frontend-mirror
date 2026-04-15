import React from 'react';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import useInlineActionNudgeExperiment from '../../../state/hooks/use-inline-action-nudge-experiment';
import { HoverCard } from '../../HoverCard';
import { RovoActionsCta } from '../common/rovo-actions-cta';
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
	const { isEnabled } = useInlineActionNudgeExperiment(link);

	// TODO https://hello.jira.atlassian.cloud/browse/NAVX-4436: fire analytics with cohort
	const frame = (
		<Frame
			testId={testId}
			link={link}
			isSelected={isSelected}
			isHovered={isHovered}
			onClick={onClick}
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
			{
				isEnabled && link && (
					<RovoActionsCta testId={`${testId}-rovo-actions-cta`} />
				)
			}
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

export const InlineCardResolvedViewFunctional = componentWithFG(
	'rovogrowth-640-inline-action-nudge-fg',
	InlineCardResolvedViewFunctionalWithRovoActions,
	InlineCardResolvedViewBase,
);
