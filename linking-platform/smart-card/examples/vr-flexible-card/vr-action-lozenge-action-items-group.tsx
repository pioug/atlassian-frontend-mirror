import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import LozengeActionItemsGroup from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element/lozenge-action/lozenge-action-items-group';
import { type LozengeItem } from '../../src/view/FlexibleCard/components/elements/common/base-lozenge-element/lozenge-action/types';
import VRTestWrapper from '../utils/vr-test-wrapper';

const items: LozengeItem[] = [
	{ id: '1', text: 'In Progress', appearance: 'inprogress' },
	{ id: '2', text: 'Done', appearance: 'success' },
	{ id: '3', text: 'To Do', appearance: 'default' },
	{ id: '4', text: 'Explore', appearance: 'default' },
	{ id: '5', text: 'In Review', appearance: 'inprogress' },
];

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<SmartCardProvider>
			<div role="menu">
				<LozengeActionItemsGroup items={items} />
			</div>
		</SmartCardProvider>
	</VRTestWrapper>
);
