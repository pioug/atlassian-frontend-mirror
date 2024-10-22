import React from 'react';

import LegacyDeleteIcon from '@atlaskit/legacy-custom-icons/delete-icon';
import DeleteIcon from '@atlaskit/icon/core/delete';
import { IconWrapper } from './IconWrapper';
import { N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconRemoved() {
	return (
		<IconWrapper
			Icon={DeleteIcon}
			LegacyIcon={LegacyDeleteIcon}
			appearance={token('color.icon.disabled', N700)}
		/>
	);
}
