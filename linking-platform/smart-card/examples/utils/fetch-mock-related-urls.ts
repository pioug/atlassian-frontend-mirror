import fetchMock from 'fetch-mock/cjs/client';

import { AsanaTask, AtlasProject, JiraIssue } from '@atlaskit/link-test-helpers';

fetchMock.mock({
	matcher: (url: string) => new URL(url).pathname.endsWith('object-resolver/related-urls'),
	method: 'GET',
	response: new Promise((resolve) => {
		setTimeout(() => {
			resolve([AsanaTask, AtlasProject, JiraIssue]);
		}, 5000);
	}),
});
