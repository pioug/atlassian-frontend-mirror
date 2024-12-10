import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { Box, Inline, xcss } from '@atlaskit/primitives';

const targetGroupStyles = xcss({
	justifyContent: 'space-between',
	padding: 'space.400',
	listStyleType: 'none',
});

const targetStyles = {
	root: xcss({
		padding: 'space.200',
		borderRadius: '12px',
		backgroundColor: 'color.background.neutral',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: 'color.border',
	}),
	green: xcss({
		backgroundColor: 'color.background.accent.green.subtle',
		borderColor: 'color.border.accent.green',
	}),
	yellow: xcss({
		backgroundColor: 'color.background.accent.yellow.subtle',
		borderColor: 'color.border.accent.yellow',
	}),
	red: xcss({
		backgroundColor: 'color.background.accent.red.subtle',
		borderColor: 'color.border.accent.red',
	}),
};

export default function SpotlightBasicChildrenFunctionExample({
	defaultIsActive = false,
}: {
	defaultIsActive?: boolean;
}) {
	const [isActive, setIsActive] = useState(defaultIsActive);

	const showSpotlight = useCallback(() => {
		setIsActive(true);
	}, []);

	const hideSpotlight = useCallback(() => {
		setIsActive(false);
	}, []);

	return (
		<SpotlightManager>
			<Inline xcss={targetGroupStyles} as="ul">
				<SpotlightTarget name="green">
					{({ targetRef }) => (
						<li>
							<Box ref={targetRef} xcss={[targetStyles.root, targetStyles.green]}>
								Element inside a <code>{'<li>'}</code>
							</Box>
						</li>
					)}
				</SpotlightTarget>
			</Inline>

			<button type="button" onClick={showSpotlight}>
				Show spotlight
			</button>

			<SpotlightTransition>
				{isActive && (
					<Spotlight
						actions={[
							{
								onClick: hideSpotlight,
								text: 'Ok',
							},
						]}
						dialogPlacement="bottom left"
						heading="Green"
						target="green"
						targetRadius={12}
					>
						<Lorem count={1} />
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
}

export function SpotlightBasicChildrenFunctionDefaultOpenExample() {
	return <SpotlightBasicChildrenFunctionExample defaultIsActive />;
}
