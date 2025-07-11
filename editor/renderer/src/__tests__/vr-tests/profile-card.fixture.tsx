import React from 'react';

import { RendererStyleContainer } from '../../ui/Renderer/RendererStyleContainer';
import { ProfileCard } from '@atlaskit/profilecard';

export const ProfileCardInRenderer = () => {
	return (
		<RendererStyleContainer
			appearance="full-page"
			allowNestedHeaderLinks={false}
			useBlockRenderForCodeBlock={false}
		>
			<ProfileCard
				fullName="Rosalyn Franklin"
				meta="Manager"
				nickname="rfranklin"
				email="rfranklin@acme.com"
				timestring="18:45"
				location="Somewhere, World"
			/>
		</RendererStyleContainer>
	);
};
