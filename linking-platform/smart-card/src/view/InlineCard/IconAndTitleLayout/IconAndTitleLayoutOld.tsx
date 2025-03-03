/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';
import ImageLoader from 'react-render-image';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

import { Icon, Shimmer } from '../Icon';
import {
	LinkAppearance as LinkAppearanceOld,
	NoLinkAppearance as NoLinkAppearanceOld,
} from '../styled-emotion';

import {
	EmojiWrapperOldVisualRefresh,
	IconWrapperOldVisualRefresh,
	TitleWrapperClassNameOldVisualRefresh,
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

export class IconAndTitleLayoutOld extends React.Component<IconAndTitleLayoutProps> {
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
						alt=""
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

		const titlePart = (
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

const iconWidth = '16px';

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
