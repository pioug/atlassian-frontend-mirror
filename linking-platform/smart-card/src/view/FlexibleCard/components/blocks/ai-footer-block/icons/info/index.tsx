import React from 'react';

import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import type { NewCoreIconProps } from '@atlaskit/icon/types';

export const InfoIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<StatusInformationIcon color={props.color || 'currentColor'} {...props} />
);
