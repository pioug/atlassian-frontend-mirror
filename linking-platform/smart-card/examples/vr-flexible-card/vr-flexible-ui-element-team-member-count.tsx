import React from 'react';

import { SmartLinkSize } from '../../src/constants';
import { FlexibleCardContext, FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { TeamMemberCount } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	teamMemberCount: 15,
});

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: context }}>
				{/* Remove FlexibleUiContext on cleanup of platform-linking-flexible-card-context */}
				<FlexibleUiContext.Provider value={context}>
					{Object.values(SmartLinkSize).map((_, idx) => (
						<React.Fragment key={idx}>
							<HorizontalWrapper>
								<TeamMemberCount />
							</HorizontalWrapper>
						</React.Fragment>
					))}
				</FlexibleUiContext.Provider>
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
