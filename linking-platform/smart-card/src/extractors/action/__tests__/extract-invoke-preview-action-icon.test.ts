import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import * as utils from '../../../view/EmbedModal/utils';
import { TEST_RESPONSE_WITH_PREVIEW, TEST_URL } from '../../common/__mocks__/jsonld';
import { extractInvokePreviewAction } from '../extract-invoke-preview-action';

const entity = {
	displayName: 'Document title',
	id: 'document-id',
	url: TEST_URL,
	liveEmbedUrl: TEST_URL,
	type: {
		category: 'document' as const,
		iconUrl: 'https://entity-icon.example/document.png',
	},
};

const response: SmartLinkResponse = {
	...TEST_RESPONSE_WITH_PREVIEW,
	meta: {
		...TEST_RESPONSE_WITH_PREVIEW.meta,
		generator: {
			name: 'Google Drive',
			icon: { url: 'https://provider-icon.example/drive.png' },
		},
	},
	entityData: entity,
};

// Both cohorts can open the modal when a preview panel is unavailable.
describe.each(['control', 'test'] as const)('preview modal icon in the %s cohort', (cohort) => {
	beforeEach(() => {
		setupEditorExperiments('test', { platform_hover_card_preview_panel: cohort });
	});

	afterEach(() => {
		jest.restoreAllMocks();
		setupEditorExperiments('test');
	});

	it('uses the entity icon and label when the provider icon gate is on', async () => {
		passGate('platform_lp_use_generator_icon_for_provider');
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const action = extractInvokePreviewAction({ response });

		expect(action).toBeDefined();
		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({
				linkIcon: { url: entity.type.iconUrl, label: 'document' },
				providerName: 'Google Drive',
				title: entity.displayName,
				src: entity.liveEmbedUrl,
			}),
		);
	});

	it('retains the JSON-LD icon when the provider icon gate is off', async () => {
		failGate('platform_lp_use_generator_icon_for_provider');
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const action = extractInvokePreviewAction({ response });

		expect(action).toBeDefined();
		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({ linkIcon: expect.objectContaining({ url: TEST_URL }) }),
		);
	});

	it('falls back to the JSON-LD icon when the entity has no icon', async () => {
		passGate('platform_lp_use_generator_icon_for_provider');
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const responseWithoutEntityIcon: SmartLinkResponse = {
			...response,
			entityData: { ...entity, type: { category: 'document' } },
		};
		const action = extractInvokePreviewAction({ response: responseWithoutEntityIcon });

		expect(action).toBeDefined();
		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({ linkIcon: expect.objectContaining({ url: TEST_URL }) }),
		);
	});

	it('retains the icon for JSON-LD-only links when the gate is on', async () => {
		passGate('platform_lp_use_generator_icon_for_provider');
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const action = extractInvokePreviewAction({ response: TEST_RESPONSE_WITH_PREVIEW });

		expect(action).toBeDefined();
		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({ linkIcon: expect.objectContaining({ url: TEST_URL }) }),
		);
	});
});
