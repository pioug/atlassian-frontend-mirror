/* eslint-disable @compiled/shorthand-property-sorting */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type IconType, SmartLinkPosition, SmartLinkSize } from '../../../../../constants';
import AtlaskitIcon from '../../common/atlaskit-icon';
import ImageIcon from '../../common/image-icon';
import { getIconWidth } from '../../utils';

import { type IconProps } from './types';

const styles = cssMap({
	container: {
		minWidth: 'fit-content',
	},
	iconWrapperStyle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const positionStyleMap = cssMap({
	center: {
		alignSelf: 'center',
	},
	top: {
		alignSelf: 'flex-start',
		margin: 0,
	},
});

const iconStylesMapOld = cssMap({
	xlarge: {
		flex: '0 0 auto',
		height: '2rem',
		minHeight: '2rem',
		maxHeight: '2rem',
		width: '2rem',
		minWidth: '2rem',
		maxWidth: '2rem',
		'span, svg, img': {
			height: '2rem',
			minHeight: '2rem',
			maxHeight: '2rem',
			width: '2rem',
			minWidth: '2rem',
			maxWidth: '2rem',
		},
		svg: {
			padding: 0,
		},
	},
	large: {
		flex: '0 0 auto',
		height: '1.5rem',
		minHeight: '1.5rem',
		maxHeight: '1.5rem',
		width: '1.5rem',
		minWidth: '1.5rem',
		maxWidth: '1.5rem',
		'span, svg, img': {
			height: '1.5rem',
			minHeight: '1.5rem',
			maxHeight: '1.5rem',
			width: '1.5rem',
			minWidth: '1.5rem',
			maxWidth: '1.5rem',
		},
		svg: {
			padding: 0,
		},
	},
	medium: {
		flex: '0 0 auto',
		height: '1rem',
		minHeight: '1rem',
		maxHeight: '1rem',
		width: '1rem',
		minWidth: '1rem',
		maxWidth: '1rem',
		'span, svg, img': {
			height: '1rem',
			minHeight: '1rem',
			maxHeight: '1rem',
			width: '1rem',
			minWidth: '1rem',
			maxWidth: '1rem',
		},
		svg: {
			padding: 0,
		},
	},
	small: {
		flex: '0 0 auto',
		height: '.75rem',
		minHeight: '.75rem',
		maxHeight: '.75rem',
		width: '.75rem',
		minWidth: '.75rem',
		maxWidth: '.75rem',
		'span, svg, img': {
			height: '.75rem',
			minHeight: '.75rem',
			maxHeight: '.75rem',
			width: '.75rem',
			minWidth: '.75rem',
			maxWidth: '.75rem',
		},
		svg: {
			padding: 0,
		},
	},
});

const customRenderStyleMapOld = cssMap({
	xlarge: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 2rem)',
		},
		lineHeight: '2rem',
		fontSize: '2rem',
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
	large: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 1.5rem)',
		},
		lineHeight: '1.5rem',
		fontSize: '1.5rem',
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
	medium: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * 1rem)',
		},
		lineHeight: '1rem',
		fontSize: '1rem',
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
	small: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: 'calc(1 * .75rem)',
		},
		lineHeight: '.75rem',
		fontSize: '.75rem',
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
});

const customRenderStyleMapNew = cssMap({
	xlarge: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.300')})`,
		},
		font: token('font.heading.large'),
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
	large: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.300')})`,
		},
		font: token('font.heading.large'),
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
	medium: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.200')})`,
		},
		font: token('font.heading.small'),
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
	},
	small: {
		display: '-webkit-box',
		overflow: 'hidden',
		wordBreak: 'break-word',
		WebkitLineClamp: 1,
		'@supports not (-webkit-line-clamp: 1)': {
			maxHeight: `calc(1 * ${token('space.200')})`,
		},
		font: token('font.heading.small'),
		textAlign: 'center',
		textOverflow: 'clip',
		WebkitBoxOrient: 'unset',
		span: {
			margin: 0,
			padding: 0,
			verticalAlign: 'baseline',
		},
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
				aria-hidden="true"
				label="" // Since we already set aria-hidden="true", the label should be given an empty string
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
const Icon = ({
	icon,
	overrideIcon,
	label = 'Link',
	name,
	position = SmartLinkPosition.Top,
	className,
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

	return (
		<div
			css={[
				fg('platform-linking-visual-refresh-v1') && styles.container,
				!fg('platform-smart-card-icon-migration') && iconStylesMapOld[size],
				!fg('platform-smart-card-icon-migration') && positionStyleMap[position],
				render && !fg('platform-smart-card-icon-migration') && customRenderStyleMapOld[size],
				render && fg('platform-smart-card-icon-migration') && customRenderStyleMapNew[size],
			]}
			{...(fg('platform-linking-visual-refresh-v1') ? {} : { ['data-fit-to-content']: true })}
			data-smart-element={name}
			data-smart-element-icon
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{fg('platform-smart-card-icon-migration') ? (
				<Box
					xcss={styles.iconWrapperStyle}
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

export default Icon;
