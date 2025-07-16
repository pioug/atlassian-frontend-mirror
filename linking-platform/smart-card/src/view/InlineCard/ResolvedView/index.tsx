import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import { type LozengeProps } from '../../../types';
import type { CardActionOptions } from '../../Card/types';
import { HoverCard } from '../../HoverCard';
import { type HoverPreviewOptions } from '../../HoverCard/types';
import InlineLozenge from '../common/inline-lozenge';
import { Frame } from '../Frame';
import { IconAndTitleLayout, LozengeWrapper } from '../IconAndTitleLayout';

export interface InlineCardResolvedViewProps {
	/** A unique ID for a Smart Link. */
	id?: string;
	/** The optional con of the service (e.g. Dropbox/Asana/Google/etc) to display */
	icon?: React.ReactNode;
	/** The name of the resource */
	title?: string;
	/** The the optional lozenge that might represent the statux of the resource */
	lozenge?: LozengeProps;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A flag that determines whether a card is in hover state in edit mode. Currently used for inline only */
	isHovered?: boolean;
	/** The optional url */
	link?: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/** The color of the title text only (not including the icon) */
	titleTextColor?: string;
	/** The Emoji icon prefix that was added to the title text via Add emoji button */
	titlePrefix?: React.ReactNode;
	/** Enables showing a custom preview on hover of link */
	showHoverPreview?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	/** Configure visibility of server and client actions */
	actionOptions?: CardActionOptions;
	/** Truncates the card to one line */
	truncateInline?: boolean;
	/** Type of inline card */
	type?: string[];
}

export class InlineCardResolvedView extends React.Component<InlineCardResolvedViewProps> {
	renderLozenge() {
		const { lozenge } = this.props;
		if (!lozenge) {
			return null;
		}
		const appearance = lozenge.appearance || 'default';
		if (fg('platform-linking-visual-refresh-inline-lozenge')) {
			return (
				<InlineLozenge
					testId="inline-card-resolved-view-lozenge"
					appearance={appearance}
					style={{ backgroundColor: lozenge?.style?.backgroundColor, color: lozenge?.style?.color }}
					isBold={
						fg('platform-component-visual-refresh') ? lozenge.isBold !== false : lozenge.isBold
					}
				>
					{lozenge.text}
				</InlineLozenge>
			);
		}

		return (
			<LozengeWrapper>
				<Lozenge
					testId="inline-card-resolved-view-lozenge"
					appearance={appearance}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={lozenge.style}
					isBold={
						fg('platform-component-visual-refresh') ? lozenge.isBold !== false : lozenge.isBold
					}
				>
					{lozenge.text}
				</Lozenge>
			</LozengeWrapper>
		);
	}

	render() {
		const {
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
		} = this.props;

		const inlineCardResolvedView = (
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
				/>
				{this.renderLozenge()}
			</Frame>
		);

		if (showHoverPreview && link) {
			return (
				<HoverCard
					id={id}
					url={link}
					actionOptions={actionOptions}
					hoverPreviewOptions={hoverPreviewOptions}
				>
					{inlineCardResolvedView}
				</HoverCard>
			);
		}

		return inlineCardResolvedView;
	}
}
