import React from 'react';
import { Frame } from '../Frame';
import Lozenge from '@atlaskit/lozenge';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { LozengeWrapper } from '../IconAndTitleLayout/styled';
import { type LozengeProps } from '../../../types';
import { HoverCard } from '../../HoverCard/index';
import type { CardActionOptions } from '../../Card/types';
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
	/** Configure visibility of server and client actions */
	actionOptions?: CardActionOptions;
}

export class InlineCardResolvedView extends React.Component<InlineCardResolvedViewProps> {
	renderLozenge() {
		const { lozenge } = this.props;
		if (!lozenge) {
			return null;
		}
		const appearance = lozenge.appearance || 'default';
		return (
			<LozengeWrapper>
				<Lozenge
					testId="inline-card-resolved-view-lozenge"
					appearance={appearance}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={lozenge.style}
					isBold={lozenge.isBold}
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
			actionOptions,
		} = this.props;

		const inlineCardResolvedView = (
			<Frame
				testId={testId}
				link={link}
				isSelected={isSelected}
				isHovered={isHovered}
				onClick={onClick}
			>
				<IconAndTitleLayout
					emoji={titlePrefix}
					icon={icon}
					title={title}
					titleTextColor={titleTextColor}
				/>
				{this.renderLozenge()}
			</Frame>
		);

		if (showHoverPreview && link) {
			return (
				<HoverCard id={id} url={link} actionOptions={actionOptions}>
					{inlineCardResolvedView}
				</HoverCard>
			);
		}

		return inlineCardResolvedView;
	}
}
