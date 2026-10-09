import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import CommentAddIcon from '@atlaskit/icon/core/comment-add';
import CrossIcon from '@atlaskit/icon/core/cross';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import Spotlight from '@atlaskit/onboarding/spotlight';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightManager from '@atlaskit/onboarding/spotlight-manager';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightTarget from '@atlaskit/onboarding/spotlight-target';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightTransition from '@atlaskit/onboarding/spotlight-transition';
import { token } from '@atlaskit/tokens';

const SpotlightHeadingAfterElement = (): React.JSX.Element => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	return (
		<SpotlightManager>
			<SpotlightTarget name="comment">
				<IconButton icon={CommentAddIcon} label="comment" />
			</SpotlightTarget>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200') }}>
				<Button appearance="primary" onClick={() => start()}>
					Show example spotlight
				</Button>
			</div>
			<SpotlightTransition>
				{isSpotlightActive && (
					<Spotlight
						headingAfterElement={
							<IconButton
								icon={CrossIcon}
								appearance="subtle"
								onClick={() => end()}
								label="Close"
							/>
						}
						actions={[
							{
								onClick: () => end(),
								text: 'OK',
							},
						]}
						heading="Add a comment"
						target="comment"
						key="comment"
						targetRadius={3}
						targetBgColor={'#FFFFFF'}
					>
						Quickly add a comment to the work item.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightHeadingAfterElement;
