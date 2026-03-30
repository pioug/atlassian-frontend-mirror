import React from 'react';

import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import { IconWrapper } from './IconWrapper';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconImprovement(): React.JSX.Element {
	return <IconWrapper Icon={MegaphoneIcon} appearance={token('color.icon.warning')} />;
}
