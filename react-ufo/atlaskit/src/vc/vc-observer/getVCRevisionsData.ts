import type { InteractionMetrics } from '../../common/common/types';
import type { RevisionPayload, RevisionPayloadEntry, VCRatioType } from '../../common/vc/types';
import { isVCRevisionEnabled } from '../../config';
import { getPageVisibilityState } from '../../hidden-timing';

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
	calculatedVC,
	calculatedVCNext,
	experienceKey,
	ratios,
}: {
	fullPrefix?: string;
	interaction: Pick<InteractionMetrics, 'start' | 'end'>;
	isVCClean: boolean;
	isEventAborted: boolean;
	calculatedVC: CalculatedVC;
	calculatedVCNext: CalculatedVC;
	experienceKey: string;
	ratios: VCRatioType;
}) {
	const pageVisibilityUpToTTAI = getPageVisibilityState(interaction.start, interaction.end);
	const isVisiblePageVisibleUpToTTAI = pageVisibilityUpToTTAI === 'visible';
	const shouldHaveVCmetric = isVCClean && !isEventAborted && isVisiblePageVisibleUpToTTAI;

	const availableVCRevisionPayloads: RevisionPayload = [];

	if (isVCRevisionEnabled('fy25.01', experienceKey)) {
		const revision: RevisionPayloadEntry = {
			revision: 'fy25.01',
			clean: isVCClean,
			'metric:vc90': shouldHaveVCmetric ? calculatedVC.VC['90'] : null,
			vcDetails: createVCDetails(calculatedVC, shouldHaveVCmetric),
		};

		if (shouldHaveVCmetric) {
			revision.ratios = ratios;
		}

		availableVCRevisionPayloads.push(revision);
	}

	if (isVCRevisionEnabled('fy25.02', experienceKey)) {
		const revision: RevisionPayloadEntry = {
			revision: 'fy25.02',
			clean: isVCClean,
			'metric:vc90': shouldHaveVCmetric ? calculatedVCNext.VC['90'] : null,
			vcDetails: createVCDetails(calculatedVCNext, shouldHaveVCmetric),
		};

		if (shouldHaveVCmetric) {
			revision.ratios = ratios;
		}

		availableVCRevisionPayloads.push(revision);
	}

	return {
		[`${fullPrefix}vc:rev`]: availableVCRevisionPayloads,
	};
}
