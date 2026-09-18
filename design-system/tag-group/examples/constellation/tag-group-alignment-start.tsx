import React from 'react';

import TagGroup from '@atlaskit/tag-group/tag-group';
import Tag from '@atlaskit/tag/removable-tag';

export default (): React.JSX.Element => (
	<TagGroup label="Atlassian apps" alignment="start">
		<Tag text="Bitbucket" />
		<Tag text="Compass" />
		<Tag text="Confluence" />
		<Tag text="Jira" />
		<Tag text="Jira Service Management" />
		<Tag text="Jira Software" />
		<Tag text="Jira Work Management" />
		<Tag text="Opsgenie" />
		<Tag text="Statuspage" />
		<Tag text="Trello" />
	</TagGroup>
);
