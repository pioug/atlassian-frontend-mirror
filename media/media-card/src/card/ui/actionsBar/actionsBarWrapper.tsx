import React from 'react';
import { ActionsBarWrapper as CompiledActionsBarWrapper } from './actionsBarWrapper-compiled';

import { type ActionBarWrapperProps } from './types';

export const ActionsBarWrapper = (props: ActionBarWrapperProps) => (
	<CompiledActionsBarWrapper {...props} />
);
