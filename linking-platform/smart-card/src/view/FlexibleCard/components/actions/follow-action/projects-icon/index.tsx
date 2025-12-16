import React from 'react';

import { type NewCoreIconProps } from '@atlaskit/icon';
import ProjectIcon from '@atlaskit/icon/core/project';
import { token } from '@atlaskit/tokens';

export const ProjectsIcon = (props: NewCoreIconProps): React.JSX.Element => (
	<ProjectIcon color={token('color.icon', '#44546F')} spacing="spacious" {...props} />
);
