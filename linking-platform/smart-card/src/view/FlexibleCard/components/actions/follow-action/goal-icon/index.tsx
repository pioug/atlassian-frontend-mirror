import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import GoalGlyph from '@atlaskit/icon/core/goal';
import { token } from '@atlaskit/tokens';

export const GoalIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<GoalGlyph color={token('color.icon', '#44546F')} spacing="spacious" {...props} />
);
