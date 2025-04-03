import { fg } from '@atlaskit/platform-feature-flags';

import { type InteractionMetrics } from '../../common';
import type { MultiHeatmapPayload, VCResult } from '../../common/vc/types';
import { getConfig } from '../../config';
import { postInteractionLog } from '../../interaction-metrics';
import { getVCObserver } from '../../vc';

import getInteractionStatus from './get-interaction-status';
import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';
import getSSRDoneTimeValue from './get-ssr-done-time-value';

export default async function getVCMetrics(
	interaction: InteractionMetrics,
): Promise<VCResult & { 'metric:vc90'?: number | null }> {
	const config = getConfig();
	if (!config?.vc?.enabled) {
		return {};
	}
	if (interaction.type !== 'page_load' && interaction.type !== 'transition') {
		return {};
	}
	const interactionStatus = getInteractionStatus(interaction);
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);

	if (
		(interactionStatus.originalInteractionStatus !== 'SUCCEEDED' ||
			pageVisibilityUpToTTAI !== 'visible') &&
		fg('platform_ufo_no_vc_on_aborted')
	) {
		return {};
	}

	const isSSREnabled = config?.ssr || config?.vc.ssrWhitelist?.includes(interaction.ufoName);

	const ssr =
		interaction.type === 'page_load' && isSSREnabled ? { ssr: getSSRDoneTimeValue(config) } : null;

	postInteractionLog.setVCObserverSSRConfig(ssr);

	const tti = interaction.apdex?.[0]?.stopTime;
	const prefix = 'ufo';
	const result = await getVCObserver().getVCResult({
		start: interaction.start,
		stop: interaction.end,
		tti,
		prefix,
		vc: interaction.vc,
		isEventAborted: interactionStatus.originalInteractionStatus !== 'SUCCEEDED',
		...ssr,
	});

	if (config.experimentalInteractionMetrics?.enabled) {
		getVCObserver().stop();
	}

	postInteractionLog.setLastInteractionFinishVCResult(result);

	if (fg('platform_ufo_disable_ttvc_v1')) {
		const ttvcV2Revision = (result?.['ufo:vc:rev'] as MultiHeatmapPayload)?.find(
			({ revision }) => revision === 'fy25.02',
		);
		if (!ttvcV2Revision?.clean) {
			return result;
		}

		return {
			...result,
			'metric:vc90': ttvcV2Revision['metric:vc90'],
		};
	} else {
		const VC = result?.['metrics:vc'] as {
			[key: string]: number | null;
		};

		if (!VC || !result?.[`${prefix}:vc:clean`]) {
			return result;
		}

		if (
			interactionStatus.originalInteractionStatus !== 'SUCCEEDED' ||
			pageVisibilityUpToTTAI !== 'visible'
		) {
			return result;
		}

		return {
			...result,
			'metric:vc90': VC['90'],
		};
	}
}
