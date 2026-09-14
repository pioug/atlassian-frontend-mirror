import React from 'react';

import { RendererStyleContainer } from '../../ui/Renderer/RendererStyleContainer';
import { ProfilecardInternal as ProfileCard } from '@atlaskit/profilecard/profilecard-internal';

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
