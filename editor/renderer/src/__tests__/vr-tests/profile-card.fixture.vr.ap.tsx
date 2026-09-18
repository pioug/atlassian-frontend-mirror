import React from 'react';

import { ProfilecardInternal as ProfileCard } from '@atlaskit/profilecard/profilecard-internal';

import { RendererStyleContainer } from '../../ui/Renderer/RendererStyleContainer';

export const ProfileCardInRenderer = (): React.JSX.Element => {
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
