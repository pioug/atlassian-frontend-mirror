import React from 'react';

import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';
import { SmartCardProvider } from '@atlaskit/link-provider/provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers';

import { currentSiteCloudIdService } from '../../src/state/services/current-site-cloud-id';
import { personalizationConstants } from '../../src/state/services/personalization/constants';
import { preAuthValuePropositionModalService } from '../../src/state/services/pre-auth-value-proposition-modal';
import { PreAuthValuePropositionModal } from '../../src/view/PreAuthValuePropositionModal';
import useVrExperimentGateConfig from '../utils/use-vr-experiment-gate-config';
import VRTestWrapper from '../utils/vr-test-wrapper';
// Preload the illustration chunk so the image variant does not flash an empty pane.
import '../../src/view/PreAuthValuePropositionModal/IllustrationPane';

const EXAMPLE_URL = 'https://drive.google.com/file/d/example';
const VR_CLOUD_ID = 'pre-auth-value-proposition-modal-vr';
const personalizationStorage = new StorageClient(
	personalizationConstants.PERSONALIZATION_STORAGE_SCOPE,
);

const seedSocialProofForGoogle = () => {
	currentSiteCloudIdService.persistStoredCloudId(VR_CLOUD_ID);
	personalizationStorage.setItemWithExpiry(
		`${personalizationConstants.PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(
			VR_CLOUD_ID,
		)}:${encodeURIComponent(personalizationConstants.SOCIAL_PROOF_TRAIT_NAME)}`,
		{ 'google-object-provider': 45 },
		personalizationConstants.PERSONALIZATION_PROVIDER_PCT_TTL_MS,
	);
};

// Warm the cache before the modal mounts. useSocialProof only reads localStorage
// on first mount and never applies the later personalization fetch to this visit.
seedSocialProofForGoogle();

type ModalVariant = 'modal_text_only' | 'modal_with_image';

type PreAuthValuePropositionModalVrComponent = {
	(): JSX.Element;
	displayName: string;
};

const createPreAuthValuePropositionModalVr = (
	displayName: string,
	variant: ModalVariant,
): PreAuthValuePropositionModalVrComponent => {
	const PreAuthValuePropositionModalVr = (): JSX.Element => {
		const gateRevision = useVrExperimentGateConfig({
			experiments: [
				{
					key: 'platform_sl_3p_preauth_value_modal',
					value: { variant },
				},
			],
		});

		if (!gateRevision) {
			return <VRTestWrapper />;
		}

		seedSocialProofForGoogle();
		preAuthValuePropositionModalService.reset();

		return (
			<VRTestWrapper
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					height: '700px',
				}}
			>
				<SmartCardProvider client={new UnAuthClient()}>
					<PreAuthValuePropositionModal onFinished={() => {}} url={EXAMPLE_URL} />
				</SmartCardProvider>
			</VRTestWrapper>
		);
	};

	PreAuthValuePropositionModalVr.displayName = displayName;

	return PreAuthValuePropositionModalVr;
};

export const PreAuthValuePropositionModalTextOnly: PreAuthValuePropositionModalVrComponent =
	createPreAuthValuePropositionModalVr('PreAuthValuePropositionModalTextOnly', 'modal_text_only');

export const PreAuthValuePropositionModalWithImage: PreAuthValuePropositionModalVrComponent =
	createPreAuthValuePropositionModalVr('PreAuthValuePropositionModalWithImage', 'modal_with_image');

const PreAuthValuePropositionModalVr: PreAuthValuePropositionModalVrComponent = () => (
	<PreAuthValuePropositionModalTextOnly />
);

PreAuthValuePropositionModalVr.displayName = 'PreAuthValuePropositionModalVr';

export default PreAuthValuePropositionModalVr;
