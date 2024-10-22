import React from 'react';

import LegacyMegaphoneWithStarIcon from '@atlaskit/legacy-custom-icons/megaphone-star-icon';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import { IconWrapper } from './IconWrapper';
import { Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export default function WhatsNewIconImprovement() {
	return (
		<IconWrapper
			Icon={MegaphoneIcon}
			LegacyIcon={LegacyMegaphoneWithStarIcon}
			appearance={token('color.icon.warning', Y200)}
		/>
	);
}
