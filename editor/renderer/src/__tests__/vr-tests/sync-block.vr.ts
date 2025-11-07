import { snapshot } from '@af/visual-regression';
import {
	SyncBlockGenericError,
	SyncBlockLoadingState,
	SyncBlockNotFound,
	SyncBlockWithParagraphAndPanelRenderer,
	SyncBlockWithPermissionDenied,
} from './sync-block.fixture';

const mockRequest = [
	{
		urlPattern: '/gateway/api/graphql',
		body: JSON.stringify({
			data: {
				content: {
					nodes: [
						{
							id: '123456789',
							links: {
								base: 'https://example.atlassian.net/wiki',
							},
							space: {
								key: '~712020d8b13e02dd3c421fbcefd6c171aa5cff',
							},
							subType: null,
							title: 'Test Blog',
						},
					],
				},
			},
		}),
	},
];

snapshot(SyncBlockWithParagraphAndPanelRenderer, {
	description: 'should render sync block with paragraph and panel',
	mockRequests: mockRequest,
});

snapshot(SyncBlockWithPermissionDenied, {
	description: 'should render sync block with permission denied error',
	mockRequests: mockRequest,
});

snapshot(SyncBlockNotFound, {
	description: 'should render sync block not found error',
	mockRequests: mockRequest,
});

snapshot(SyncBlockGenericError, {
	description: 'should render sync block generic error',
	mockRequests: mockRequest,
});

snapshot(SyncBlockLoadingState, {
	description: 'should render sync block loading state',
	mockRequests: mockRequest,
});
