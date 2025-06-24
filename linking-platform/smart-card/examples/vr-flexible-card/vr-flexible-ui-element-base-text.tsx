/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { BaseTextElement } from '../../src/view/FlexibleCard/components/elements/common';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	modifiedOn: '2022-01-22T16:44:00.000+1000',
	createdOn: '2020-02-04T12:40:12.353+0800',
	createdBy: 'Doctor Stephen Vincent Strange',
	ownedBy: 'Bruce Banner',
	modifiedBy: 'Tony Stark',
	readTime: '5',
	assignedTo: 'Joe Smith',
	sentOn: '2020-02-04T12:40:12.353+0800',
	snippet:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id feugiat elit, ut gravida felis. Phasellus arcu velit, tincidunt id rhoncus sit amet, vehicula vel ligula. Nullam nec vestibulum velit, eu tempus elit. Nunc sodales ultricies metus eget facilisis. Phasellus a arcu tortor. In porttitor metus ac ex ornare, quis efficitur est laoreet. Fusce elit elit, finibus vulputate accumsan ut, porttitor eu libero. Mauris eget hendrerit risus, vitae mollis dui. Sed pretium nisi tellus, quis bibendum est vestibulum ac.',
	sourceBranch: 'lp-flexible-smart-links',
	targetBranch: 'master',
});

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: context }}>
				<BaseTextElement content="hello world" hideFormat />
				<BaseTextElement content="hello world" hideFormat fontSize="font.body.large" />
				<BaseTextElement content="hello world" hideFormat fontSize="font.body.small" />
				<BaseTextElement content="hello world" hideFormat fontSize="font.body.UNSAFE_small" />
				<BaseTextElement content="hello world" hideFormat fontSize="font.body" />
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
