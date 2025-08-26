import coinflip from '../coinflip';
import type { InteractionMetrics, RevisionPayload } from '../common';
import { getConfig, getExtraInteractionRate } from '../config';
import { getMoreAccuratePageVisibilityUpToTTAI } from '../create-payload';
import { sanitizeUfoName } from '../create-payload/common/utils';
import getPageVisibilityUpToTTAI from '../create-payload/utils/get-page-visibility-up-to-ttai';
import getPayloadSize from '../create-payload/utils/get-payload-size';
import { getReactUFOPayloadVersion } from '../create-payload/utils/get-react-ufo-payload-version';
import getTTAI from '../create-payload/utils/get-ttai';
import getVCMetrics from '../create-payload/utils/get-vc-metrics';

async function createInteractionExtraLogPayload(
	interactionId: string,
	interaction: InteractionMetrics,
) {
	const config = getConfig();
	if (!config) {
		throw Error('UFO Configuration not provided');
	}

	const {
		end,
		start,
		ufoName,
		rate,
		type,
		abortReason,
		routeName,
		previousInteractionName,
		isPreviousInteractionAborted,
		abortedByInteractionName,
	} = interaction;

	const configRate = getExtraInteractionRate(ufoName, type);
	if (!coinflip(configRate)) {
		return null;
	}

	const pageVisibilityAtTTAI = getPageVisibilityUpToTTAI(interaction);
	const isPageLoad = type === 'page_load' || type === 'transition';
	if (!isPageLoad) {
		// Only create payload for page load
		return null;
	}

	const calculatePageVisibilityFromTheStartOfPageLoad =
		config.enableBetterPageVisibilityApi && isPageLoad;

	const moreAccuratePageVisibilityAtTTAI = calculatePageVisibilityFromTheStartOfPageLoad
		? getMoreAccuratePageVisibilityUpToTTAI(interaction)
		: null;

	const extraTTAI = getTTAI(interaction) ?? undefined;

	const newUFOName = sanitizeUfoName(ufoName);

	const finalVCMetrics = await getVCMetrics(interaction, true);
	const ttvc = (finalVCMetrics['ufo:vc:rev'] as RevisionPayload)
		?.map((revision) => {
			if (revision['metric:vc90'] === null || revision.clean !== true) {
				return null;
			}
			return {
				revision: revision.revision,
				vc90: revision['metric:vc90'],
			};
		})
		.filter((revision): revision is { revision: string; vc90: number } => revision != null);

	const payload = {
		actionSubject: 'experience',
		action: 'measured',
		eventType: 'operational',
		source: 'measured',
		tags: ['observability'],
		attributes: {
			properties: {
				// basic
				'event:hostname': window.location?.hostname || 'unknown',
				'event:product': config.product,
				'event:schema': '1.0.0',
				'event:sizeInKb': 0,
				'event:source': {
					name: 'react-ufo/web',
					version: getReactUFOPayloadVersion(interaction.type),
				},
				'event:region': config.region || 'unknown',
				'experience:key': 'custom.interaction-extra-metrics',
				'experience:name': newUFOName,
				interactionMetrics: {
					namePrefix: config.namePrefix || '',
					segmentPrefix: config.segmentPrefix || '',
					interactionId,
					pageVisibilityAtTTAI,
					experimental__pageVisibilityAtTTAI: moreAccuratePageVisibilityAtTTAI,
					// raw interaction metrics
					rate,
					routeName,
					type,
					abortReason,
					previousInteractionName,
					isPreviousInteractionAborted,
					abortedByInteractionName,

					// performance
					end: Math.round(end),
					start: Math.round(start),
					'metric:ttai:3p': extraTTAI,
					ttvc: ttvc ?? undefined,
				},
			},
		},
	};

	payload.attributes.properties['event:sizeInKb'] = getPayloadSize(payload.attributes.properties);
	return payload;
}

export default createInteractionExtraLogPayload;
