import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import LozengeActionError from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element/lozenge-action/lozenge-action-error';
import VRTestWrapper from '../utils/vr-test-wrapper';

const TEXT_ERROR_MESSAGE = 'Custom error message for VR test';

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<SmartCardProvider>
			<div role="menu">
				<LozengeActionError errorMessage={TEXT_ERROR_MESSAGE} />
			</div>
		</SmartCardProvider>
	</VRTestWrapper>
);
