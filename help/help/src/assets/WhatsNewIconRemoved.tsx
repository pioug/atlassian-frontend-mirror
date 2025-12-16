import React from 'react';

import DeleteIcon from '@atlaskit/icon/core/delete';
import { IconWrapper } from './IconWrapper';
import { N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconRemoved(): React.JSX.Element {
	return <IconWrapper Icon={DeleteIcon} appearance={token('color.icon.disabled', N700)} />;
}
