import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Commit16Icon from '@atlaskit/icon-object/glyph/commit/16';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';

import { type IssueType } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'left',
});

export default ({ type }: { type: IssueType }) => {
	const TypeIcon = () => {
		switch (type) {
			case 'issue':
				return <Issue16Icon label={'issue'} />;
			case 'commit':
				return <Commit16Icon label={'commit'} />;
			case 'story':
				return <Story16Icon label={'story'} />;
			case 'epic':
				return <Epic16Icon label={'epic'} />;
			case 'bug':
				return <Bug16Icon label={'bug'} />;
			case 'task':
				return <Task16Icon label={'task'} />;
		}
	};

	return (
		<IconWrapper>
			<TypeIcon />
		</IconWrapper>
	);
};
