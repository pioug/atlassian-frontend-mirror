/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { iconGoogleDrive } from '@atlaskit/link-test-helpers/smart-card/images';
import { GoogleDoc, GoogleDocUrl } from '@atlaskit/link-test-helpers/smart-card/mocks/gdrive';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';
// Statically import the lazy footer so the snapshot captures the loaded state.
import '../../src/view/EmbedCard/components/rovo-actions-footer';

const googleDocWithRovoActions = {
	...GoogleDoc,
	data: {
		...GoogleDoc.data,
		icon: iconGoogleDrive,
	},
	meta: {
		...GoogleDoc.meta,
		supportedFeature: [...new Set([...(GoogleDoc.meta.supportedFeature ?? []), 'RovoActions'])],
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;

class RovoActionsEmbedClient extends CardClient {
	fetchData(_: string) {
		return Promise.resolve(googleDocWithRovoActions);
	}
}

const embedWrapperStyles = css({
	width: '760px',
});

type RovoActionsFooterComponent = {
	(): JSX.Element;
	displayName: string;
};

const VREmbedCardResolvedRovoActionsFooter: RovoActionsFooterComponent = (): JSX.Element => (
	<VRTestWrapper>
		<div css={embedWrapperStyles}>
			<SmartCardProvider
				client={new RovoActionsEmbedClient()}
				product="CONFLUENCE"
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
			>
				<Card
					actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
					appearance="embed"
					frameStyle="show"
					platform="web"
					url={GoogleDocUrl}
				/>
			</SmartCardProvider>
		</div>
	</VRTestWrapper>
);

VREmbedCardResolvedRovoActionsFooter.displayName = 'VREmbedCardResolvedRovoActionsFooter';

export default VREmbedCardResolvedRovoActionsFooter;
