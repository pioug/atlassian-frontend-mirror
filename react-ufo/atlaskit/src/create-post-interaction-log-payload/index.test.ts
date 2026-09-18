import type { PostInteractionLogOutput } from '../common';
import { setUFOConfig } from '../config';
import createPostInteractionLogPayload from './index';
const createPostInteractionLogOutput = (): PostInteractionLogOutput => ({
	lastInteractionFinish: {
		ufoName: 'test-interaction',
		start: 100,
		end: 200,
		id: 'test-interaction-id',
		routeName: null,
		type: 'page_load',
		errors: [],
	},
	reactProfilerTimings: [],
	lastInteractionFinishVCResult: {
		'ufo:vc:rev': [
			{
				revision: 'raw-handler',
				clean: true,
				'metric:vc90': null,
				rawData: {
					obs: [{ t: 100, r: [0, 0, 10, 10], chg: 1, eid: 1 }],
					eid: { 1: 'div[data-testid="main"]' },
					chg: { 1: 'mutation:element' },
				},
				viewport: { w: 1280, h: 720 },
			},
		],
	},
	postInteractionFinishVCResult: {
		'ufo:vc:rev': [
			{
				revision: 'raw-handler',
				clean: true,
				'metric:vc90': null,
				rawData: {
					obs: [{ t: 150, r: [0, 0, 10, 10], chg: 1, eid: 1 }],
					eid: { 1: 'div[data-testid="main"]' },
					chg: { 1: 'mutation:element' },
				},
				viewport: { w: 1280, h: 720 },
			},
		],
	},
});

describe('createPostInteractionLogPayload', () => {
	beforeEach(() => {
		setUFOConfig({
			product: 'test-product',
			region: 'test-region',
			vc: {
				enabled: true,
				enabledVCRevisions: {
					all: ['fy26.04'],
				},
			},
			postInteractionLog: {
				enabled: true,
				rates: {
					'test-interaction': 1,
				},
			},
		});
	});

	afterEach(() => {
		// @ts-expect-error Resetting module-level config for tests.
		setUFOConfig(undefined);
	});

	it('includes raw-handler revisions for downstream VC90 calculation', () => {
		const payload = createPostInteractionLogPayload(createPostInteractionLogOutput());

		expect(payload?.attributes.properties.postInteractionLog.rawVCRevisions).toEqual({
			lastInteractionFinish: expect.objectContaining({
				revision: 'raw-handler',
				rawData: expect.objectContaining({
					obs: expect.any(Array),
				}),
			}),
			postInteractionFinish: expect.objectContaining({
				revision: 'raw-handler',
				rawData: expect.objectContaining({
					obs: expect.any(Array),
				}),
			}),
		});
		expect(payload?.attributes.properties.postInteractionLog.lastInteractionFinish.vc90).toBeNull();
		expect(payload?.attributes.properties.postInteractionLog.revisedVC90).toBeNull();
	});
});
