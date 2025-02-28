/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ComponentPropsWithoutRef } from 'react';

import { css, jsx, styled } from '@compiled/react';
import { di } from 'react-magnetic-di';
import ImageLoader from 'react-render-image';

import { cssMap } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { B400, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Icon, Shimmer } from '../Icon';

import { IconAndTitleLayoutOld } from './IconAndTitleLayoutOld';
import {
	EmojiWrapperOldVisualRefresh,
	IconEmptyWrapperOldVisualRefresh,
	IconPositionWrapperOldVisualRefresh,
	IconWrapperOldVisualRefresh,
	TitleWrapperClassNameOldVisualRefresh,
} from './styled';

const styles = cssMap({
	lozengeInternalWrapperStyle: {
		paddingBottom: token('space.025'),
	},
	lozengeWrapperStyle: {
		display: 'inline-block',
		verticalAlign: 'bottom',
		marginTop: token('space.0'),
		marginRight: token('space.050'),
		marginBottom: token('space.0'),
		marginLeft: token('space.025'),
	},
	iconEmptyStyle: {
		width: '16px',
		display: 'inline-block',
		opacity: 0,
	},
	iconOuterWrapperStyle: {
		marginRight: token('space.050'),
		display: 'inline-block',
		position: 'relative',
	},
	iconTitleWrapperStyle: {
		whiteSpace: 'pre-wrap',
		wordBreak: 'break-all',
		boxDecorationBreak: 'clone',
		paddingTop: token('space.025'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.050'),
		font: token('font.body'),
	},
	iconWrapperStyle: {
		position: 'absolute',
		display: 'inline-flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		top: token('space.0'),
		left: token('space.0'),
		bottom: token('space.0'),
		width: '16px',
		userSelect: 'none',
	},
	noLinkAppearanceStyle: {
		color: token('color.text.subtlest'),
		font: token('font.body'),
		marginLeft: token('space.050'),
	},
	titleWrapperStyle: {
		font: token('font.body'),
	},
});

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
	rightSideSpacer?: boolean;
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

const IconAndTitleLayoutNew = ({
	icon,
	emoji,
	defaultIcon,
	onClick,
	children,
	title,
	titleColor,
	titleTextColor,
	link,
	rightSide,
	testId = 'inline-card-icon-and-title',
}: IconAndTitleLayoutProps) => {
	const renderAtlaskitIcon = React.useCallback(() => {
		if (emoji) {
			if (fg('platform-linking-visual-refresh-v1')) {
				return (
					<Box as="span" xcss={styles.iconWrapperStyle} testId="icon-position-emoji-wrapper">
						{emoji}
					</Box>
				);
			}
			return <EmojiWrapperOldVisualRefresh>{emoji}</EmojiWrapperOldVisualRefresh>;
		}
		if (!icon || typeof icon === 'string') {
			return null;
		}
		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				<Box as="span" xcss={styles.iconWrapperStyle} testId="icon-atlaskit-icon-wrapper">
					{icon}
				</Box>
			);
		}
		return <IconWrapperOldVisualRefresh>{icon}</IconWrapperOldVisualRefresh>;
	}, [emoji, icon]);

	const renderImageIcon = React.useCallback(
		(errored: React.ReactNode, testId: string) => {
			di(ImageLoader);
			if (!icon || typeof icon !== 'string') {
				return null;
			}
			if (fg('platform-linking-visual-refresh-v1')) {
				return (
					<ImageLoader
						src={icon}
						loaded={<img css={iconImageStyle} src={icon} data-testid={`${testId}-image`} alt="" />}
						errored={errored}
						loading={<Shimmer testId={`${testId}-loading`} />}
					/>
				);
			}
			return (
				<ImageLoader
					src={icon}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					loaded={<Icon className="smart-link-icon" src={icon} data-testid={`${testId}-image`} />}
					errored={errored}
					loading={<Shimmer testId={`${testId}-loading`} />}
				/>
			);
		},
		[icon],
	);

	const renderIconPlaceholder = React.useCallback(
		(testId: string) => {
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
		},
		[defaultIcon],
	);

	const renderIcon = React.useCallback(
		(testId: string) => {
			const icon = renderAtlaskitIcon();
			if (icon) {
				return icon;
			}
			const placeholder = renderIconPlaceholder(testId);
			const image = renderImageIcon(placeholder, testId);
			if (fg('platform-linking-visual-refresh-v1')) {
				return (
					<Box as="span" xcss={styles.iconWrapperStyle} testId={`${testId}-image-wrapper`}>
						{image || placeholder}
					</Box>
				);
			}
			return image || placeholder;
		},
		[renderAtlaskitIcon, renderIconPlaceholder, renderImageIcon],
	);

	const handleClick = React.useCallback(
		(event: React.MouseEvent) => {
			if (onClick) {
				event.preventDefault();
				event.stopPropagation();
				onClick(event);
			}
		},
		[onClick],
	);

	const handleKeyPress = React.useCallback(
		(event: React.KeyboardEvent<HTMLAnchorElement>) => {
			if (event.key !== ' ' && event.key !== 'Enter') {
				return;
			}
			if (onClick) {
				event.preventDefault();
				event.stopPropagation();
				onClick(event);
			}
		},
		[onClick],
	);

	// maybe consider memoising this after clean up
	const titlePart = (
		<>
			{fg('platform-linking-visual-refresh-v1') ? (
				<Box as="span" xcss={styles.iconOuterWrapperStyle} testId="icon-position-wrapper">
					{children || (
						<>
							<Box as="span" xcss={styles.iconEmptyStyle} testId="icon-empty-wrapper" />
							{renderIcon(testId)}
						</>
					)}
				</Box>
			) : (
				<IconPositionWrapperOldVisualRefresh data-testid="icon-position-wrapper">
					{children || (
						<>
							<IconEmptyWrapperOldVisualRefresh data-testid="icon-empty-wrapper" />
							{renderIcon(testId)}
						</>
					)}
				</IconPositionWrapperOldVisualRefresh>
			)}

			{fg('platform-linking-visual-refresh-v1') ? (
				<Box as="span" style={{ color: titleTextColor }} xcss={styles.titleWrapperStyle}>
					{title}
				</Box>
			) : (
				<span
					style={{ color: titleTextColor }}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={TitleWrapperClassNameOldVisualRefresh}
				>
					{title}
				</span>
			)}
		</>
	);

	return (
		<>
			{fg('platform-linking-visual-refresh-v1') ? (
				<IconTitleWrapper style={{ color: titleColor }} testId={testId}>
					{link ? (
						<LinkAppearance href={link} onClick={handleClick} onKeyPress={handleKeyPress}>
							{titlePart}
						</LinkAppearance>
					) : (
						titlePart
					)}
					{rightSide ? (
						<Box as="span" xcss={styles.noLinkAppearanceStyle}>
							{rightSide}
						</Box>
					) : null}
				</IconTitleWrapper>
			) : (
				<IconTitleWrapperOldVisualRefresh style={{ color: titleColor }} data-testid={testId}>
					{link ? (
						<LinkAppearance href={link} onClick={handleClick} onKeyPress={handleKeyPress}>
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
};

export const IconAndTitleLayout = ({
	rightSideSpacer = true,
	...props
}: IconAndTitleLayoutProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <IconAndTitleLayoutNew rightSideSpacer={rightSideSpacer} {...props} />;
	}
	return <IconAndTitleLayoutOld rightSideSpacer={rightSideSpacer} {...props} />;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const IconTitleWrapperOldVisualRefresh = styled.span({
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-all',
	boxDecorationBreak: 'clone',
	paddingTop: token('space.025'),
	paddingRight: token('space.050'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.050'),
});

export const IconTitleWrapper = (props: ComponentPropsWithoutRef<typeof Box>) => {
	if (fg('platform-linking-visual-refresh-v1')) {
		return <Box as="span" xcss={styles.iconTitleWrapperStyle} {...props} />;
	}
	// note: This is just to get the types to work due to compiled css weirdness.
	return <IconTitleWrapperOldVisualRefresh {...(props as any)} />;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const LozengeWrapperOldVisualRefresh = styled.span({
	display: 'inline-block',
	verticalAlign: '1px',
	marginTop: 0,
	marginRight: token('space.050', '4px'),
	marginBottom: 0,
	marginLeft: token('space.025', '2px'),
});

export const LozengeWrapper = (props: ComponentPropsWithoutRef<typeof Box>) => {
	if (fg('platform-linking-visual-refresh-v1')) {
		return (
			<Box as="span" xcss={styles.lozengeWrapperStyle}>
				<Box xcss={styles.lozengeInternalWrapperStyle} {...props} />
			</Box>
		);
	}
	// note: This is just to get the types to work due to compiled css weirdness.
	return <LozengeWrapperOldVisualRefresh {...(props as any)} />;
};

const iconImageStyle = css({
	width: '100%',
});
