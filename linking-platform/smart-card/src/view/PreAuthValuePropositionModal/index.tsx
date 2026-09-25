/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import type { KeyboardOrMouseEvent } from '@atlaskit/modal-dialog/types';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { messages as smartCardMessages } from '../../messages';
import { getExtensionKey, getServices } from '../../state/helpers';
import useSocialProof from '../../state/hooks/use-social-proof';
import { useSmartLink } from '../../state/hooks/useSmartLink';
import { preAuthValuePropositionModalService } from '../../state/services/pre-auth-value-proposition-modal';
import { SmartLinkAnalyticsContext } from '../../utils/analytics/SmartLinkAnalyticsContext';
import ImageIcon from '../common/image-icon';

const IllustrationPane = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_smart-card-pre-auth-value-proposition-illustration" */ './IllustrationPane'
		),
);

const SOCIAL_PROOF_TEAM_PREVIEW_THRESHOLD = 30;
const SMART_LINK_MODAL_ID = 'pre-auth-value-proposition-modal';

type PreAuthModalVariant = 'modal_text_only' | 'modal_with_image';

const messages = defineMessages({
	close: {
		id: 'smart-card.view.PreAuthValuePropositionModal.close',
		defaultMessage: 'Close',
		description: 'Closes the pre-auth value proposition modal.',
	},
	connect: {
		id: 'smart-card.view.PreAuthValuePropositionModal.connect',
		defaultMessage: 'Connect {providerName}',
		description:
			'Connect button in the pre-auth value proposition modal. providerName is supplied by the Smart Link response.',
	},
	embedBenefit: {
		id: 'smart-card.view.PreAuthValuePropositionModal.embedBenefit',
		defaultMessage: '<b>Embed</b> richer link previews without leaving your workflow',
		description:
			'Explains the benefit of embedding richer Smart Link previews without leaving the current workflow.',
	},
	searchBenefit: {
		id: 'smart-card.view.PreAuthValuePropositionModal.searchBenefit',
		defaultMessage: '<b>Search</b> across {providerName} and Atlassian content in one place',
		description:
			'Explains the cross-product search benefit. providerName is supplied by the Smart Link response.',
	},
	seeBenefit: {
		id: 'smart-card.view.PreAuthValuePropositionModal.seeBenefit',
		defaultMessage: '<b>See</b> Rovo answers grounded in your {providerName} content',
		description: 'Explains the Rovo benefit. providerName is supplied by the Smart Link response.',
	},
	title: {
		id: 'smart-card.view.PreAuthValuePropositionModal.title',
		defaultMessage: 'Connect {providerName}',
		description:
			'Title for the pre-auth value proposition modal. providerName is supplied by the Smart Link response.',
	},
});

const styles = cssMap({
	bodyCopy: {
		width: '320px',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		height: '100%',
		paddingBottom: token('space.500'),
		paddingLeft: token('space.500'),
		paddingRight: token('space.500'),
		paddingTop: token('space.500'),
	},
	copyColumn: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		gap: token('space.200'),
	},
	leftPane: {
		display: 'flex',
		flexDirection: 'column',
		flexShrink: 0,
		width: '400px',
	},
	providerIcon: {
		alignItems: 'center',
		display: 'flex',
		flexShrink: 0,
	},
	// Lets the primary button shrink (and its label ellipsis) instead of growing to fit an
	// arbitrarily long provider name, so the close button below always keeps its full,
	// un-squeezed size.
	primaryButton: {
		flexShrink: 1,
		minWidth: 0,
	},
	secondaryButton: {
		flexShrink: 0,
	},
	splitLayout: {
		alignItems: 'stretch',
		borderRadius: 'inherit',
		display: 'flex',
		height: '100%',
		overflow: 'hidden',
	},
});

const bold = (chunks: React.ReactNode): JSX.Element => <Text as="strong">{chunks}</Text>;

const getModalCloseMethod = (event: KeyboardOrMouseEvent): 'escape' | 'overlay' =>
	'key' in event && event.key === 'Escape' ? 'escape' : 'overlay';

