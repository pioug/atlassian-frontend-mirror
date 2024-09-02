import { snapshot } from '@af/visual-regression';
import { MediaGroupInBlockquote, MediaSingleInBlockquote } from './media-in-blockquote.fixture';

// Skipped due to failing builds https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/3928533/steps/%7Bdf58eb07-7572-4332-909a-48e8b4c44bfc%7D/test-report
snapshot.skip(MediaSingleInBlockquote, {
	description: 'should render media single inside blockquote',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(MediaGroupInBlockquote, {
	description: 'should render media group inside blockquote',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
