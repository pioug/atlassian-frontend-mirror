import React, { useCallback } from 'react';

import DropdownMenu, { type CustomTriggerProps } from '@atlaskit/dropdown-menu';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import LozengeActionTrigger from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element/lozenge-action/lozenge-action-trigger';
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
				<DropdownMenu
					trigger={trigger}
					isOpen={true}
					shouldRenderToParent={fg('should-render-to-parent-should-be-true-linking-pla')}
				/>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
