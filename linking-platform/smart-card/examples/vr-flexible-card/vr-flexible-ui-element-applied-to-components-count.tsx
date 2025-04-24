import React from 'react';

import { SmartLinkSize } from '../../src/constants';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { AppliedToComponentsCount } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	appliedToComponentsCount: 30,
});

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleUiContext.Provider value={context}>
				{Object.values(SmartLinkSize).map((_, idx) => (
					<React.Fragment key={idx}>
						<HorizontalWrapper>
							<AppliedToComponentsCount />
						</HorizontalWrapper>
					</React.Fragment>
				))}
			</FlexibleUiContext.Provider>
		</VRTestWrapper>
	);
};
