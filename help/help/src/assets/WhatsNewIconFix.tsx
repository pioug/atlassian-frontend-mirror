import React from 'react';

import BugIcon from '@atlaskit/icon/core/bug';
import { IconWrapper } from './IconWrapper';
import { B500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconFix(): React.JSX.Element {
	return <IconWrapper Icon={BugIcon} appearance={token('color.icon.information', B500)} />;
}
