import React from 'react';

import { type UNSAFE_NewCoreIconProps } from '@atlaskit/icon';
import InformationIcon from '@atlaskit/icon/core/information';
import LegacyInfoIcon from '@atlaskit/legacy-custom-icons/info-icon';

export const InfoIcon = (props: UNSAFE_NewCoreIconProps) => (
	<InformationIcon
		color={props.color || 'currentColor'}
		LEGACY_fallbackIcon={LegacyInfoIcon}
		{...props}
	/>
);
