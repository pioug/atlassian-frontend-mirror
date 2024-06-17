/** @jsx jsx */
import React, { useMemo } from 'react';

import LinkIcon from '@atlaskit/icon/glyph/link';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { type IconProps } from './types';
import { type IconType, SmartLinkPosition, SmartLinkSize } from '../../../../../constants';
import AtlaskitIcon from '../../common/atlaskit-icon';
import ImageIcon from '../../common/image-icon';
import { getIconSizeStyles, getIconWidth, getTruncateStyles } from '../../utils';

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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
	label?: string,
	testId?: string,
): React.ReactNode | undefined => {
	if (icon) {
		return <AtlaskitIcon icon={icon} label={label} testId={`${testId}-icon`} />;
	}
};

const renderDefaultIcon = (label: string, testId: string): React.ReactNode => (
	<LinkIcon label={label} testId={`${testId}-default`} />
);

const renderImageIcon = (
	defaultIcon: React.ReactNode,
	url?: string,
	testId?: string,
): React.ReactNode | undefined => {
	if (url) {
		return <ImageIcon defaultIcon={defaultIcon} testId={testId} url={url} />;
	}
};

/**
 * A base element that displays an Icon or favicon.
 * @internal
 * @param {IconProps} IconProps - The props necessary for the Icon element.
 * @see LinkIcon
 */
const Icon: React.FC<IconProps> = ({
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
}) => {
	const element = useMemo(() => {
		const defaultIcon = renderDefaultIcon(label, testId);
		return (
			overrideIcon ||
			render?.() ||
			renderImageIcon(defaultIcon, url, testId) ||
			renderAtlaskitIcon(icon, label, testId) ||
			defaultIcon
		);
	}, [overrideIcon, icon, label, render, testId, url]);

	const width = getIconWidth(size);
	const styles = getIconStyles(position, width);
	const renderStyles = render ? getCustomRenderStyles(width) : undefined;

	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- needs dynamic css
			css={[styles, renderStyles, overrideCss]}
			data-fit-to-content
			data-smart-element={name}
			data-smart-element-icon
			data-testid={testId}
		>
			{element}
		</div>
	);
};

export default Icon;
