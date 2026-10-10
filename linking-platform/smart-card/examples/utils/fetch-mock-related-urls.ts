import fetchMock from 'fetch-mock/cjs/client';

import { AsanaTask } from '@atlaskit/link-test-helpers/smart-card/mocks/asana';
import { AtlasProject } from '@atlaskit/link-test-helpers/smart-card/mocks/atlas';
import { JiraIssue } from '@atlaskit/link-test-helpers/smart-card/mocks/jira';

fetchMock.mock({
	matcher: (url: string) => new URL(url).pathname.endsWith('object-resolver/related-urls'),
	method: 'GET',
	response: new Promise((resolve) => {
		setTimeout(() => {
			resolve([AsanaTask, AtlasProject, JiraIssue]);
		}, 5000);
	}),
});
