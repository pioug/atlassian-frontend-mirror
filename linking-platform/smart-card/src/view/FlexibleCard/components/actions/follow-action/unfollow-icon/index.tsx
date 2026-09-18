import React from 'react';

import PersonRemoveIcon from '@atlaskit/icon/core/person-remove';
import type { NewCoreIconProps } from '@atlaskit/icon/types';

const UnfollowIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<PersonRemoveIcon {...props} />
);

export default UnfollowIcon;
