import React from 'react';

import BugIcon from '@atlaskit/icon/core/bug';
import { token } from '@atlaskit/tokens';

import { IconWrapper } from './IconWrapper';

export default function WhatsNewIconFix(): React.JSX.Element {
	return <IconWrapper Icon={BugIcon} appearance={token('color.icon.information')} />;
}
