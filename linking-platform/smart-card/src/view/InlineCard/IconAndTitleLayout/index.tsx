/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ComponentPropsWithoutRef, useState } from 'react';

import { css, jsx, styled } from '@compiled/react';
import { di } from 'react-magnetic-di';
import ImageLoader from 'react-render-image';

import { cssMap } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/migration/link';
import { Box } from '@atlaskit/primitives/compiled';
import { B400 } from '@atlaskit/theme/colors';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { isProfileType } from '../../../utils';
import { Shimmer } from '../Icon';

const iconWrapperStyle = css({
	display: 'inline-flex',
	font: token('font.body.small'),
	position: 'absolute',
	borderRadius: token('radius.xsmall'),
	marginRight: token('space.050'),
	height: '16px',
	width: '16px',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	userSelect: 'none',
});

const iconImageStyle = css({
	maxHeight: '16px',
	maxWidth: '16px',
	width: '100%',
});

const styles = cssMap({
	iconEmptyStyle: {
		width: '16px',
		height: '100%',
		display: 'inline-block',
		opacity: 0,
	},
	iconOuterWrapperStyle: {
		display: 'inline-block',
		marginRight: token('space.050'),
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
	},
	linkStyle: {
		borderRadius: token('radius.xsmall'),
	},
	noLinkAppearanceStyle: {
		color: token('color.text.subtlest'),
		marginLeft: token('space.050'),
	},
	roundImageStyle: {
		borderRadius: token('radius.full'),
	},
});

export interface IconAndTitleLayoutProps {
	children?: React.ReactNode;
	defaultIcon?: React.ReactNode;
	emoji?: React.ReactNode;
	hideIconLoadingSkeleton?: boolean;
	icon?: React.ReactNode;
	link?: string;
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	right?: React.ReactNode;
	rightSide?: React.ReactNode;
	rightSideSpacer?: boolean;
	testId?: string;
	title: React.ReactNode;
	titleColor?: string;
	titleTextColor?: string;
	type?: string[];
}

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled,@atlaskit/design-system/no-html-anchor -- Ignored via go/DSP-18766
const LinkAppearance = styled.a({
	color: token('color.link', B400),
	'&:hover': {
		textDecoration: 'none',
	},
});

export const IconAndTitleLayout = ({
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
	type,
	hideIconLoadingSkeleton,
}: IconAndTitleLayoutProps) => {
	const [hasImageErrored, setHasImageErrored] = useState(false);

	const renderAtlaskitIcon = React.useCallback(() => {
		if (emoji) {
			return emoji;
		}
		if (!icon || typeof icon === 'string') {
			return null;
		}
		return icon;
	}, [emoji, icon]);

	const profileType = isProfileType(type);

	const renderImageIcon = React.useCallback(
		(errored: React.ReactNode, testId: string) => {
			di(ImageLoader);
			if (!icon || typeof icon !== 'string') {
				return null;
			}

			if (
				expValEquals('platform_editor_smart_card_otp', 'isEnabled', true) &&
				hideIconLoadingSkeleton
			) {
				if (hasImageErrored) {
					return errored;
				}

				return (
					<img
						css={[iconImageStyle, profileType && styles.roundImageStyle]}
						src={icon}
						data-testid={`${testId}-image`}
						alt=""
						onError={() => setHasImageErrored(true)}
					/>
				);
			}

			return (
				<ImageLoader
					src={icon}
					loaded={
						<img
							css={[iconImageStyle, profileType && styles.roundImageStyle]}
							src={icon}
							data-testid={`${testId}-image`}
							alt=""
						/>
					}
					errored={errored}
					loading={<Shimmer testId={`${testId}-loading`} />}
				/>
			);
		},
		[icon, profileType, hideIconLoadingSkeleton, hasImageErrored],
	);

	const renderIconPlaceholder = React.useCallback(
		(testId: string) => {
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
			<Box
				as="span"
				// EDM-12119: This is set here to help with the positioning of the icon to be in the middle of inline display.
				// We cannot set the fix font because inline is taking the parent container font size into account.
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				style={{ lineHeight: `1` }}
				xcss={styles.iconOuterWrapperStyle}
				testId="icon-position-wrapper"
			>
				{children || (
					<>
						<Box as="span" xcss={styles.iconEmptyStyle} testId="icon-empty-wrapper" />
						<span css={[iconWrapperStyle]} data-testId="icon-wrapper">
							{renderIcon(testId)}
						</span>
					</>
				)}
			</Box>
			<Box as="span" style={{ color: titleTextColor }}>
				{title}
			</Box>
		</>
	);

	return (
		<>
			<IconTitleWrapper style={{ color: titleColor }} testId={testId}>
				{link ? (
					<LinkAppearance
						css={styles.linkStyle}
						href={link}
						onClick={handleClick}
						onKeyPress={handleKeyPress}
					>
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
		</>
	);
};

export const IconTitleWrapper = (props: ComponentPropsWithoutRef<typeof Box>) => {
	return <Box as="span" xcss={styles.iconTitleWrapperStyle} {...props} />;
};
