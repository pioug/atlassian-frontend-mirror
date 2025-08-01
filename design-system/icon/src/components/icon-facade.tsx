import React, { memo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type {
	IconFacadeProps,
	UNSAFE_NewCoreGlyphProps,
	UNSAFE_NewUtilityGlyphProps,
} from '../types';

import { Icon as LegacyIcon } from './icon';

const sizeSpacingMap = {
	utility: {
		small: 'compact',
		medium: 'spacious',
	},
	core: {
		small: 'none',
		medium: 'spacious',
	},
} as const;

/**
 * `IconFacade` is a component that conditionally renders either a new or legacy icon based on a feature flag.
 *
 * @param {IconFacadeProps} props - The props for the IconFacade component. Includes properties for configuring
 * the icon such as `size`, `spacing`, `primaryColor`, `iconType`, and potentially others depending on the icon.
 * `dangerouslySetGlyph` is a prop specific to the legacy icon component for setting the icon glyph directly.
 * @returns A React element representing either the new or legacy icon based on the feature flag and icon size.
 */
export const IconFacade = memo(function IconFacade({
	dangerouslySetGlyph,
	size,
	...props
}: IconFacadeProps) {
	const NewIcon = props.newIcon;

	// By default, the icon size will be medium for core icons and small for utility icons
	const iconSize: IconFacadeProps['size'] = size ?? 'medium';

	const useNewIcon =
		!props.isFacadeDisabled &&
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		fg('platform-visual-refresh-icons-legacy-facade');

	if (
		useNewIcon &&
		NewIcon &&
		(iconSize === 'small' || iconSize === 'medium') &&
		!fg('platform-visual-refresh-icons-facade-removal')
	) {
		if (props.iconType === 'utility') {
			const Icon = NewIcon as React.ComponentType<UNSAFE_NewUtilityGlyphProps>;
			return (
				<Icon
					{...props}
					spacing={
						fg('platform-visual-refresh-icons-facade-button-fix')
							? sizeSpacingMap['utility'][iconSize]
							: 'none'
					}
					color={(props.primaryColor as any) || 'currentColor'}
					type={props.iconType}
				/>
			);
		} else {
			const Icon = NewIcon as React.ComponentType<UNSAFE_NewCoreGlyphProps>;
			return (
				<Icon
					{...props}
					size={iconSize}
					spacing={sizeSpacingMap['core'][iconSize]}
					color={(props.primaryColor as any) || 'currentColor'}
					type={props.iconType}
				/>
			);
		}
	}

	return <LegacyIcon dangerouslySetGlyph={dangerouslySetGlyph} size={size} {...props} />;
});
