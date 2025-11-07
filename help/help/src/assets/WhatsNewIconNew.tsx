import React from 'react';

import LegacyMegaphoneIcon from '@atlaskit/legacy-custom-icons/megaphone-icon';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import { IconWrapper } from './IconWrapper';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconNew(): React.JSX.Element {
	return (
		<IconWrapper
			Icon={MegaphoneIcon}
			LegacyIcon={LegacyMegaphoneIcon}
			appearance={token('color.icon', N400)}
		/>
	);
}
