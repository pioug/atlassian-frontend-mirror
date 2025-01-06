import React from 'react';

import { styled } from '@compiled/react';
import ImageLoader from 'react-render-image';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Icon, Shimmer } from '../Icon';
import {
	LinkAppearance as LinkAppearanceOld,
	NoLinkAppearance as NoLinkAppearanceOld,
} from '../styled-emotion';

import {
	EmojiWrapper,
	IconEmptyWrapper,
	IconPositionWrapper,
	IconTitleWrapper,
	IconWrapper,
	TitleWrapper,
	TitleWrapperClassName,
} from './styled';
import {
	EmojiWrapper as EmojiWrapperOld,
	IconEmptyWrapper as IconEmptyWrapperOld,
	IconPositionWrapper as IconPositionWrapperOld,
	IconTitleWrapper as IconTitleWrapperOld,
	IconWrapper as IconWrapperOld,
	TitleWrapper as TitleWrapperOld,
} from './styled-emotion';

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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
const NoLinkAppearance = styled.span({
	color: token('color.text.subtlest', N200),
	marginLeft: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
const LinkAppearance = styled.a({
	color: token('color.link', B400),
	'&:hover': {
		textDecoration: 'none',
	},
});

export class IconAndTitleLayout extends React.Component<IconAndTitleLayoutProps> {
	public static defaultProps = {
		rightSideSpacer: true,
	};

	private renderAtlaskitIcon() {
		const { icon, emoji } = this.props;

		if (emoji) {
			return fg('bandicoots-compiled-migration-smartcard') ? (
				<EmojiWrapper>{emoji}</EmojiWrapper>
			) : (
				<EmojiWrapperOld>{emoji}</EmojiWrapperOld>
			);
		}

		if (!icon || typeof icon === 'string') {
			return null;
		}

		return fg('bandicoots-compiled-migration-smartcard') ? (
			<IconWrapper>{icon}</IconWrapper>
		) : (
			<IconWrapperOld>{icon}</IconWrapperOld>
		);
	}

	private renderImageIcon(errored: React.ReactNode, testId: string) {
		const { icon: url } = this.props;

		if (!url || typeof url !== 'string') {
			return null;
		}

		return (
			<ImageLoader
				src={url}
				loaded={
					<Icon
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="smart-link-icon"
						src={url}
						data-testid={`${testId}-image`}
					/>
				}
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

		return (
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

		const titlePart = fg('bandicoots-compiled-migration-smartcard') ? (
			<>
				<IconPositionWrapper data-testid="icon-position-wrapper">
					{children || (
						<>
							<IconEmptyWrapper data-testid="icon-empty-wrapper" />
							{this.renderIcon(testId)}
						</>
					)}
				</IconPositionWrapper>

				<TitleWrapper
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ color: titleTextColor }}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={TitleWrapperClassName}
				>
					{title}
				</TitleWrapper>
			</>
		) : (
			<>
				<IconPositionWrapperOld data-testid="icon-position-wrapper">
					{children || (
						<>
							<IconEmptyWrapperOld data-testid="icon-empty-wrapper" />
							{this.renderIcon(testId)}
						</>
					)}
				</IconPositionWrapperOld>

				<TitleWrapperOld
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ color: titleTextColor }}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={TitleWrapperClassName}
				>
					{title}
				</TitleWrapperOld>
			</>
		);

		if (fg('bandicoots-compiled-migration-smartcard')) {
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
		} else {
			return (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<IconTitleWrapperOld style={{ color: titleColor }} data-testid={testId}>
					{link ? (
						<LinkAppearanceOld
							href={link}
							onClick={this.handleClick}
							onKeyPress={this.handleKeyPress}
						>
							{titlePart}
						</LinkAppearanceOld>
					) : (
						titlePart
					)}
					{rightSide ? <NoLinkAppearanceOld>{rightSide}</NoLinkAppearanceOld> : null}
				</IconTitleWrapperOld>
			);
		}
	}
}
