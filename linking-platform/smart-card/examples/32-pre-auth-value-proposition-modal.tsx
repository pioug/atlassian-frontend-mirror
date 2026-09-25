import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { StorageClient } from '@atlaskit/frontend-utilities/StorageClient';
import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
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

// Overrides the mocked provider name with a very long value, so this example can demonstrate
// title wrapping, connect-button truncation, and illustration growth for long provider names.
class LongProviderNameUnAuthClient extends UnAuthClient {
	async fetchData(url: string): Promise<JsonLd.Response> {
		const response = await super.fetchData(url);

		if (!response.data || !('generator' in response.data)) {
			return response;
		}

		const generator = response.data.generator;
		if (!generator || typeof generator !== 'object') {
			return response;
		}

		return {
			...response,
			data: {
				...response.data,
				generator: {
					...generator,
					name: 'Google Drive Megalong Name Variant',
				},
			},
		};
	}
}

const exampleUrl = 'https://drive.google.com/file/d/example';
const exampleCloudId = 'pre-auth-value-proposition-modal-example';
const client = new UnAuthClient();
const longProviderNameClient = new LongProviderNameUnAuthClient();
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
	const [useLongProviderName, setUseLongProviderName] = useState(false);

	const openModal = (variant: ModalVariant, longProviderName = false) => {
		FeatureGates.overrideConfig('platform_sl_3p_preauth_value_modal', { variant });
		seedSocialProofForGoogle();
		preAuthValuePropositionModalService.reset();
		setUseLongProviderName(longProviderName);
		setOpenVariant(variant);
	};

	return (
		<SmartCardProvider
			// Both mocks use the same URL; remount to discard the other provider name's cached response.
			key={useLongProviderName ? 'long-provider-name' : 'normal-provider-name'}
			client={useLongProviderName ? longProviderNameClient : client}
		>
			<Stack space="space.200">
				<Flex gap="space.100">
					<Button appearance="primary" onClick={() => openModal('modal_text_only')}>
						Open text-only modal
					</Button>
					<Button appearance="primary" onClick={() => openModal('modal_with_image')}>
						Open modal with image
					</Button>
					<Button appearance="primary" onClick={() => openModal('modal_with_image', true)}>
						Open modal with very long provider name
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
