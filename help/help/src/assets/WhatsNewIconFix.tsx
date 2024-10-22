import React from 'react';

import LegacyBugIcon from '@atlaskit/legacy-custom-icons/bug-icon';
import BugIcon from '@atlaskit/icon/core/bug';
import { IconWrapper } from './IconWrapper';
import { B500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconFix() {
	return (
		<IconWrapper
			Icon={BugIcon}
			LegacyIcon={LegacyBugIcon}
			appearance={token('color.icon.information', B500)}
		/>
	);
}
