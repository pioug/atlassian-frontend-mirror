import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import PersonRemoveIcon from '@atlaskit/icon/core/person-remove';

const UnfollowIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<PersonRemoveIcon {...props} />
);

export default UnfollowIcon;
