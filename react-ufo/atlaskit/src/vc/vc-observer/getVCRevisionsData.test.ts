import { fg } from '@atlaskit/platform-feature-flags';

import { getPageVisibilityState } from '../../hidden-timing';

import { getVCRevisionsData } from './getVCRevisionsData';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

jest.mock('../../hidden-timing');
const mockGetPageVisibilityState = getPageVisibilityState as jest.Mock;

describe('getVCRevisionsData', () => {
	const enabledFeatureGateStore = new Set<string>();

	function enableFeatureGate(fgName: string) {
		enabledFeatureGateStore.add(fgName);
	}

	mockFg.mockImplementation((fgName: string) => {
		return enabledFeatureGateStore.has(fgName);
	});

	mockGetPageVisibilityState.mockReturnValue('visible');

	afterEach(() => {
		// reset all feature gates
		enabledFeatureGateStore.clear();
	});

	test('returns null if the multiheatmap killswitch FG is enabled', () => {
		enableFeatureGate('platform_ufo_multiheatmap_killswitch');

		expect(
			getVCRevisionsData({
				multiHeatmap: null,
				fullPrefix: 'ufo:',
				interaction: {
					start: 0,
					end: 3000,
				},
				isVCClean: true,
				isEventAborted: false,
				calculatedVC: {
					VC: {
						'25': 900,
						'50': 1400,
						'75': 1600,
						'80': 1600,
						'85': 1900,
						'90': 1900,
						'95': 1900,
						'98': 2100,
						'99': 2100,
					},
					VCBox: {
						'25': ['div[testid=sectionTwo]'],
						'50': ['div[testid=sectionFour]'],
						'75': ['div[testid=sectionFive]'],
						'80': ['div[testid=sectionFive]'],
						'85': ['div[testid=sectionSix]'],
						'90': ['div[testid=sectionSix]'],
						'95': ['div[testid=sectionSix]'],
						'98': ['div[testid=sectionSeven]'],
						'99': ['div[testid=sectionSeven]'],
					},
				},
				calculatedVCNext: {
					VC: {
						'25': 800,
						'50': 1300,
						'75': 1500,
						'80': 1500,
						'85': 1800,
						'90': 1800,
						'95': 1800,
						'98': 2000,
						'99': 2000,
					},
					VCBox: {
						'25': ['div[testid=sectionTwo]'],
						'50': ['div[testid=sectionFour]'],
						'75': ['div[testid=sectionFive]'],
						'80': ['div[testid=sectionFive]'],
						'85': ['div[testid=sectionSix]'],
						'90': ['div[testid=sectionSix]'],
						'95': ['div[testid=sectionSix]'],
						'98': ['div[testid=sectionSeven]'],
						'99': ['div[testid=sectionSeven]'],
					},
				},
			}),
		).toBeNull();
	});

	describe("fg('platform_ufo_vc_observer_new') === true", () => {
		beforeEach(() => {
			enableFeatureGate('platform_ufo_vc_observer_new');
		});

		test('use existing VC input data to calculate the revised VC metrics', () => {
			expect(
				getVCRevisionsData({
					multiHeatmap: null,
					fullPrefix: 'ufo:',
					interaction: {
						start: 0,
						end: 3000,
					},
					isVCClean: true,
					isEventAborted: false,
					calculatedVC: {
						VC: {
							'25': 900,
							'50': 1400,
							'75': 1600,
							'80': 1600,
							'85': 1900,
							'90': 1900,
							'95': 1900,
							'98': 2100,
							'99': 2100,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
					calculatedVCNext: {
						VC: {
							'25': 800,
							'50': 1300,
							'75': 1500,
							'80': 1500,
							'85': 1800,
							'90': 1800,
							'95': 1800,
							'98': 2000,
							'99': 2000,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
				}),
			).toStrictEqual({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': 1900,
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div[testid=sectionTwo]'],
								t: 900,
							},
							'50': {
								e: ['div[testid=sectionFour]'],
								t: 1400,
							},
							'75': {
								e: ['div[testid=sectionFive]'],
								t: 1600,
							},
							'80': {
								e: ['div[testid=sectionFive]'],
								t: 1600,
							},
							'85': {
								e: ['div[testid=sectionSix]'],
								t: 1900,
							},
							'90': {
								e: ['div[testid=sectionSix]'],
								t: 1900,
							},
							'95': {
								e: ['div[testid=sectionSix]'],
								t: 1900,
							},
							'98': {
								e: ['div[testid=sectionSeven]'],
								t: 2100,
							},
							'99': {
								e: ['div[testid=sectionSeven]'],
								t: 2100,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 1900,
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div[testid=sectionTwo]'],
								t: 800,
							},
							'50': {
								e: ['div[testid=sectionFour]'],
								t: 1300,
							},
							'75': {
								e: ['div[testid=sectionFive]'],
								t: 1500,
							},
							'80': {
								e: ['div[testid=sectionFive]'],
								t: 1500,
							},
							'85': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'90': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'95': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'98': {
								e: ['div[testid=sectionSeven]'],
								t: 2000,
							},
							'99': {
								e: ['div[testid=sectionSeven]'],
								t: 2000,
							},
						},
					},
				],
			});
		});

		test('uses the correct vc:next value for fy25.02 when platform_ufo_fix_v2_reported_vc90 === true', () => {
			enableFeatureGate('platform_ufo_fix_v2_reported_vc90');

			expect(
				getVCRevisionsData({
					multiHeatmap: null,
					fullPrefix: 'ufo:',
					interaction: {
						start: 0,
						end: 3000,
					},
					isVCClean: true,
					isEventAborted: false,
					calculatedVC: {
						VC: {
							'25': 900,
							'50': 1400,
							'75': 1600,
							'80': 1600,
							'85': 1900,
							'90': 1900,
							'95': 1900,
							'98': 2100,
							'99': 2100,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
					calculatedVCNext: {
						VC: {
							'25': 800,
							'50': 1300,
							'75': 1500,
							'80': 1500,
							'85': 1800,
							'90': 1800,
							'95': 1800,
							'98': 2000,
							'99': 2000,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
				}),
			).toStrictEqual({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': 1900,
						revision: 'fy25.01',
						vcDetails: {
							'25': {
								e: ['div[testid=sectionTwo]'],
								t: 900,
							},
							'50': {
								e: ['div[testid=sectionFour]'],
								t: 1400,
							},
							'75': {
								e: ['div[testid=sectionFive]'],
								t: 1600,
							},
							'80': {
								e: ['div[testid=sectionFive]'],
								t: 1600,
							},
							'85': {
								e: ['div[testid=sectionSix]'],
								t: 1900,
							},
							'90': {
								e: ['div[testid=sectionSix]'],
								t: 1900,
							},
							'95': {
								e: ['div[testid=sectionSix]'],
								t: 1900,
							},
							'98': {
								e: ['div[testid=sectionSeven]'],
								t: 2100,
							},
							'99': {
								e: ['div[testid=sectionSeven]'],
								t: 2100,
							},
						},
					},
					{
						clean: true,
						'metric:vc90': 1800,
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div[testid=sectionTwo]'],
								t: 800,
							},
							'50': {
								e: ['div[testid=sectionFour]'],
								t: 1300,
							},
							'75': {
								e: ['div[testid=sectionFive]'],
								t: 1500,
							},
							'80': {
								e: ['div[testid=sectionFive]'],
								t: 1500,
							},
							'85': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'90': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'95': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'98': {
								e: ['div[testid=sectionSeven]'],
								t: 2000,
							},
							'99': {
								e: ['div[testid=sectionSeven]'],
								t: 2000,
							},
						},
					},
				],
			});
		});

		test('removes the fy25.01 VC payload when platform_ufo_disable_ttvc_v1 === true', () => {
			enableFeatureGate('platform_ufo_disable_ttvc_v1');

			expect(
				getVCRevisionsData({
					multiHeatmap: null,
					fullPrefix: 'ufo:',
					interaction: {
						start: 0,
						end: 3000,
					},
					isVCClean: true,
					isEventAborted: false,
					calculatedVC: {
						VC: {
							'25': 900,
							'50': 1400,
							'75': 1600,
							'80': 1600,
							'85': 1900,
							'90': 1900,
							'95': 1900,
							'98': 2100,
							'99': 2100,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
					calculatedVCNext: {
						VC: {
							'25': 800,
							'50': 1300,
							'75': 1500,
							'80': 1500,
							'85': 1800,
							'90': 1800,
							'95': 1800,
							'98': 2000,
							'99': 2000,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
				}),
			).toStrictEqual({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': 1900,
						revision: 'fy25.02',
						vcDetails: {
							'25': {
								e: ['div[testid=sectionTwo]'],
								t: 800,
							},
							'50': {
								e: ['div[testid=sectionFour]'],
								t: 1300,
							},
							'75': {
								e: ['div[testid=sectionFive]'],
								t: 1500,
							},
							'80': {
								e: ['div[testid=sectionFive]'],
								t: 1500,
							},
							'85': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'90': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'95': {
								e: ['div[testid=sectionSix]'],
								t: 1800,
							},
							'98': {
								e: ['div[testid=sectionSeven]'],
								t: 2000,
							},
							'99': {
								e: ['div[testid=sectionSeven]'],
								t: 2000,
							},
						},
					},
				],
			});
		});

		test('returns null metric:vc90 and empty vcDetails if isVCClean === false', () => {
			expect(
				getVCRevisionsData({
					multiHeatmap: null,
					fullPrefix: 'ufo:',
					interaction: {
						start: 0,
						end: 3000,
					},
					isVCClean: false,
					isEventAborted: false,
					calculatedVC: {
						VC: {
							'25': 900,
							'50': 1400,
							'75': 1600,
							'80': 1600,
							'85': 1900,
							'90': 1900,
							'95': 1900,
							'98': 2100,
							'99': 2100,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
					calculatedVCNext: {
						VC: {
							'25': 800,
							'50': 1300,
							'75': 1500,
							'80': 1500,
							'85': 1800,
							'90': 1800,
							'95': 1800,
							'98': 2000,
							'99': 2000,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
				}),
			).toStrictEqual({
				'ufo:vc:rev': [
					{
						clean: false,
						'metric:vc90': null,
						revision: 'fy25.01',
						vcDetails: {},
					},
					{
						clean: false,
						'metric:vc90': null,
						revision: 'fy25.02',
						vcDetails: {},
					},
				],
			});
		});

		test('returns null metric:vc90 and empty vcDetails if isEventAborted === true', () => {
			expect(
				getVCRevisionsData({
					multiHeatmap: null,
					fullPrefix: 'ufo:',
					interaction: {
						start: 0,
						end: 3000,
					},
					isVCClean: true,
					isEventAborted: true,
					calculatedVC: {
						VC: {
							'25': 900,
							'50': 1400,
							'75': 1600,
							'80': 1600,
							'85': 1900,
							'90': 1900,
							'95': 1900,
							'98': 2100,
							'99': 2100,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
					calculatedVCNext: {
						VC: {
							'25': 800,
							'50': 1300,
							'75': 1500,
							'80': 1500,
							'85': 1800,
							'90': 1800,
							'95': 1800,
							'98': 2000,
							'99': 2000,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
				}),
			).toStrictEqual({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': null,
						revision: 'fy25.01',
						vcDetails: {},
					},
					{
						clean: true,
						'metric:vc90': null,
						revision: 'fy25.02',
						vcDetails: {},
					},
				],
			});
		});

		test('returns null metric:vc90 and empty vcDetails if the page was not visible during the interaction start and end', () => {
			mockGetPageVisibilityState.mockReturnValueOnce('mixed');

			expect(
				getVCRevisionsData({
					multiHeatmap: null,
					fullPrefix: 'ufo:',
					interaction: {
						start: 0,
						end: 3000,
					},
					isVCClean: true,
					isEventAborted: false,
					calculatedVC: {
						VC: {
							'25': 900,
							'50': 1400,
							'75': 1600,
							'80': 1600,
							'85': 1900,
							'90': 1900,
							'95': 1900,
							'98': 2100,
							'99': 2100,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
					calculatedVCNext: {
						VC: {
							'25': 800,
							'50': 1300,
							'75': 1500,
							'80': 1500,
							'85': 1800,
							'90': 1800,
							'95': 1800,
							'98': 2000,
							'99': 2000,
						},
						VCBox: {
							'25': ['div[testid=sectionTwo]'],
							'50': ['div[testid=sectionFour]'],
							'75': ['div[testid=sectionFive]'],
							'80': ['div[testid=sectionFive]'],
							'85': ['div[testid=sectionSix]'],
							'90': ['div[testid=sectionSix]'],
							'95': ['div[testid=sectionSix]'],
							'98': ['div[testid=sectionSeven]'],
							'99': ['div[testid=sectionSeven]'],
						},
					},
				}),
			).toStrictEqual({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': null,
						revision: 'fy25.01',
						vcDetails: {},
					},
					{
						clean: true,
						'metric:vc90': null,
						revision: 'fy25.02',
						vcDetails: {},
					},
				],
			});
		});
	});

	// NOTE: not testing fg('platform_ufo_vc_observer_new') === false,
	// as this is essentially what is already in packages/react-ufo/atlaskit/src/vc/vc-observer/heatmap/test.ts
});
