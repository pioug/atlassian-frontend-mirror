import React from 'react';

import DeleteIcon from '@atlaskit/icon/core/delete';
import { token } from '@atlaskit/tokens';

import { IconWrapper } from './IconWrapper';

export default function WhatsNewIconRemoved(): React.JSX.Element {
	return <IconWrapper Icon={DeleteIcon} appearance={token('color.icon.disabled')} />;
}
