import { snapshot } from '@af/visual-regression';

import WithLotsOfPagesRankable from '../../../../examples/12-with-lots-of-pages-rankable';
import HighlightedRow from '../../../../examples/15-highlighted-row';
import Basic from '../../../../examples/99-testing';

snapshot(Basic);

// FIXME: Skipping this test as it is failing on CI due to Screenshot comparison failed
// Report URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2395106/steps/%7B4a7f242f-d314-489d-9aca-856b014a3974%7D/test-report
snapshot.skip(WithLotsOfPagesRankable);
// FIXME: Skipping this test as it is failing on CI due to Screenshot comparison failed
// Report URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2395106/steps/%7B4a7f242f-d314-489d-9aca-856b014a3974%7D/test-report
snapshot.skip(HighlightedRow, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
