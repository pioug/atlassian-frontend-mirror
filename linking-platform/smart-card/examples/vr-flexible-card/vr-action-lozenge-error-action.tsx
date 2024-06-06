import React from 'react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import LozengeActionError from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-error';
import VRTestWrapper from '../utils/vr-test-wrapper';

const TEXT_ERROR_MESSAGE = 'Custom error message for VR test';

export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<LozengeActionError errorMessage={TEXT_ERROR_MESSAGE} />
		</SmartCardProvider>
	</VRTestWrapper>
);
