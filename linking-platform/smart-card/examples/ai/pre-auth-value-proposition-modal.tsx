import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { PreAuthValuePropositionModal } from '@atlaskit/smart-card/pre-auth-value-proposition-modal';

type Props = {
	/** The product's existing choreographer adapter. */
	choreographer: NonNullable<React.ComponentProps<typeof SmartCardProvider>['choreographer']>;
	client: React.ComponentProps<typeof SmartCardProvider>['client'];
	/** The host decides whether this unauthorized resource is eligible for the prompt. */
	isEligible: boolean;
	/** The host passes true only when its feature configuration enables the modal variant. */
	isVariantEnabled: boolean;
};

/** Host integration example: the resolver must return an eligible unauthorized provider response. */
export default function PreAuthModalExample({
	client,
	choreographer,
	isVariantEnabled,
	isEligible,
}: Props): React.JSX.Element | null {
	if (!isVariantEnabled || !isEligible) {
		return null;
	}
	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={client} choreographer={choreographer}>
				<PreAuthValuePropositionModal
					url="https://drive.google.com/file/d/example"
					onFinished={() => {
						/* Return control to the host flow. */
					}}
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
}
