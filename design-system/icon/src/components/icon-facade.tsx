import React, { memo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { IconFacadeProps, NewIconProps } from '../types';

import LegacyIcon from './icon';

const sizesEligibleForNewIcons: IconFacadeProps['size'][] = ['small', 'medium'];

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
	...props
}: IconFacadeProps) {
	const NewIcon = props.newIcon;

	// By default, the icon size will be medium and spacing will be none for small icons
	const size: IconFacadeProps['size'] = props.size ?? 'medium';
	const spacing: NewIconProps['spacing'] = size === 'small' ? 'none' : 'spacious';

	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	const useNewIcon =
		fg('platform-visual-refresh-icons-legacy-facade') && sizesEligibleForNewIcons.includes(size);

	if (useNewIcon && NewIcon) {
		return (
			<NewIcon
				{...props}
				spacing={spacing}
				color={(props.primaryColor as any) || 'currentColor'}
				type={props.iconType}
			/>
		);
	}

	return <LegacyIcon dangerouslySetGlyph={dangerouslySetGlyph} {...props} />;
});

export default IconFacade;
