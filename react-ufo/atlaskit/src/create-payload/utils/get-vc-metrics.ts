import { fg } from '@atlaskit/platform-feature-flags';

import { type InteractionMetrics } from '../../common';
import type { RevisionPayload, VCResult } from '../../common/vc/types';
import { getConfig, getMostRecentVCRevision } from '../../config';
import { postInteractionLog } from '../../interaction-metrics';
import { getVCObserver } from '../../vc';

import getInteractionStatus from './get-interaction-status';
import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';
import getSSRDoneTimeValue from './get-ssr-done-time-value';

async function getVCMetrics(
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

	const shouldReportVCMetrics =
		interactionStatus.originalInteractionStatus === 'SUCCEEDED' &&
		pageVisibilityUpToTTAI === 'visible';

	if (!shouldReportVCMetrics && fg('platform_ufo_no_vc_on_aborted')) {
		getVCObserver().stop(interaction.ufoName);
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
		experienceKey: interaction.ufoName,
		interactionId: interaction.id,
		includeSSRRatio: config.vc?.includeSSRRatio,
		...ssr,
	});

	if (config.experimentalInteractionMetrics?.enabled) {
		getVCObserver().stop(interaction.ufoName);
	}

	postInteractionLog.setLastInteractionFinishVCResult(result);

	const mostRecentVCRevision = getMostRecentVCRevision(interaction.ufoName);
	const mostRecentVCRevisionPayload = (result?.['ufo:vc:rev'] as RevisionPayload)?.find(
		({ revision }) => revision === mostRecentVCRevision,
	);

	if (!shouldReportVCMetrics || !mostRecentVCRevisionPayload?.clean) {
		return result;
	}

	return {
		...result,
		'metric:vc90': mostRecentVCRevisionPayload['metric:vc90'],
	};
}

export default getVCMetrics;
