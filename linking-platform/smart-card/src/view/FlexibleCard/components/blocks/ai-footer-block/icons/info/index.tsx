import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import LegacyInfoIcon from '@atlaskit/legacy-custom-icons/info-icon';

export const InfoIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<StatusInformationIcon
		color={props.color || 'currentColor'}
		LEGACY_fallbackIcon={LegacyInfoIcon}
		{...props}
	/>
);
