import React from 'react';

import { OwnedByElement } from '@atlaskit/smart-card';

import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({ ownedBy: 'Angie' });

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: context }}>
				<OwnedByElement textPrefix="owned_by" />
				<OwnedByElement textPrefix="owned_by_override" />
				<OwnedByElement textPrefix="owned_by_override" hideFormat />
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