type ModalCopyProps = {
	connectedPct?: number;
	isSocialProofAvailable: boolean;
	onClose: () => void;
	onConnect: () => void;
	providerIcon: React.ReactNode;
	providerName: string;
};

const ModalCopy = ({
	connectedPct,
	isSocialProofAvailable,
	onClose,
	onConnect,
	providerIcon,
	providerName,
}: ModalCopyProps): JSX.Element => {
	const messageValues = { b: bold, providerName };
	const isSocialProofUsageHighEnough =
		connectedPct !== undefined && connectedPct >= SOCIAL_PROOF_TEAM_PREVIEW_THRESHOLD;

	return (
		<ModalBody hasInlinePadding={false}>
			<Box xcss={styles.content}>
				<Box xcss={styles.copyColumn}>
					<Stack space="space.250">
						{providerIcon && <Box xcss={styles.providerIcon}>{providerIcon}</Box>}
						<ModalTitle isMultiline>
							<Heading as="span" color="color.text" size="large">
								<FormattedMessage {...messages.title} values={{ providerName }} />
							</Heading>
						</ModalTitle>
					</Stack>
					<Box xcss={styles.bodyCopy}>
						<Stack space="space.200">
							<Text as="p" color="color.text" size="large">
								<FormattedMessage {...messages.seeBenefit} values={messageValues} />
							</Text>
							<Text as="p" color="color.text" size="large">
								<FormattedMessage {...messages.searchBenefit} values={messageValues} />
							</Text>
							<Text as="p" color="color.text" size="large">
								<FormattedMessage {...messages.embedBenefit} values={messageValues} />
							</Text>
						</Stack>
					</Box>
				</Box>
				{isSocialProofAvailable && (
					<Text
						as="p"
						color="color.text.subtlest"
						size="small"
						testId="pre-auth-value-proposition-modal-social-proof"
					>
						{isSocialProofUsageHighEnough ? (
							<FormattedMessage
								{...smartCardMessages.social_proof_inline_cta_tag_high_with_context}
								values={{ connectedPct, context: providerName, b: bold }}
							/>
						) : (
							<FormattedMessage
								{...smartCardMessages.social_proof_inline_cta_tag_low_with_context}
								values={{ context: providerName }}
							/>
						)}
					</Text>
				)}
				<Flex gap="space.075" justifyContent="start">
					<Box xcss={styles.primaryButton}>
						<Button
							appearance="primary"
							onClick={onConnect}
							autoFocus
							shouldFitContainer
							spacing="default"
						>
							<FormattedMessage {...messages.connect} values={{ providerName }} />
						</Button>
					</Box>
					<Box xcss={styles.secondaryButton}>
						<Button appearance="subtle" onClick={onClose}>
							<FormattedMessage {...messages.close} />
						</Button>
					</Box>
				</Flex>
			</Box>
		</ModalBody>
	);
};

export type PreAuthValuePropositionModalProps = {
	onFinished: () => void;
	/** Called when the modal becomes visible, and with false on close or unmount. */
	onOpenChange?: (isOpen: boolean) => void;
	url: string;
};

