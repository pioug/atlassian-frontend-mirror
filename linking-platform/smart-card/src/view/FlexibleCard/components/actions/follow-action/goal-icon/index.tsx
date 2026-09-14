import React from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon/types';
import GoalGlyph from '@atlaskit/icon/core/goal';
import { token } from '@atlaskit/tokens';

export const GoalIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<GoalGlyph color={token('color.icon')} spacing="spacious" {...props} />
);
