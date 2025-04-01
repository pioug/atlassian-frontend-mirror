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
	const isMultiHeatmapEnabled = !fg('platform_ufo_multiheatmap_killswitch');

	if (!isMultiHeatmapEnabled) {
		return null;
	}

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

	const pageVisibilityUpToTTAI = getPageVisibilityState(interaction.start, interaction.end);
	const isVisiblePageVisibleUpToTTAI = pageVisibilityUpToTTAI === 'visible';
	const shouldHaveVCmetric = isVCClean && !isEventAborted && isVisiblePageVisibleUpToTTAI;

	const ttvcV1Revision = {
		revision: 'fy25.01',
		clean: isVCClean,
		'metric:vc90': shouldHaveVCmetric ? calculatedVC.VC['90'] : null,
		vcDetails: shouldHaveVCmetric
			? Object.fromEntries(
					VCParts.map((key) => [
						key,
						{
							t: calculatedVC.VC[key],
							e: calculatedVC.VCBox[key] ?? [],
						},
					]),
				)
			: {},
	};

	const ttvcV2ReportedMetric = fg('platform_ufo_fix_v2_reported_vc90')
		? calculatedVCNext.VC['90']
		: calculatedVC.VC['90'];

	const ttvcV2Revision = {
		revision: 'fy25.02',
		clean: isVCClean,
		'metric:vc90': shouldHaveVCmetric ? ttvcV2ReportedMetric : null,
		vcDetails: shouldHaveVCmetric
			? Object.fromEntries(
					VCParts.map((key) => [
						key,
						{
							t: calculatedVCNext.VC[key],
							e: calculatedVCNext.VCBox[key] ?? [],
						},
					]),
				)
			: {},
	};

	if (fg('platform_ufo_disable_ttvc_v1')) {
		return {
			[`${fullPrefix}vc:rev`]: [ttvcV2Revision],
		};
	}

	return {
		[`${fullPrefix}vc:rev`]: [ttvcV1Revision, ttvcV2Revision],
	};
}
