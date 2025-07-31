/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { State } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { LozengeActionErrorExample, LozengeActionExample } from '../utils/vr-test';
import '../utils/fetch-mock-invoke';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	dueOn: '2020-02-04T12:40:12.353+0800',
	state: { text: 'State' },
});

export default () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<FlexibleCardContext.Provider value={{ data: context }}>
					<h5>Action</h5>
					<div>
						<State action={LozengeActionExample} text="To Do" testId="vr-test-lozenge-action" />
					</div>
					<h5>Errored</h5>
					<div>
						<State
							action={LozengeActionErrorExample}
							text="To Do"
							testId="vr-test-lozenge-action-error"
						/>
					</div>
				</FlexibleCardContext.Provider>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
