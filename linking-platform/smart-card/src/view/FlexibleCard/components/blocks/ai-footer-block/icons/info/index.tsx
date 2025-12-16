import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';

export const InfoIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<StatusInformationIcon color={props.color || 'currentColor'} {...props} />
);
