import React from 'react';

import { styled } from '@compiled/react';

import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Commit16Icon from '@atlaskit/icon-object/glyph/commit/16';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import { fg } from '@atlaskit/platform-feature-flags';

import EmptyStateIconOld from './icon-type-old';
import { type IssueType } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'left',
});

const EmptyStateIcon = ({ type }: { type: IssueType }) => {
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

const EmptyStateIconExported = (props: { type: IssueType }) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <EmptyStateIcon {...props} />;
	} else {
		return <EmptyStateIconOld {...props} />;
	}
};

export default EmptyStateIconExported;
