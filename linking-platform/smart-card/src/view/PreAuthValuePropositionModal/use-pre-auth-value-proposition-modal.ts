import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import type { KeyboardOrMouseEvent } from '@atlaskit/modal-dialog/types';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { getExtensionKey, getServices } from '../../state/helpers';
import useSocialProof from '../../state/hooks/use-social-proof';
import { useSmartLink } from '../../state/hooks/useSmartLink';
import { preAuthValuePropositionModalService } from '../../state/services/pre-auth-value-proposition-modal';

export const SMART_LINK_MODAL_ID = 'pre-auth-value-proposition-modal';

// Resolved meta.key values; SharePoint and OneDrive share the same provider.
const SUPPORTED_PROVIDER_KEYS = new Set([
	'google-object-provider',
	'onedrive-object-provider',
	'slack-object-provider',
	'github-object-provider',
]);

type PreAuthValuePropositionModalOptions = {
	onFinished: () => void;
	url: string;
};

type PreAuthModalVariant = 'modal_text_only' | 'modal_with_image';

type PreAuthValuePropositionModalModel = {
	connectedPct?: number;
	isSocialProofAvailable: boolean;
	onClose: (event: KeyboardOrMouseEvent) => void;
	onCloseButton: () => void;
	onConnect: () => void;
	onOpenComplete: () => void;
	provider: ReturnType<typeof extractSmartLinkProvider>;
	variant: PreAuthModalVariant;
};

type PreAuthValuePropositionModalState = {
	isActive: boolean;
	isEligible: boolean;
	modal: PreAuthValuePropositionModalModel;
	onUnavailable: () => void;
	shouldClaim: () => boolean;
};

const getModalCloseMethod = (event: KeyboardOrMouseEvent): 'escape' | 'overlay' =>
	'key' in event && event.key === 'Escape' ? 'escape' : 'overlay';

/**
 * Eligibility, assignment and modal actions for one URL attempt.
 * The existing choreographer adapter owns display permission and cleanup.
 */
export function usePreAuthValuePropositionModal({
	url,
	onFinished,
}: PreAuthValuePropositionModalOptions): PreAuthValuePropositionModalState {
	const { actions, config, state } = useSmartLink(SMART_LINK_MODAL_ID, url, 'inline');
	const { fireEvent } = useAnalyticsEvents();
	const [isRequested, setIsRequested] = useState(false);
	const finished = useRef(false);
	const hasOpened = useRef(false);
	const hasRecordedShow = useRef(false);
	const [visibleVariant, setVisibleVariant] = useState<PreAuthModalVariant>('modal_text_only');
	const modalOpenTimeRef = useRef<number>(Date.now());
	const provider = useMemo(() => extractSmartLinkProvider(state.details), [state.details]);
	const providerName = provider?.text;
	const services = getServices(state.details);
	const extensionKey = getExtensionKey(state.details);
	const { connectedPct, isEnabled: isSocialProofAvailable } = useSocialProof(extensionKey, true);

	const hasSupportedAuthorization = config?.authFlow !== 'disabled' && services.length > 0;
	const isBaseEligible =
		state.status === 'unauthorized' &&
		Boolean(providerName) &&
		SUPPORTED_PROVIDER_KEYS.has(extensionKey ?? '') &&
		hasSupportedAuthorization;
	const finishCoordinatedAttempt = useCallback(() => {
		if (finished.current) {
			return;
		}
		finished.current = true;
		setIsRequested(false);
		onFinished();
	}, [onFinished]);

	const handleUnavailable = useCallback(() => {
		if (finished.current) {
			return;
		}
		if (hasOpened.current) {
			fireEvent('ui.modal.closed.preAuthValueProposition', {
				closeMethod: 'coordinator',
				dwellTime: Date.now() - modalOpenTimeRef.current,
			});
		}
		finishCoordinatedAttempt();
	}, [fireEvent, finishCoordinatedAttempt]);

	const shouldClaim = useCallback(() => {
		// Recheck at offer time: another attempt may have consumed the cap while we waited.
		if (
			finished.current ||
			!isBaseEligible ||
			!extensionKey ||
			preAuthValuePropositionModalService.hasReachedShowLimit(extensionKey)
		) {
			return false;
		}
		const variant = expVal('platform_sl_3p_preauth_value_modal', 'variant', 'control');
		if (variant !== 'modal_text_only' && variant !== 'modal_with_image') {
			return false;
		}
		setVisibleVariant(variant);
		return true;
	}, [extensionKey, isBaseEligible]);

	// The editor mounts this flow only when platform_sl_3p_preauth_value_modal_killswitch is on.
	useEffect(() => {
		if (finished.current) {
			return;
		}
		if (state.status === 'pending' || state.status === 'resolving') {
			// A previously eligible link that starts resolving again must release its slot.
			if (isRequested) {
				handleUnavailable();
			}
			return;
		}
		if (!isBaseEligible || !extensionKey) {
			handleUnavailable();
			return;
		}
		if (!isRequested) {
			if (preAuthValuePropositionModalService.hasReachedShowLimit(extensionKey)) {
				finishCoordinatedAttempt();
			} else {
				setIsRequested(true);
			}
		}
	}, [
		extensionKey,
		isBaseEligible,
		state.status,
		isRequested,
		handleUnavailable,
		finishCoordinatedAttempt,
	]);

	const recordShowOnce = useCallback(() => {
		if (hasRecordedShow.current || !extensionKey) {
			return;
		}
		hasRecordedShow.current = true;
		preAuthValuePropositionModalService.recordShow(extensionKey);
	}, [extensionKey]);

	const dismissModal = useCallback(
		(closeMethod: 'button' | 'escape' | 'overlay') => {
			if (finished.current) {
				return;
			}
			// A user can dismiss the visible modal before its entrance animation completes.
			recordShowOnce();
			fireEvent('ui.modal.closed.preAuthValueProposition', {
				closeMethod,
				dwellTime: Date.now() - modalOpenTimeRef.current,
			});
			finishCoordinatedAttempt();
		},
		[fireEvent, finishCoordinatedAttempt, recordShowOnce],
	);

	const handleCloseButton = useCallback(() => {
		dismissModal('button');
	}, [dismissModal]);

	const handleModalClose = useCallback(
		(event: KeyboardOrMouseEvent) => {
			dismissModal(getModalCloseMethod(event));
		},
		[dismissModal],
	);

	const handleOpenComplete = useCallback(() => {
		if (finished.current || hasOpened.current || !extensionKey) {
			return;
		}
		hasOpened.current = true;
		recordShowOnce();
		modalOpenTimeRef.current = Date.now();
		fireEvent('ui.modal.opened.preAuthValueProposition', {});
	}, [fireEvent, extensionKey, recordShowOnce]);

	const connectAccount = useCallback(() => {
		if (finished.current) {
			return;
		}
		recordShowOnce();
		fireEvent('track.applicationAccount.authStarted', {});
		finishCoordinatedAttempt();
		actions.authorize('inline');
	}, [actions, fireEvent, finishCoordinatedAttempt, recordShowOnce]);

	return {
		isActive: isRequested,
		isEligible: isBaseEligible,
		onUnavailable: handleUnavailable,
		shouldClaim,
		modal: {
			provider,
			variant: visibleVariant,
			connectedPct,
			isSocialProofAvailable,
			onClose: handleModalClose,
			onCloseButton: handleCloseButton,
			onConnect: connectAccount,
			onOpenComplete: handleOpenComplete,
		},
	};
}
