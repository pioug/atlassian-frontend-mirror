import { useCallback, useEffect, useRef, useState } from 'react';

import { getDocument } from '@atlaskit/browser-apis';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getIsRovoChatEnabled } from '../../../utils/rovo';
import type { CardActionOptions } from '../../../view/Card/types';
import { getExtensionKey } from '../../getExtensionKey';
import { useSmartCardState } from '../../store';
import useRovoConfig from '../use-rovo-config';
import { evaluateExperiment, evaluateOpportunity, type EligibilityResult } from './evaluate';
import {
	claimSpotlight,
	getSuppressionStore,
	isSpotlightActive,
	releaseSpotlight,
	type SpotlightSuppression,
} from './suppression';

export type SpotlightInteraction = 'impression' | 'clicked' | 'dismissed';

export interface SpotlightEligibility extends EligibilityResult {
	onClick: () => boolean;
	onDismiss: () => void;
	onShown: () => void;
	product?: string;
	provider?: string;
}

export default function useOneClickChatSpotlightEligibility({
	url,
	actionOptions,
	isOpportunity,
	onInteraction,
}: {
	actionOptions?: CardActionOptions;
	isOpportunity: boolean;
	onInteraction: (interaction: SpotlightInteraction) => void;
	url?: string;
}): SpotlightEligibility {
	const card = useSmartCardState(url ?? '');
	const { product, rovoOptions } = useRovoConfig();
	const gateEnabled = fg('platform_sl_one_click_chat_spotlight_v2_fg');
	const provider = getExtensionKey(card.details);
	const access = card.details?.meta.access;
	const visibility = card.details?.meta.visibility;
	const rovoAvailable = getIsRovoChatEnabled(rovoOptions);
	const hostProduct =
		product === 'CONFLUENCE'
			? 'confluence_web'
			: product === 'JPD' || product === 'JSW' || product === 'JSM' || product === 'JWM'
				? 'jira_web'
				: undefined;
	const [suppression, setSuppression] = useState<SpotlightSuppression>();
	const [eligibility, setEligibility] = useState<EligibilityResult>({
		isEligible: false,
		reason: 'suppression_unavailable',
	});
	const [opportunityVersion, refreshOpportunity] = useState(0);
	const owner = useRef(Symbol('one-click-chat-spotlight'));
	const shown = useRef(false);
	const ended = useRef(false);
	const interaction = useRef(onInteraction);
	interaction.current = onInteraction;

	useEffect(() => {
		if (gateEnabled) {
			setSuppression(getSuppressionStore());
		}
	}, [gateEnabled]);

	useEffect(() => {
		const doc = getDocument();
		if (!gateEnabled || !isOpportunity || !doc) {
			return;
		}
		const refresh = () => refreshOpportunity((version) => version + 1);
		window.addEventListener('focus', refresh);
		doc.addEventListener('visibilitychange', refresh);
		// A link that remains visible across midnight is a new daily opportunity.
		const midnight = new Date();
		midnight.setHours(24, 0, 0, 0);
		const timer = window.setTimeout(refresh, midnight.getTime() - Date.now());
		return () => {
			window.removeEventListener('focus', refresh);
			doc.removeEventListener('visibilitychange', refresh);
			window.clearTimeout(timer);
		};
	}, [gateEnabled, isOpportunity, opportunityVersion]);

	useEffect(() => {
		const token = owner.current;
		const opportunity = evaluateOpportunity({
			gateEnabled,
			appearance: 'inline',
			status: isOpportunity ? card.status : 'pending',
			provider,
			// Public resolution alone does not prove provider authorization. Fail closed for it.
			authorized: visibility === 'restricted' && access !== 'unauthorized',
			hasAccess: access === 'granted',
			rovoAvailable,
			consumerOptedIn: actionOptions?.rovoChatAction?.optIn === true,
			product: hostProduct,
			history: suppression?.read(),
			spotlightActive: isSpotlightActive(token),
			now: Date.now(),
		});
		if (!opportunity.isEligible || !claimSpotlight(token)) {
			setEligibility(
				opportunity.isEligible ? { isEligible: false, reason: 'spotlight_active' } : opportunity,
			);
			return;
		}
		let cohort: EligibilityResult;
		try {
			// Targeting owns prior-day 3P MAU exclusion and account-level sticky assignment.
			// Both control and treatment are evaluated at this same, unsuppressed opportunity.
			cohort = evaluateExperiment(
				expVal<boolean | null>('platform_sl_one_click_chat_spotlight_v2_exp', 'isEnabled', null),
			);
		} catch {
			cohort = { isEligible: false, reason: 'experiment_unavailable' };
		}
		setEligibility(cohort);
		if (!cohort.isEligible) {
			releaseSpotlight(token);
		}
		return () => releaseSpotlight(token);
	}, [
		gateEnabled,
		isOpportunity,
		card.status,
		access,
		visibility,
		provider,
		hostProduct,
		rovoAvailable,
		actionOptions?.rovoChatAction?.optIn,
		suppression,
		opportunityVersion,
	]);

	useEffect(() => {
		// Eligibility refreshes can keep the same popup open across midnight. Reset
		// delivery state only when it closes, not while its onShown effect stays mounted.
		if (!eligibility.isEligible) {
			shown.current = false;
			ended.current = false;
		}
	}, [eligibility.isEligible]);

	const onShown = useCallback(() => {
		if (shown.current || ended.current || !eligibility.isEligible || !suppression) {
			return;
		}
		if (!suppression.impress(Date.now())) {
			ended.current = true;
			releaseSpotlight(owner.current);
			setEligibility({ isEligible: false, reason: 'suppression_unavailable' });
			return;
		}
		shown.current = true;
		interaction.current('impression');
	}, [eligibility.isEligible, suppression]);

	const finish = useCallback(
		(kind: 'clicked' | 'dismissed') => {
			if (!shown.current || ended.current) {
				return false;
			}
			ended.current = true;
			if (kind === 'dismissed') {
				suppression?.dismiss(Date.now());
			}
			interaction.current(kind);
			releaseSpotlight(owner.current);
			setEligibility({
				isEligible: false,
				reason: kind === 'dismissed' ? 'dismissal_cooldown' : 'shown_today',
			});
			return true;
		},
		[suppression],
	);

	const onClick = useCallback(() => finish('clicked'), [finish]);
	const onDismiss = useCallback(() => {
		finish('dismissed');
	}, [finish]);

	return {
		...eligibility,
		isEligible: eligibility.isEligible && gateEnabled && isOpportunity && !!suppression,
		provider,
		product: hostProduct,
		onShown,
		onClick,
		onDismiss,
	};
}
