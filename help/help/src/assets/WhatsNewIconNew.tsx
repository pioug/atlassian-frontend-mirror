import React from 'react';

import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import { token } from '@atlaskit/tokens';

import { IconWrapper } from './IconWrapper';

export default function WhatsNewIconNew(): React.JSX.Element {
	return <IconWrapper Icon={MegaphoneIcon} appearance={token('color.icon')} />;
}
