import React, { useCallback } from 'react';
import { SmartCardProvider } from '@atlaskit/link-provider';
import VRTestWrapper from '../utils/vr-test-wrapper';
import LozengeActionTrigger from '../../src/view/FlexibleCard/components/elements/lozenge/lozenge-action/lozenge-action-trigger';
import DropdownMenu, { type CustomTriggerProps } from '@atlaskit/dropdown-menu';

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
