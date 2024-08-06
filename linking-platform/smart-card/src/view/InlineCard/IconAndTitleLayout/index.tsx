import React from 'react';
import ImageLoader from 'react-render-image';
import { Icon, IconResized, Shimmer } from '../Icon';
import {
	IconEmptyWrapper,
	IconPositionWrapper,
	IconTitleWrapper,
	IconWrapper,
	TitleWrapper,
	EmojiWrapper,
	TitleWrapperClassName,
	IconEmptyWrapperResized,
	IconWrapperResized,
	EmojiWrapperResized,
} from './styled';
import LinkIcon from '@atlaskit/icon/core/migration/link';
import { LinkAppearance, NoLinkAppearance } from '../styled';

import { fg } from '@atlaskit/platform-feature-flags';

export interface IconAndTitleLayoutProps {
	emoji?: React.ReactNode;
	icon?: React.ReactNode;
	title: React.ReactNode;
	right?: React.ReactNode;
	titleColor?: string;
	titleTextColor?: string;
	children?: React.ReactNode;
	defaultIcon?: React.ReactNode;
	testId?: string;
	link?: string;
	rightSide?: React.ReactNode;
	rightSideSpacer: boolean;
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
}

export class IconAndTitleLayout extends React.Component<IconAndTitleLayoutProps> {
	public static defaultProps = {
		rightSideSpacer: true,
	};

	private renderAtlaskitIcon() {
		const { icon, emoji } = this.props;

		if (emoji) {
			return fg('linking-platform-increase-inline-card-icon-size') ? (
				<EmojiWrapperResized>{emoji}</EmojiWrapperResized>
			) : (
				<EmojiWrapper>{emoji}</EmojiWrapper>
			);
		}

		if (!icon || typeof icon === 'string') {
			return null;
		}

		return fg('linking-platform-increase-inline-card-icon-size') ? (
			<IconWrapperResized>{icon}</IconWrapperResized>
		) : (
			<IconWrapper>{icon}</IconWrapper>
		);
	}

	private renderImageIcon(errored: React.ReactNode, testId: string) {
		const { icon: url } = this.props;

		if (!url || typeof url !== 'string') {
			return null;
		}

		const icon = fg('linking-platform-increase-inline-card-icon-size') ? (
			<IconResized
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="smart-link-icon"
				src={url}
				data-testid={`${testId}-image`}
			/>
		) : (
			<Icon
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="smart-link-icon"
				src={url}
				data-testid={`${testId}-image`}
			/>
		);

		return (
			<ImageLoader
				src={url}
				loaded={icon}
				errored={errored}
				loading={<Shimmer testId={`${testId}-loading`} />}
			/>
		);
	}

	private renderIconPlaceholder(testId: string) {
		const { defaultIcon } = this.props;

		if (defaultIcon) {
			return <IconWrapper>{defaultIcon}</IconWrapper>;
		}

		return fg('linking-platform-increase-inline-card-icon-size') ? (
			<IconWrapperResized data-testid={`${testId}-default`}>
				<LinkIcon
					label="link"
					LEGACY_size="small"
					testId={`${testId}-default`}
					color="currentColor"
				/>
			</IconWrapperResized>
		) : (
			<IconWrapper>
				<LinkIcon
					label="link"
					LEGACY_size="small"
					testId={`${testId}-default`}
					color="currentColor"
				/>
			</IconWrapper>
		);
	}

	renderIcon(testId: string) {
		// We render two kinds of icons here:
		// - Image: acquired from either DAC or Teamwork Platform Apps;
		// - Atlaskit Icon: an Atlaskit SVG;
		// Each of these are scaled down to 12x12.
		const icon = this.renderAtlaskitIcon();
		if (icon) {
			return icon;
		}

		const placeholder = this.renderIconPlaceholder(testId);
		const image = this.renderImageIcon(placeholder, testId);

		return image || placeholder;
	}

	handleClick = (event: React.MouseEvent) => {
		const { onClick } = this.props;
		if (onClick) {
			event.preventDefault();
			event.stopPropagation();
			onClick(event);
		}
	};

	handleKeyPress = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
		const { onClick } = this.props;
		if (event.key !== ' ' && event.key !== 'Enter') {
			return;
		}
		if (onClick) {
			event.preventDefault();
			event.stopPropagation();
			onClick(event);
		}
	};

	render() {
		const {
			children,
			title,
			titleColor,
			titleTextColor,
			link,
			rightSide,
			testId = 'inline-card-icon-and-title',
		} = this.props;

		const iconPart = fg('linking-platform-increase-inline-card-icon-size') ? (
			<IconPositionWrapper data-testid="icon-position-wrapper">
				{children || (
					<>
						<IconEmptyWrapperResized data-testid="icon-empty-wrapper" />
						{this.renderIcon(testId)}
					</>
				)}
			</IconPositionWrapper>
		) : (
			<IconPositionWrapper>
				{children || (
					<>
						<IconEmptyWrapper />
						{this.renderIcon(testId)}
					</>
				)}
			</IconPositionWrapper>
		);

		const titlePart = (
			<>
				{iconPart}

				<TitleWrapper
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ color: titleTextColor }}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={TitleWrapperClassName}
				>
					{title}
				</TitleWrapper>
			</>
		);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<IconTitleWrapper style={{ color: titleColor }} data-testid={testId}>
				{link ? (
					<LinkAppearance href={link} onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
						{titlePart}
					</LinkAppearance>
				) : (
					titlePart
				)}
				{rightSide ? <NoLinkAppearance>{rightSide}</NoLinkAppearance> : null}
			</IconTitleWrapper>
		);
	}
}
