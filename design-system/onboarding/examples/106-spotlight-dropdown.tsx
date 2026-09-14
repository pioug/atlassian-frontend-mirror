import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import ButtonItem from '@atlaskit/menu/button-item';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';

const PopupWithSpotlight = (): React.JSX.Element => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const handleSpotlightOpen = () => setIsSpotlightActive(true);
	const handleSpotlightClose = () => setIsSpotlightActive(false);
	return (
		<DropdownMenu
			shouldRenderToParent
			trigger={({ triggerRef, ...props }) => (
				<Button {...props} ref={triggerRef}>
					Open menu
				</Button>
			)}
		>
			<SpotlightManager>
				<SpotlightTarget name="codesandbox">
					<ButtonItem onClick={handleSpotlightOpen}>Show spotlight</ButtonItem>
				</SpotlightTarget>
				<SpotlightTransition>
					{isSpotlightActive && (
						<Spotlight
							actions={[
								{
									onClick: handleSpotlightClose,
									text: 'OK',
								},
							]}
							heading="Open CodeSandbox"
							target="codesandbox"
							key="codesandbox"
							targetRadius={3}
						>
							A sandboxed environment where you can play around with examples is now only one click
							away.
						</Spotlight>
					)}
				</SpotlightTransition>
			</SpotlightManager>
			<ButtonItem>Something else</ButtonItem>
		</DropdownMenu>
	);
};

export default PopupWithSpotlight;
