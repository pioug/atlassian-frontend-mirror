import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { ActionName } from '../../src/constants';
import LozengeActionError from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element/lozenge-action/lozenge-action-error';
import VRTestWrapper from '../utils/vr-test-wrapper';

const TEXT_ERROR_MESSAGE = 'Custom error message for VR test';

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<SmartCardProvider>
			<div role="menu">
				<LozengeActionError
					errorMessage={TEXT_ERROR_MESSAGE}
					invokePreviewAction={{
						actionFn: () => Promise.resolve(),
						actionType: ActionName.PreviewAction,
					}}
				/>
			</div>
		</SmartCardProvider>
	</VRTestWrapper>
);
