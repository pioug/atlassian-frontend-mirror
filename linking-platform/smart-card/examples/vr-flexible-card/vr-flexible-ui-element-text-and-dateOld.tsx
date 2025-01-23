/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import {
	AssignedTo,
	CreatedBy,
	CreatedOn,
	ModifiedBy,
	ModifiedOn,
	OwnedBy,
	ReadTime,
	SentOn,
	Snippet,
	SourceBranch,
	TargetBranch,
} from '../../src/view/FlexibleCard/components/elements';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const overrideCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: exampleTokens.overrideColor,
	fontStyle: 'italic',
});

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

export default () => (
	<VRTestWrapper>
		<FlexibleUiContext.Provider value={context}>
			<CreatedBy testId="vr-test-text" />
			<OwnedBy />
			<ModifiedBy />
			<CreatedOn />
			<ModifiedOn />
			<SentOn />
			<AssignedTo />
			<Snippet />
			<SourceBranch />
			<TargetBranch />
			<ReadTime />
			<h5>Override CSS</h5>
			<CreatedBy overrideCss={overrideCss} />
			<OwnedBy overrideCss={overrideCss} />
			<CreatedOn overrideCss={overrideCss} />
			<h5>Override 'Created On/Modified On' text</h5>
			<CreatedOn text="First commit on" />
			<ModifiedOn text="Last commit on" />
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);
