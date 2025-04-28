import { fg } from '@atlaskit/platform-feature-flags';

import { InteractionMetrics } from '../../common/common/types';
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

	const details: { [key: string]: { t: number | undefined | null; e: string[] } } = {};
	const { VC, VCBox } = calculatedVC; // Destructure once to avoid repeated property access

	for (const key of VCParts) {
		details[key] = {
			t: VC[key],
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
}: {
	fullPrefix?: string;
	interaction: Pick<InteractionMetrics, 'start' | 'end'>;
	isVCClean: boolean;
	isEventAborted: boolean;
	multiHeatmap: MultiRevisionHeatmap | null;
	calculatedVC: CalculatedVC;
	calculatedVCNext: CalculatedVC;
	ssr?: number;
}) {
	if (!fg('platform_ufo_vc_observer_new')) {
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

	// Calculate these conditions once
	const pageVisibilityUpToTTAI = getPageVisibilityState(interaction.start, interaction.end);
	const isVisiblePageVisibleUpToTTAI = pageVisibilityUpToTTAI === 'visible';
	const shouldHaveVCmetric = isVCClean && !isEventAborted && isVisiblePageVisibleUpToTTAI;

	// Create the V2 revision object which is always needed
	const ttvcV2Revision = {
		revision: 'fy25.02',
		clean: isVCClean,
		'metric:vc90': shouldHaveVCmetric ? calculatedVCNext.VC['90'] : null,
		vcDetails: createVCDetails(calculatedVCNext, shouldHaveVCmetric),
	};

	if (fg('platform_ufo_disable_ttvc_v1')) {
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
