import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import { currentSiteCloudIdService } from '../src/state/services/current-site-cloud-id';
import { personalizationConstants } from '../src/state/services/personalization/constants';
import { preAuthValuePropositionModalService } from '../src/state/services/pre-auth-value-proposition-modal';
import { PreAuthValuePropositionModal } from '../src/view/PreAuthValuePropositionModal';
import ExampleContainer from './utils/example-container';

type ModalVariant = 'modal_text_only' | 'modal_with_image';

const exampleUrl = 'https://drive.google.com/file/d/example';
const exampleCloudId = 'pre-auth-value-proposition-modal-example';
const client = new UnAuthClient();
const personalizationStorage = new StorageClient(
	personalizationConstants.PERSONALIZATION_STORAGE_SCOPE,
);

const seedSocialProofForGoogle = () => {
	currentSiteCloudIdService.persistStoredCloudId(exampleCloudId);
	personalizationStorage.setItemWithExpiry(
		`${personalizationConstants.PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX}${encodeURIComponent(
			exampleCloudId,
		)}:${encodeURIComponent(personalizationConstants.SOCIAL_PROOF_TRAIT_NAME)}`,
		{ 'google-object-provider': 45 },
		personalizationConstants.PERSONALIZATION_PROVIDER_PCT_TTL_MS,
	);
};

const VariantButtonsExample = (): React.JSX.Element => {
	const [openVariant, setOpenVariant] = useState<ModalVariant | null>(null);

	const openModal = (variant: ModalVariant) => {
		FeatureGates.overrideConfig('platform_sl_3p_preauth_value_modal', { variant });
		seedSocialProofForGoogle();
		preAuthValuePropositionModalService.reset();
		setOpenVariant(variant);
	};

	return (
		<SmartCardProvider client={client}>
			<Stack space="space.200">
				<Flex gap="space.100">
					<Button appearance="primary" onClick={() => openModal('modal_text_only')}>
						Open text-only modal
					</Button>
					<Button appearance="primary" onClick={() => openModal('modal_with_image')}>
						Open modal with image
					</Button>
				</Flex>
				{openVariant ? (
					<PreAuthValuePropositionModal url={exampleUrl} onFinished={() => setOpenVariant(null)} />
				) : null}
			</Stack>
		</SmartCardProvider>
	);
};

export default (): React.JSX.Element => (
	<ExampleContainer title="Pre-auth value proposition modal">
		<VariantButtonsExample />
	</ExampleContainer>
);