const PreAuthValuePropositionModalContent = ({
	onFinished,
	onOpenChange,
	url,
}: PreAuthValuePropositionModalProps): JSX.Element | null => {
	const { actions, config, state } = useSmartLink(SMART_LINK_MODAL_ID, url, 'inline');
	const { fireEvent } = useAnalyticsEvents();
	const [isOpen, setIsOpen] = useState(false);
	const [visibleVariant, setVisibleVariant] = useState<PreAuthModalVariant>('modal_text_only');
	const modalOpenTimeRef = useRef<number>(Date.now());
	const provider = useMemo(() => extractSmartLinkProvider(state.details), [state.details]);
	const providerName = provider?.text;
	const isVisible = isOpen && Boolean(providerName);

	useEffect(() => {
		if (!isVisible) {
			return;
		}

		onOpenChange?.(true);
		return () => onOpenChange?.(false);
	}, [isVisible, onOpenChange]);
	const providerIconUrl = typeof provider?.icon === 'string' ? provider.icon : undefined;
	const renderProviderIcon = (size: number, testId?: string, label?: string): React.ReactNode => {
		if (providerIconUrl) {
			const sizePx = `${size}px`;
			return (
				<ImageIcon
					height={sizePx}
					hideLoadingSkeleton={true}
					label={label ?? ''}
					testId={testId}
					url={providerIconUrl}
					width={sizePx}
				/>
			);
		}

		return provider?.icon;
	};
	const providerIcon = renderProviderIcon(
		24,
		'pre-auth-value-proposition-modal-provider-icon',
		provider?.iconLabel ?? providerName,
	);
	const services = getServices(state.details);
	const extensionKey = getExtensionKey(state.details);
	const { connectedPct, isEnabled: isSocialProofAvailable } = useSocialProof(extensionKey, true);

	const hasSupportedAuthorization = config?.authFlow !== 'disabled' && services.length > 0;
	const isBaseEligible =
		state.status === 'unauthorized' &&
		Boolean(providerName) &&
		Boolean(extensionKey) &&
		hasSupportedAuthorization;
	useEffect(() => {
		if (state.status === 'pending' || state.status === 'resolving') {
			return;
		}

		if (
			!isBaseEligible ||
			!extensionKey ||
			preAuthValuePropositionModalService.hasReachedShowLimit(extensionKey)
		) {
			onFinished();
			return;
		}

		const experimentVariant = expVal('platform_sl_3p_preauth_value_modal', 'variant', 'control');

		if (experimentVariant === 'modal_text_only' || experimentVariant === 'modal_with_image') {
			preAuthValuePropositionModalService.recordShow(extensionKey);
			setVisibleVariant(experimentVariant);
			setIsOpen(true);
			return;
		}

		onFinished();
	}, [extensionKey, isBaseEligible, onFinished, state.status]);

	const dismissModal = useCallback(
		(closeMethod: 'button' | 'escape' | 'overlay') => {
			fireEvent('ui.modal.closed.preAuthValueProposition', {
				closeMethod,
				dwellTime: Date.now() - modalOpenTimeRef.current,
			});
			setIsOpen(false);
			onFinished();
		},
		[fireEvent, onFinished],
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
		modalOpenTimeRef.current = Date.now();
		fireEvent('ui.modal.opened.preAuthValueProposition', {});
	}, [fireEvent]);

	const connectAccount = useCallback(() => {
		fireEvent('track.applicationAccount.authStarted', {});
		setIsOpen(false);
		actions.authorize('inline');
		onFinished();
	}, [actions, fireEvent, onFinished]);

	if (!isOpen || !providerName) {
		return null;
	}

	const modalCopy = (
		<ModalCopy
			connectedPct={connectedPct}
			isSocialProofAvailable={isSocialProofAvailable}
			onClose={handleCloseButton}
			onConnect={connectAccount}
			providerIcon={providerIcon}
			providerName={providerName}
		/>
	);
	const showIllustration = visibleVariant === 'modal_with_image';

	return (
		<ModalTransition>
			<Modal
				onClose={handleModalClose}
				onOpenComplete={handleOpenComplete}
				testId="pre-auth-value-proposition-modal"
				width={showIllustration ? 800 : 400}
			>
				{showIllustration ? (
					<Box xcss={styles.splitLayout}>
						<Box xcss={styles.leftPane}>{modalCopy}</Box>
						<Suspense fallback={null}>
							<IllustrationPane renderProviderIcon={renderProviderIcon} />
						</Suspense>
					</Box>
				) : (
					modalCopy
				)}
			</Modal>
		</ModalTransition>
	);
};

export const PreAuthValuePropositionModal = ({
	onFinished,
	onOpenChange,
	url,
}: PreAuthValuePropositionModalProps): JSX.Element => (
	<SmartLinkAnalyticsContext
		display="inline"
		id={SMART_LINK_MODAL_ID}
		source="preAuthValuePropositionModal"
		url={url}
	>
		<PreAuthValuePropositionModalContent
			onFinished={onFinished}
			onOpenChange={onOpenChange}
			url={url}
		/>
	</SmartLinkAnalyticsContext>
);
