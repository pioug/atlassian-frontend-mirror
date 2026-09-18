import React from 'react';

import ProjectIcon from '@atlaskit/icon/core/project';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

export const ProjectsIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<ProjectIcon color={token('color.icon')} spacing="spacious" {...props} />
);
