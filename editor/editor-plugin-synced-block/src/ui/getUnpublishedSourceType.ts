import type { SyncBlockProduct } from '@atlaskit/editor-synced-block-provider';

export type UnpublishedSourceType = 'blog' | 'jiraWorkItem' | 'page';

export const getUnpublishedSourceType = ({
	sourceAri,
	sourceProduct,
}: {
	sourceAri?: string;
	sourceProduct?: SyncBlockProduct;
}): UnpublishedSourceType => {
	if (sourceProduct === 'jira-work-item' || sourceAri?.startsWith('ari:cloud:jira:')) {
		return 'jiraWorkItem';
	}
	if (sourceAri?.includes(':blogpost/')) {
		return 'blog';
	}
	return 'page';
};
