import React from 'react';

import { type IconProps } from '@atlaskit/icon';
import PersonRemoveIcon from '@atlaskit/icon/core/person-remove';
import LegacyUnfollowIcon from '@atlaskit/legacy-custom-icons/unfollow-icon';

const UnfollowIcon = (props: IconProps) => (
	<PersonRemoveIcon LEGACY_fallbackIcon={LegacyUnfollowIcon} {...props} />
);

export default UnfollowIcon;
