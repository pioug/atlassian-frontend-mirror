/**
 * TODO - I believe this file is not used (I could not find any reference to it in the codebase)
 * If not used we should remove it
 * Delete when cleaning bandicoots-update-sllv-icons
 */
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
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19548
				return <Issue16Icon label={'issue'} />;
			case 'commit':
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19548
				return <Commit16Icon label={'commit'} />;
			case 'story':
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19548
				return <Story16Icon label={'story'} />;
			case 'epic':
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19548
				return <Epic16Icon label={'epic'} />;
			case 'bug':
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19548
				return <Bug16Icon label={'bug'} />;
			case 'task':
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19548
				return <Task16Icon label={'task'} />;
		}
	};

	return (
		<IconWrapper>
			<TypeIcon />
		</IconWrapper>
	);
};
