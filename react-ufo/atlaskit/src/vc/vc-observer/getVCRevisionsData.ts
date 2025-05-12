import { fg } from '@atlaskit/platform-feature-flags';

import { InteractionMetrics } from '../../common/common/types';
import { RevisionPayload } from '../../common/vc/types';
import { isVCRevisionEnabled } from '../../config';
import { getPageVisibilityState } from '../../hidden-timing';

import type { MultiRevisionHeatmap } from './heatmap/heatmap';
import { getRevisions } from './revisions/revisions';

type CalculatedVC = {
	VC: {
		[key: string]: number | null;
	};
	VCBox: {
		[key: string]: string[] | null;
	};
};

const VCParts = ['25', '50', '75', '80', '85', '90', '95', '98', '99'];

const READONLY_EMPTY_ARRAY: string[] = Array.from<string>({ length: 0 });

// Helper function to create vcDetails object to avoid code duplication
function createVCDetails(calculatedVC: CalculatedVC, shouldHaveVCmetric: boolean) {
	if (!shouldHaveVCmetric || !calculatedVC || !calculatedVC.VC || !calculatedVC.VCBox) {
		return {};
	}

	const details: { [key: string]: { t: number; e: string[] } } = {};
	const { VC, VCBox } = calculatedVC; // Destructure once to avoid repeated property access

	for (const key of VCParts) {
		details[key] = {
			t: VC[key] || -1,
			e: VCBox[key] || READONLY_EMPTY_ARRAY,
		};
	}

	return details;
}

// Optimized implementation (current one)
export function getVCRevisionsData({
	fullPrefix,
	interaction,
	isVCClean,
	isEventAborted,
	multiHeatmap,
	ssr,
	calculatedVC,
	calculatedVCNext,
	experienceKey,
}: {
	fullPrefix?: string;
	interaction: Pick<InteractionMetrics, 'start' | 'end'>;
	isVCClean: boolean;
	isEventAborted: boolean;
	multiHeatmap: MultiRevisionHeatmap | null;
	calculatedVC: CalculatedVC;
	calculatedVCNext: CalculatedVC;
	experienceKey: string;
	ssr?: number;
}) {
	const isTTVCv3Enabled = fg('platform_ufo_vc_enable_revisions_by_experience')
		? isVCRevisionEnabled('fy25.03', experienceKey)
		: isVCRevisionEnabled('fy25.03');

	// As part of `platform_ufo_vc_enable_revisions_by_experience`, we are looking to turn off the `multiHeatmap` branch of code
	// for calculating TTVC, and instead rely on existing values already available, e.g. `calculatedVC` and `calculatedVCNext`
	if (!isTTVCv3Enabled && !fg('platform_ufo_vc_enable_revisions_by_experience')) {
		if (!multiHeatmap) {
			return null;
		}

		return {
			[`${fullPrefix}vc:rev`]: multiHeatmap?.getPayloadShapedData({
				VCParts: VCParts.map((v) => parseInt(v)),
				VCCalculationMethods: getRevisions().map(
					({ classifier }) => classifier.VCCalculationMethod,
				),
				filterComponentsLog: getRevisions().map(({ classifier }) => classifier.filterComponentsLog),
				isEventAborted,
				interactionStart: interaction.start,
				ttai: interaction.end,
				ssr,
				clean: isVCClean,
			}),
		};
	}

	const pageVisibilityUpToTTAI = getPageVisibilityState(interaction.start, interaction.end);
	const isVisiblePageVisibleUpToTTAI = pageVisibilityUpToTTAI === 'visible';
	const shouldHaveVCmetric = isVCClean && !isEventAborted && isVisiblePageVisibleUpToTTAI;

	if (fg('platform_ufo_vc_enable_revisions_by_experience')) {
		const availableVCRevisionPayloads: RevisionPayload = [];

		if (isVCRevisionEnabled('fy25.01', experienceKey)) {
			availableVCRevisionPayloads.push({
				revision: 'fy25.01',
				clean: isVCClean,
				'metric:vc90': shouldHaveVCmetric ? calculatedVC.VC['90'] : null,
				vcDetails: createVCDetails(calculatedVC, shouldHaveVCmetric),
			});
		}

		if (isVCRevisionEnabled('fy25.02', experienceKey)) {
			availableVCRevisionPayloads.push({
				revision: 'fy25.02',
				clean: isVCClean,
				'metric:vc90': shouldHaveVCmetric ? calculatedVCNext.VC['90'] : null,
				vcDetails: createVCDetails(calculatedVCNext, shouldHaveVCmetric),
			});
		}

		return {
			[`${fullPrefix}vc:rev`]: availableVCRevisionPayloads,
		};
	} else {
		// Create the V2 revision object which is always needed
		const ttvcV2Revision = {
			revision: 'fy25.02',
			clean: isVCClean,
			'metric:vc90': shouldHaveVCmetric ? calculatedVCNext.VC['90'] : null,
			vcDetails: createVCDetails(calculatedVCNext, shouldHaveVCmetric),
		};

		const isTTVCv1Disabled = !isVCRevisionEnabled('fy25.01');

		if (isTTVCv1Disabled) {
			return {
				[`${fullPrefix}vc:rev`]: [ttvcV2Revision],
			};
		}

		// Only create ttvcV1Revision when we're actually going to use it
		const ttvcV1Revision = {
			revision: 'fy25.01',
			clean: isVCClean,
			'metric:vc90': shouldHaveVCmetric ? calculatedVC.VC['90'] : null,
			vcDetails: createVCDetails(calculatedVC, shouldHaveVCmetric),
		};

		return {
			[`${fullPrefix}vc:rev`]: [ttvcV1Revision, ttvcV2Revision],
		};
	}
}
