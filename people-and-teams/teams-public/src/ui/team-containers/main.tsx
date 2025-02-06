import React from 'react';

import { Grid } from '@atlaskit/primitives';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { AddContainerCard } from './add-container-card';
import { LinkedContainerCard } from './linked-container-card';

export const ICON_BACKGROUND = token('color.icon.inverse', N0);
export const ICON_COLOR = token('color.icon.subtle', N90);

export const TeamContainers = () => {
	return (
		<Grid templateColumns="1fr 1fr" gap="space.100" autoFlow="row">
			<LinkedContainerCard
				containerType="jira"
				title="A Project"
				containerIcon="https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/712020:2981defd-17f1-440e-a377-8c7657b72a6f/4b5b0d55-614b-4e75-858f-9da3d0c7e3f8/128"
			/>
			<AddContainerCard containerType="jira" />
			<AddContainerCard containerType="confluence" />
			<AddContainerCard containerType="loom" />
		</Grid>
	);
};
