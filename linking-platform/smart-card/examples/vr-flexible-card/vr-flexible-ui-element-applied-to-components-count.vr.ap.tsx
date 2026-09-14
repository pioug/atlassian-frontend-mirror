import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

import { SmartLinkSize } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { default as AppliedToComponentsCount } from '../../src/view/FlexibleCard/components/elements/applied-to-components-count-element';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	appliedToComponentsCount: 30,
});

export default (): React.JSX.Element => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<FlexibleCardContext.Provider value={{ data: context }}>
					{Object.values(SmartLinkSize).map((_, idx) => (
						<React.Fragment key={idx}>
							<HorizontalWrapper>
								<AppliedToComponentsCount />
							</HorizontalWrapper>
						</React.Fragment>
					))}
				</FlexibleCardContext.Provider>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
