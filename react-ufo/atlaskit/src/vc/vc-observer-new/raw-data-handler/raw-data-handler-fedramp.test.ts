import { isFedrampModerate } from '@atlaskit/atlassian-context/is-fedramp-moderate';

import { __resetFedrampOverrideCacheForTests } from '../../../config';
import getViewportHeight from '../metric-calculator/utils/get-viewport-height';
import getViewportWidth from '../metric-calculator/utils/get-viewport-width';
import type { VCObserverEntry, ViewportEntryData } from '../types';

import RawDataHandler from './index';

jest.mock('../metric-calculator/utils/get-viewport-width');
jest.mock('../metric-calculator/utils/get-viewport-height');
jest.mock('../../../hidden-timing');
jest.mock('@atlaskit/atlassian-context/is-fedramp-moderate', () => ({
	...jest.requireActual('@atlaskit/atlassian-context/is-fedramp-moderate'),
	isFedrampModerate: jest.fn(),
}));

const mockedIsFedrampModerate = isFedrampModerate as jest.Mock;
const mockGetViewportWidth = getViewportWidth as jest.MockedFunction<typeof getViewportWidth>;
const mockGetViewportHeight = getViewportHeight as jest.MockedFunction<typeof getViewportHeight>;

const buildEntry = (
	time: number,
	{
		elementName,
		attributeName,
		labelStacks,
	}: {
		elementName?: string;
		attributeName?: string;
		labelStacks?: { segment: string; labelStack: string };
	},
): VCObserverEntry => ({
	time,
	data: {
		type: 'attributes',
		visible: true,
		elementName: elementName ?? 'div',
		attributeName,
		rect: { left: 0, top: 0, right: 100, bottom: 50 } as DOMRect,
		previousRect: undefined,
		labelStacks,
	} as unknown as ViewportEntryData,
});

describe('RawDataHandler — FedRAMP scrubbing', () => {
	const startTime = 1000;
	const stopTime = 2000;
	let handler: RawDataHandler;

	beforeEach(() => {
		handler = new RawDataHandler();
		mockGetViewportWidth.mockReturnValue(1920);
		mockGetViewportHeight.mockReturnValue(1080);
		mockedIsFedrampModerate.mockReset();
		mockedIsFedrampModerate.mockReturnValue(false);
		// `isFedrampOverrideActive()` (in `../../../config`) memoises the
		// `isFedrampModerate()` result. Reset that cache between tests so
		// each case starts from a known state.
		__resetFedrampOverrideCacheForTests();
	});

	const baseEntries = (): VCObserverEntry[] => [
		buildEntry(1100, {
			elementName: 'div#hero',
			attributeName: 'data-user-id',
			labelStacks: { segment: 'confluence/page', labelStack: 'confluence/page/header' },
		}),
		buildEntry(1500, {
			elementName: 'span.cta',
			attributeName: 'aria-label',
			labelStacks: { segment: 'confluence/page', labelStack: 'confluence/page/cta' },
		}),
	];

	describe('control: FedRAMP false', () => {
		it('keeps att, obs[].att and lbl in the payload', async () => {
			const result = await handler.getRawData({
				entries: baseEntries(),
				startTime,
				stopTime,
				isPageVisible: true,
			});

			expect(result?.rawData?.att).toEqual({ 1: 'data-user-id', 2: 'aria-label' });
			expect(result?.rawData?.lbl).toBeDefined();
			expect(result?.rawData?.lblMode).toBe('sentinel-v1');
			// Per-observation att must still be present for at least one obs.
			expect(result?.rawData?.obs?.some((o) => o.att !== undefined)).toBe(true);
		});
	});

	describe('FedRAMP true', () => {
		beforeEach(() => {
			mockedIsFedrampModerate.mockReturnValue(true);
		});

		it('drops the rawData.att map', async () => {
			const result = await handler.getRawData({
				entries: baseEntries(),
				startTime,
				stopTime,
				isPageVisible: true,
			});
			expect(result?.rawData?.att).toBeUndefined();
		});

		it('drops the rawData.lbl map and lblMode', async () => {
			const result = await handler.getRawData({
				entries: baseEntries(),
				startTime,
				stopTime,
				isPageVisible: true,
			});
			expect(result?.rawData?.lbl).toBeUndefined();
			expect(result?.rawData?.lblMode).toBeUndefined();
		});

		it('strips the per-observation att field from every observation', async () => {
			const result = await handler.getRawData({
				entries: baseEntries(),
				startTime,
				stopTime,
				isPageVisible: true,
			});
			expect(result?.rawData?.obs?.length).toBeGreaterThan(0);
			expect(result?.rawData?.obs?.every((o) => o.att === undefined)).toBe(true);
		});

		it('preserves all non-PII fields (eid, chg, obs[].t, obs[].r, viewport)', async () => {
			const result = await handler.getRawData({
				entries: baseEntries(),
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// eid map of element-selector strings is intentionally retained — it
			// is independently neutralised by the FedRAMP `selectorConfig`
			// override so it only contains tag-name chains.
			expect(result?.rawData?.eid).toBeDefined();
			expect(result?.rawData?.chg).toBeDefined();
			expect(result?.viewport).toEqual({ w: 1920, h: 1080 });
			expect(result?.rawData?.obs?.[0].t).toBe(100);
			expect(result?.rawData?.obs?.[0].r).toBeDefined();
			expect(result?.rawData?.obs?.[0].eid).toBeGreaterThan(0);
		});
	});

	describe('Defensive behaviour', () => {
		it('falls back to NOT scrubbing when isFedrampModerate throws', async () => {
			mockedIsFedrampModerate.mockImplementation(() => {
				throw new Error('boom');
			});

			const result = await handler.getRawData({
				entries: baseEntries(),
				startTime,
				stopTime,
				isPageVisible: true,
			});

			// On detection error we keep the existing behaviour to avoid
			// throwing inside the metrics pipeline. Att/lbl remain populated.
			expect(result?.rawData?.att).toBeDefined();
			expect(result?.rawData?.lbl).toBeDefined();
		});
	});
});
