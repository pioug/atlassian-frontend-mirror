import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { ActionName } from '../../src/constants';
import LozengeActionError from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-error';
import VRTestWrapper from '../utils/vr-test-wrapper';

const TEXT_ERROR_MESSAGE = 'Custom error message for VR test';

export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<LozengeActionError
				errorMessage={TEXT_ERROR_MESSAGE}
				invokePreviewAction={{
					actionFn: () => Promise.resolve(),
					actionType: ActionName.PreviewAction,
				}}
			/>
		</SmartCardProvider>
	</VRTestWrapper>
);
