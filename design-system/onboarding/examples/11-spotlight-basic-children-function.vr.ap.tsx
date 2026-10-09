import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import { cssMap, cx } from '@atlaskit/css';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import Spotlight from '@atlaskit/onboarding/spotlight';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightManager from '@atlaskit/onboarding/spotlight-manager';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightTarget from '@atlaskit/onboarding/spotlight-target';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightTransition from '@atlaskit/onboarding/spotlight-transition';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { token } from '@atlaskit/tokens';

const targetGroupStyles = cssMap({
	root: {
		justifyContent: 'space-between',
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
		listStyleType: 'none',
	},
});

const targetStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
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
}): React.JSX.Element {
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

export function SpotlightBasicChildrenFunctionDefaultOpenExample(): React.JSX.Element {
	return <SpotlightBasicChildrenFunctionExample defaultIsActive />;
}
