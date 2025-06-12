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

import { type IconType, SmartLinkPosition, SmartLinkSize } from '../../../../../../constants';
import { type FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import { isProfileType } from '../../../../../../utils';
import AtlaskitIcon from '../../../common/atlaskit-icon';
import ImageIcon from '../../../common/image-icon';
import { type ImageIconProps } from '../../../common/image-icon/types';
import { getIconWidth } from '../../../utils';
import type { ElementProps } from '../../index';

export type BaseIconElementProps = ElementProps & {
	/**
	 * If provided, Icon element will use this render function instead.
	 */
	render?: () => React.ReactNode;
	/**
	 * The Atlaskit Icon to display. If no icon is provided, then the URL provided
	 * will be used.
	 */
	icon?: IconType;
	/**
	 * If provided, overrideIcon will be rendered in the place of the provided icon or one that is
	 * supplied by the URL.
	 */
	overrideIcon?: React.ReactNode;
	/**
	 * The label provided to the Atlaskit Icon.
	 */
	label?: string;
	/**
	 * Determines the position of the link icon in relative to the vertical
	 * height.  It can either be centred or placed on “top”. Default is top.
	 */
	position?: SmartLinkPosition;
	/**
	 * The icon from this url will be used if no render function or Atlaskit Icon is provided.
	 */
	url?: string;
	/**
	 * Whether to display the icon as a square or round image.
	 */
	appearance?: 'square' | 'round';
	/**
	 * For images, whether to hide the loading skeleton while the image is loading.
	 */
	hideLoadingSkeleton?: boolean;
};

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

const customRenderStyleMap = cssMap({
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
			height: '100%',
			width: '100%',
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
			height: '100%',
			width: '100%',
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
			height: '100%',
			width: '100%',
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
			height: '100%',
			width: '100%',
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
				size={size}
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
	appearance?: ImageIconProps['appearance'],
	hideLoadingSkeleton?: boolean,
): React.ReactNode | undefined => {
	const width = size === SmartLinkSize.Large ? token('space.300') : token('space.200');

	if (url) {
		return (
			<ImageIcon
				defaultIcon={defaultIcon}
				testId={testId}
				url={url}
				width={width}
				height={width}
				{...(fg('platform-linking-visual-refresh-v2') && {
					appearance,
				})}
				hideLoadingSkeleton={hideLoadingSkeleton}
			/>
		);
	}
};

/**
 * A base element that displays an Icon or favicon.
 * @internal
 * @param props - The props necessary for the Icon element.
 * @see LinkIcon
 */
const IconElement = ({
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
	appearance = 'square',
	hideLoadingSkeleton,
}: BaseIconElementProps) => {
	const element = useMemo(() => {
		const defaultIcon = renderDefaultIcon(label, testId);
		return (
			overrideIcon ||
			render?.() ||
			renderImageIcon(
				defaultIcon,
				url,
				testId,
				size,
				fg('platform-linking-visual-refresh-v2') ? appearance : undefined,
				hideLoadingSkeleton,
			) ||
			renderAtlaskitIcon(icon, testId, size) ||
			defaultIcon
		);
	}, [label, testId, overrideIcon, render, url, size, appearance, hideLoadingSkeleton, icon]);

	const width = getIconWidth(size);

	return (
		<div
			css={[styles.container, positionStyleMap[position], render && customRenderStyleMap[size]]}
			{...(fg('platform-linking-visual-refresh-v1') ? {} : { ['data-fit-to-content']: true })}
			data-smart-element={name}
			data-smart-element-icon
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			<Box
				xcss={styles.iconWrapperStyle}
				style={{
					width,
					height: width,
				}}
			>
				{element}
			</Box>
		</div>
	);
};

export default IconElement;

export const toLinkIconProps = (
	data: FlexibleUiDataContext[keyof FlexibleUiDataContext] | undefined,
	type: FlexibleUiDataContext['type'],
) => {
	const isDataLinkIcon = (_data: typeof data): _data is FlexibleUiDataContext['linkIcon'] => {
		return typeof _data === 'object' && _data !== null && ('icon' in _data || 'url' in _data);
	};

	if (!isDataLinkIcon(data)) {
		return typeof data === 'object' ? data : undefined;
	}

	const isImageRound = isProfileType(type);

	return { ...data, appearance: isImageRound ? 'round' : 'square' };
};
