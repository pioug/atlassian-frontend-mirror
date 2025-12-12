import coinflip from '../../coinflip';
import { type InteractionMetrics } from '../../common';
import type { RevisionPayload, VCResult } from '../../common/vc/types';
import { getConfig, getMostRecentVCRevision, getVCRawDataInteractionRate } from '../../config';
import { interactionExtraMetrics, postInteractionLog } from '../../interaction-metrics';

import getInteractionStatus from './get-interaction-status';
import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';
import getSSRDoneTimeValue from './get-ssr-done-time-value';

async function getVCMetrics(
	interaction: InteractionMetrics,
	include3p: boolean = false,
	excludeSmartAnswersInSearch: boolean = false,
): Promise<VCResult & { 'metric:vc90'?: number | null }> {
	const config = getConfig();
	if (!config?.vc?.enabled) {
		return {};
	}
	if (
		interaction.type !== 'page_load' &&
		interaction.type !== 'transition' &&
		interaction.type !== 'press'
	) {
		return {};
	}
	const interactionStatus = getInteractionStatus(interaction);
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);
	const isPageVisible = pageVisibilityUpToTTAI === 'visible';

	const shouldReportVCMetrics =
		interactionStatus.originalInteractionStatus === 'SUCCEEDED' && isPageVisible;

	// Use per-interaction VC observer if available, otherwise fall back to global
	const observer = interaction.vcObserver;

	if (!observer) {
		return {};
	}

	const includeRawData = coinflip(
		getVCRawDataInteractionRate(interaction.ufoName, interaction.type),
	);

	const isSSREnabled =
		interaction.type === 'page_load' &&
		(config?.ssr || config?.vc.ssrWhitelist?.includes(interaction.ufoName));

	const ssr =
		interaction.type === 'page_load' && isSSREnabled ? { ssr: getSSRDoneTimeValue(config) } : null;

	postInteractionLog.setVCObserverSSRConfig(ssr);

	const tti = interaction.apdex?.[0]?.stopTime;
	const prefix = 'ufo';
	const result = await observer.getVCResult({
		start: interaction.start,
		stop: interaction.end,
		// Use end3p when available to capture raw data observations during 3p holds
		rawDataStopTime: interaction.end3p,
		tti,
		prefix,
		includeSSRInV3: config.vc?.includeSSRInV3,
		vc: interaction.vc,
		isEventAborted: interactionStatus.originalInteractionStatus !== 'SUCCEEDED',
		experienceKey: interaction.ufoName,
		interactionId: interaction.id,
		includeSSRRatio: config.vc?.includeSSRRatio,
		...ssr,
		include3p,
		excludeSmartAnswersInSearch,
		interactionType: interaction.type,
		isPageVisible,
		includeRawData,
	});

	observer.stop(interaction.ufoName);

	if (!include3p) {
		// For Post Interaction, last interaction should be without 3p
		postInteractionLog.setLastInteractionFinishVCResult(result);
		interactionExtraMetrics.setLastInteractionFinishVCResult(result);
	}

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
