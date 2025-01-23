/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { type IconType, SmartLinkPosition, SmartLinkSize } from '../../../../../constants';
import AtlaskitIcon from '../../common/atlaskit-icon';
import ImageIcon from '../../common/image-icon';
import { getIconSizeStyles, getIconWidth, getTruncateStyles } from '../../utils';

import { type IconProps } from './types';

const getPositionStyles = (position: SmartLinkPosition): SerializedStyles => {
	switch (position) {
		case SmartLinkPosition.Center:
			return css({
				alignSelf: 'center',
			});
		case SmartLinkPosition.Top:
		default:
			return css({
				alignSelf: 'flex-start',
				margin: 0,
			});
	}
};

const getIconStyles = (position: SmartLinkPosition, width: string): SerializedStyles =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	css(getPositionStyles(position), getIconSizeStyles(width));

const getCustomRenderStyles = (value: string): SerializedStyles =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	css(getTruncateStyles(1, value), {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
		lineHeight: value,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontSize: value,
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	});

const renderAtlaskitIcon = (
	icon?: IconType,
	testId?: string,
	size: SmartLinkSize = SmartLinkSize.Medium,
): React.ReactNode | undefined => {
	if (icon) {
		return (
			<AtlaskitIcon
				icon={icon}
				testId={`${testId}-icon`}
				{...(fg('platform-smart-card-icon-migration') && {
					size,
				})}
			/>
		);
	}
};

const renderDefaultIcon = (label: string, testId: string): React.ReactNode => (
	<LinkIcon label={label} testId={`${testId}-default`} color="currentColor" />
);

const renderImageIcon = (
	defaultIcon: React.ReactNode,
	url?: string,
	testId?: string,
	size = SmartLinkSize.Medium,
): React.ReactNode | undefined => {
	const width = size === SmartLinkSize.Large ? token('space.300') : token('space.200');

	if (url) {
		return (
			<ImageIcon
				defaultIcon={defaultIcon}
				testId={testId}
				url={url}
				{...(fg('platform-smart-card-icon-migration') && {
					width,
					height: width,
				})}
			/>
		);
	}
};

/**
 * A base element that displays an Icon or favicon.
 * @internal
 * @param {IconProps} IconProps - The props necessary for the Icon element.
 * @see LinkIcon
 */
const IconOld = ({
	icon,
	overrideIcon,
	label = 'Link',
	name,
	position = SmartLinkPosition.Top,
	overrideCss,
	render,
	size = SmartLinkSize.Medium,
	testId = 'smart-element-icon',
	url,
}: IconProps) => {
	const element = useMemo(() => {
		const defaultIcon = renderDefaultIcon(label, testId);
		return (
			overrideIcon ||
			render?.() ||
			renderImageIcon(
				defaultIcon,
				url,
				testId,
				fg('platform-smart-card-icon-migration') ? size : undefined,
			) ||
			renderAtlaskitIcon(
				icon,
				testId,
				fg('platform-smart-card-icon-migration') ? size : undefined,
			) ||
			defaultIcon
		);
	}, [overrideIcon, icon, label, render, testId, url, size]);

	const width = getIconWidth(size);
	const styles = getIconStyles(position, width);
	const renderStyles = render ? getCustomRenderStyles(width) : undefined;

	return (
		<div
			css={[
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- needs dynamic css
				!fg('platform-smart-card-icon-migration') && styles,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- needs dynamic css
				renderStyles,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- needs dynamic css
				overrideCss,
			]}
			data-fit-to-content
			data-smart-element={name}
			data-smart-element-icon
			data-testid={testId}
		>
			{fg('platform-smart-card-icon-migration') ? (
				<Box
					xcss={iconWrapperStyle}
					style={{
						width,
						height: width,
					}}
				>
					{element}
				</Box>
			) : (
				element
			)}
		</div>
	);
};

const iconWrapperStyle = xcss({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export default IconOld;
