import React, { useCallback } from 'react';

import DropdownMenu, { type CustomTriggerProps } from '@atlaskit/dropdown-menu';
import { SmartCardProvider } from '@atlaskit/link-provider';

import LozengeActionTrigger from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-trigger';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default () => {
	const trigger = useCallback(
		(props: CustomTriggerProps<HTMLButtonElement>) => (
			<LozengeActionTrigger {...props} isOpen={true} text="To Do" />
		),
		[],
	);

	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<DropdownMenu trigger={trigger} isOpen={true} />
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
