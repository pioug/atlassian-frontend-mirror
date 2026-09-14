import React, { useCallback } from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu/types';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

import LozengeActionTrigger from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element/lozenge-action/lozenge-action-trigger';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default (): React.JSX.Element => {
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
