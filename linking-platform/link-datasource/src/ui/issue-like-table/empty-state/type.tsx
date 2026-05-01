import React from 'react';

import { styled } from '@compiled/react';

import BugObject from '@atlaskit/object/bug';
import CommitObject from '@atlaskit/object/commit';
import EpicObject from '@atlaskit/object/epic';
import StoryObject from '@atlaskit/object/story';
import TaskObject from '@atlaskit/object/task';
import WorkItemObject from '@atlaskit/object/work-item';

import { type IssueType } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'left',
});

const EmptyStateIcon = ({ type }: { type: IssueType }): React.JSX.Element => {
	const TypeIcon = () => {
		switch (type) {
			case 'issue':
				return <WorkItemObject label={'issue'} />;
			case 'commit':
				return <CommitObject label={'commit'} />;
			case 'story':
				return <StoryObject label={'story'} />;
			case 'epic':
				return <EpicObject label={'epic'} />;
			case 'bug':
				return <BugObject label={'bug'} />;
			case 'task':
				return <TaskObject label={'task'} />;
		}
	};

	return (
		<IconWrapper>
			<TypeIcon />
		</IconWrapper>
	);
};

export default EmptyStateIcon;
