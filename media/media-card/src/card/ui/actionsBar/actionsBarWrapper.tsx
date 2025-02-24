import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { ActionsBarWrapper as CompiledActionsBarWrapper } from './actionsBarWrapper-compiled';
import { ActionsBarWrapper as EmotionActionsBarWrapper } from './actionsBarWrapper-emotion';

import { type ActionBarWrapperProps } from './types';

export const ActionsBarWrapper = (props: ActionBarWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledActionsBarWrapper {...props} />
	) : (
		<EmotionActionsBarWrapper {...props} />
	);
