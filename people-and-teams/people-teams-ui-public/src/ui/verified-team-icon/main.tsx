import React from 'react';

import { type Size } from '@atlaskit/icon';
import { VerifiedIcon } from '@atlaskit/legacy-custom-icons';
import { token } from '@atlaskit/tokens';

export const VerifiedTeamIcon = ({
	size,
	label = 'Verified Team',
}: {
	size?: Size;
	label?: string;
}) => <VerifiedIcon primaryColor={token('color.icon.accent.blue')} size={size} label={label} />;
