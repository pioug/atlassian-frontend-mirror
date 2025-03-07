import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import LozengeActionItem from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-item';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<div role="menu">
				<LozengeActionItem
					id="test-smart-element-lozenge-dropdown"
					text="To Do"
					appearance="default"
				/>
			</div>
		</SmartCardProvider>
	</VRTestWrapper>
);
