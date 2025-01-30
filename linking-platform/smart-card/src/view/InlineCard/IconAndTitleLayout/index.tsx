/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ComponentPropsWithoutRef } from 'react';

import { css, jsx, styled } from '@compiled/react';
import { di } from 'react-magnetic-di';
import ImageLoader from 'react-render-image';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { B400, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Icon, Shimmer } from '../Icon';
import {
	LinkAppearance as LinkAppearanceOld,
	NoLinkAppearance as NoLinkAppearanceOld,
} from '../styled-emotion';

import {
	EmojiWrapperOldVisualRefresh,
	IconEmptyWrapperOldVisualRefresh,
	IconPositionWrapperOldVisualRefresh,
	IconTitleWrapperOldVisualRefresh,
	IconWrapperOldVisualRefresh,
	TitleWrapperClassNameOldVisualRefresh,
	TitleWrapperOldVisualRefresh,
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
const NoLinkAppearanceOldVisualRefresh = styled.span({
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
			if (fg('platform-linking-visual-refresh-v1')) {
				return (
					<Box as="span" xcss={iconWrapperStyle} testId="icon-position-emoji-wrapper">
						{emoji}
					</Box>
				);
			}

			return fg('bandicoots-compiled-migration-smartcard') ? (
				<EmojiWrapperOldVisualRefresh>{emoji}</EmojiWrapperOldVisualRefresh>
			) : (
				<EmojiWrapperOld>{emoji}</EmojiWrapperOld>
			);
		}

		if (!icon || typeof icon === 'string') {
			return null;
		}

		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				<Box as="span" xcss={iconWrapperStyle} testId="icon-atlaskit-icon-wrapper">
					{icon}
				</Box>
			);
		}

		return fg('bandicoots-compiled-migration-smartcard') ? (
			<IconWrapperOldVisualRefresh>{icon}</IconWrapperOldVisualRefresh>
		) : (
			<IconWrapperOld>{icon}</IconWrapperOld>
		);
	}

	private renderImageIcon(errored: React.ReactNode, testId: string) {
		di(ImageLoader);

		const { icon: url } = this.props;

		if (!url || typeof url !== 'string') {
			return null;
		}

		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				<ImageLoader
					src={url}
					loaded={<img css={iconImageStyle} src={url} data-testid={`${testId}-image`} alt="" />}
					errored={errored}
					loading={<Shimmer testId={`${testId}-loading`} />}
				/>
			);
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

		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				defaultIcon || (
					<LinkIcon
						label="link"
						LEGACY_size="small"
						testId={`${testId}-default`}
						color="currentColor"
					/>
				)
			);
		}

		if (defaultIcon) {
			return <IconWrapperOldVisualRefresh>{defaultIcon}</IconWrapperOldVisualRefresh>;
		}

		return (
			<IconWrapperOldVisualRefresh>
				<LinkIcon
					label="link"
					LEGACY_size="small"
					testId={`${testId}-default`}
					color="currentColor"
				/>
			</IconWrapperOldVisualRefresh>
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

		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				<Box as="span" xcss={iconWrapperStyle} testId={`${testId}-image-wrapper`}>
					{image || placeholder}
				</Box>
			);
		}

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
				{fg('platform-linking-visual-refresh-v1') ? (
					<Box as="span" xcss={iconOuterWrapperStyle} testId="icon-position-wrapper">
						{children || (
							<>
								<Box as="span" xcss={iconEmptyStyle} testId="icon-empty-wrapper" />
								{this.renderIcon(testId)}
							</>
						)}
					</Box>
				) : (
					<IconPositionWrapperOldVisualRefresh data-testid="icon-position-wrapper">
						{children || (
							<>
								<IconEmptyWrapperOldVisualRefresh data-testid="icon-empty-wrapper" />
								{this.renderIcon(testId)}
							</>
						)}
					</IconPositionWrapperOldVisualRefresh>
				)}
				{fg('platform-linking-visual-refresh-v1') ? (
					<Box
						as="span"
						style={{ color: this.props.titleTextColor }}
						{...(!fg('platform-linking-visual-refresh-v1')
							? {
									className: TitleWrapperClassNameOldVisualRefresh,
								}
							: {})}
					>
						{title}
					</Box>
				) : (
					<TitleWrapperOldVisualRefresh
						style={{ color: this.props.titleTextColor }}
						{...(!fg('platform-linking-visual-refresh-v1')
							? {
									className: TitleWrapperClassNameOldVisualRefresh,
								}
							: {})}
					>
						{title}
					</TitleWrapperOldVisualRefresh>
				)}
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
					className={TitleWrapperClassNameOldVisualRefresh}
				>
					{title}
				</TitleWrapperOld>
			</>
		);

		if (fg('bandicoots-compiled-migration-smartcard')) {
			return (
				<>
					{fg('platform-linking-visual-refresh-v1') ? (
						<IconTitleWrapper style={{ color: this.props.titleColor }} testId={testId}>
							{link ? (
								<LinkAppearance
									href={link}
									onClick={this.handleClick}
									onKeyPress={this.handleKeyPress}
								>
									{titlePart}
								</LinkAppearance>
							) : (
								titlePart
							)}
							{rightSide ? (
								<Box as="span" xcss={noLinkAppearanceStyle}>
									{rightSide}
								</Box>
							) : null}
						</IconTitleWrapper>
					) : (
						<IconTitleWrapperOldVisualRefresh
							style={{ color: this.props.titleColor }}
							data-testid={testId}
						>
							{link ? (
								<LinkAppearance
									href={link}
									onClick={this.handleClick}
									onKeyPress={this.handleKeyPress}
								>
									{titlePart}
								</LinkAppearance>
							) : (
								titlePart
							)}
							{rightSide ? (
								<NoLinkAppearanceOldVisualRefresh>{rightSide}</NoLinkAppearanceOldVisualRefresh>
							) : null}
						</IconTitleWrapperOldVisualRefresh>
					)}
				</>
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

export const IconTitleWrapper = (props: ComponentPropsWithoutRef<typeof Box>) => {
	return <Box as="span" xcss={iconTitleWrapperStyle} {...props} />;
};

export const LozengeWrapper = (props: ComponentPropsWithoutRef<typeof Box>) => {
	return (
		<Box as="span" xcss={lozengeWrapperStyle}>
			<Box xcss={lozengeInternalWrapperStyle} {...props} />
		</Box>
	);
};

const lozengeInternalWrapperStyle = xcss({
	paddingBottom: 'space.025',
});

const lozengeWrapperStyle = xcss({
	display: 'inline-block',
	verticalAlign: 'bottom',
	marginTop: 'space.0',
	marginRight: 'space.050',
	marginBottom: 'space.0',
	marginLeft: 'space.025',
});

const horizontalPadding = 'space.050';
const verticalPadding = 'space.025';
const iconWidth = '16px';

const iconEmptyStyle = xcss({
	width: iconWidth,
	display: 'inline-block',
	opacity: 0,
});

const iconOuterWrapperStyle = xcss({
	marginRight: 'space.050',
	display: 'inline-block',
	position: 'relative',
});

const iconTitleWrapperStyle = xcss({
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-all',
	boxDecorationBreak: 'clone',
	paddingTop: verticalPadding,
	paddingRight: horizontalPadding,
	paddingBottom: verticalPadding,
	paddingLeft: horizontalPadding,
});

const iconWrapperStyle = xcss({
	position: 'absolute',
	display: 'inline-flex',
	alignItems: 'center',
	boxSizing: 'border-box',
	top: 'space.0',
	left: 'space.0',
	bottom: 'space.0',
	width: iconWidth,
	userSelect: 'none',
});

const iconImageStyle = css({
	width: '100%',
});

const noLinkAppearanceStyle = xcss({
	color: 'color.text.subtlest',
	font: 'font.body',
	marginLeft: 'space.050',
});
