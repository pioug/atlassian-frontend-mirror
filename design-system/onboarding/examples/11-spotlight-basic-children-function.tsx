import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import { cssMap, cx } from '@atlaskit/css';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const targetGroupStyles = cssMap({
	root: {
		justifyContent: 'space-between',
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
		listStyleType: 'none',
	},
});

const targetStyles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		borderRadius: token('radius.xlarge'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	green: {
		borderColor: token('color.border.accent.green'),
	},
});

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
			<Inline xcss={targetGroupStyles.root} as="ul">
				<SpotlightTarget name="green">
					{({ targetRef }) => (
						<li>
							<Box
								ref={targetRef}
								xcss={cx(targetStyles.root, targetStyles.green)}
								backgroundColor="color.background.accent.green.subtle"
							>
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
