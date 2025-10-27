import type { DocNode } from '@atlaskit/adf-schema';

export const syncBlockWithParagraphAndPanelAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'syncBlock',
			attrs: {
				resourceId: 'ari:cloud:confluence:test-sync-block-with-paragraph-and-panel:page/1234/abc',
				localId: '626d746e-50af-4ac9-b468-5f9685de50b6',
			},
		},
	],
};

export const syncBlockPermissionDeniedAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'syncBlock',
			attrs: {
				resourceId: 'ari:cloud:confluence:test-sync-block-permission-denied:page/1234/abc',
				localId: 'dadba259-8f2c-45cb-9140-ce23278c5bbc',
			},
		},
	],
};

export const syncBlockNotFoundAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'syncBlock',
			attrs: {
				resourceId: 'ari:cloud:confluence:test-sync-block-not-found:page/1234/abc',
				localId: 'dadba259-8f2c-45cb-9140-ce23278c5bbc',
			},
		},
	],
};

export const syncBlockGenericErrorAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'syncBlock',
			attrs: {
				resourceId: 'ari:cloud:confluence:test-sync-block-generic-error:page/1234/abc',
				localId: 'dadba259-8f2c-45cb-9140-ce23278c5bbc',
			},
		},
	],
};

export const syncBlockLoadingStateAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'syncBlock',
			attrs: {
				resourceId: 'ari:cloud:confluence:test-sync-block-loading-state:page/1234/abc',
				localId: 'dadba259-8f2c-45cb-9140-ce23278c5bbc',
			},
		},
	],
};
