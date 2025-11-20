import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import GoalGlyph from '@atlaskit/icon/core/goal';
import LegacyGoalIcon from '@atlaskit/legacy-custom-icons/goal-bold-icon';
import { token } from '@atlaskit/tokens';

export const GoalIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<GoalGlyph
		color={token('color.icon', '#44546F')}
		LEGACY_fallbackIcon={LegacyGoalIcon}
		spacing="spacious"
		{...props}
	/>
);
