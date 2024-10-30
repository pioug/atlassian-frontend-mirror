import React, { type ComponentProps } from 'react';

import {SpotlightCard } from '@atlaskit/onboarding';
import { type Placement, Popper } from '@atlaskit/popper';

type PropsFromSpotlightCard = ComponentProps<typeof SpotlightCard>;
export type ButtonSpotlightCardProps = PropsFromSpotlightCard & {
	referenceElement: HTMLElement;
	placement?: Placement;
};

/*
 * ButtonSpotlightCard is an editor custom spotlight that renders next to a floating toolbar button.
 * It is built on top of the SpotlightCard component from @atlaskit/onboarding.
 * It avoids the issue of the native atlaskit Spotlight component rendering outside the editor bounds and takes focus away from the editor.
*/
export const ButtonSpotlightCard = (props: ButtonSpotlightCardProps) => {
	const {
		referenceElement,
		placement = 'top-start',
		...spotlightCardProps
	} = props;


	return <Popper referenceElement={referenceElement} placement={placement} strategy="absolute">
			{({ ref, style }) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				<div ref={ref} style={style}>
					<SpotlightCard {...spotlightCardProps} />
				</div>
			)}
		</Popper>;
};
