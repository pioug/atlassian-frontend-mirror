/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { iconGoogleDrive } from '@atlaskit/link-test-helpers/smart-card/images';
import { GoogleDoc } from '@atlaskit/link-test-helpers/smart-card/mocks/gdrive';

import { Card } from '../../src';
import type { InternalCardActionOptions } from '../../src/view/Card/types';
import useVrExperimentGateConfig from '../utils/use-vr-experiment-gate-config';
import VRTestWrapper from '../utils/vr-test-wrapper';
// Statically import the lazy embed footer so the snapshot captures the loaded state.
import '../../src/view/EmbedCard/components/rovo-actions-footer';

const REMIX_KILL_SWITCH = 'platform_sl_3p_auth_visualize_killswitch';
const REMIX_EXPERIMENT = 'platform_sl_3p_auth_visualize_exp';
const SUMMARIZE_ICON_CONSISTENCY = 'platform_sl_rovo_summarize_icon_consistency';

const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/vr-google-sheets-visualize/edit';

const googleSheetResponse = {
	...GoogleDoc,
	data: {
		...GoogleDoc.data,
		'@type': ['Document', 'schema:SpreadsheetDigitalDocument'],
		// Replace remote images with local ones: VR fails on non-local network requests.
		icon: iconGoogleDrive,
		generator: { '@type': 'Application', name: 'Google Drive', icon: iconGoogleDrive },
		attributedTo: { '@type': 'Person', name: 'Atlas' },
		'atlassian:updatedBy': { '@type': 'Person', name: 'Atlas' },
		name: 'Quarterly revenue',
		url: googleSheetUrl,
	},
	meta: {
		...GoogleDoc.meta,
		supportedFeature: [...new Set([...(GoogleDoc.meta.supportedFeature ?? []), 'RovoActions'])],
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;

class GoogleSheetClient extends CardClient {
	fetchData(_: string) {
		return Promise.resolve(googleSheetResponse);
	}
}

const embedWrapperStyles = css({
	width: '760px',
});

const actionOptions: InternalCardActionOptions = {
	hide: false,
	rovoChatAction: { optIn: true },
	remixAction: { optIn: true },
};

type Appearance = 'inline' | 'block' | 'embed';

type RemixExample = {
	(): JSX.Element;
	displayName: string;
};

const createRemixExample = (
	name: string,
	appearance: Appearance,
	isRemixEnabled: boolean,
	isRovoChatActionOptedIn = true,
): RemixExample => {
	const exampleActionOptions: InternalCardActionOptions = {
		...actionOptions,
		rovoChatAction: { optIn: isRovoChatActionOptedIn },
	};
	const Example = (): JSX.Element => {
		const revision = useVrExperimentGateConfig({
			experiments: [{ key: REMIX_EXPERIMENT, value: { isEnabled: isRemixEnabled } }],
			gates: [
				{ key: REMIX_KILL_SWITCH, value: isRemixEnabled },
				// Summarize uses the same icon across inline, block and embed.
				{ key: SUMMARIZE_ICON_CONSISTENCY, value: true },
			],
		});

		if (!revision) {
			return <VRTestWrapper />;
		}

		const card = (
			<SmartCardProvider
				client={new GoogleSheetClient()}
				product="CONFLUENCE"
				plugins={{ resolve: () => ({ remix: { isAvailable: () => true, open: () => {} } }) }}
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
			>
				<Card
					actionOptions={exampleActionOptions}
					appearance={appearance}
					url={googleSheetUrl}
					// Inline Rovo action CTA requires hover preview (see useInlineTailoredAction).
					{...(appearance === 'inline' ? { showHoverPreview: true } : {})}
					{...(appearance === 'embed' ? { frameStyle: 'show', platform: 'web' } : {})}
				/>
			</SmartCardProvider>
		);

		return (
			<VRTestWrapper>
				<div key={revision} css={[appearance === 'embed' && embedWrapperStyles]}>
					{card}
				</div>
			</VRTestWrapper>
		);
	};

	Example.displayName = name;

	return Example;
};

export const VRInlineCardGoogleSheetsRemix: RemixExample = createRemixExample(
	'VRInlineCardGoogleSheetsRemix',
	'inline',
	true,
);
export const VRInlineCardGoogleSheetsRemixOff: RemixExample = createRemixExample(
	'VRInlineCardGoogleSheetsRemixOff',
	'inline',
	false,
);
export const VRBlockCardGoogleSheetsRemix: RemixExample = createRemixExample(
	'VRBlockCardGoogleSheetsRemix',
	'block',
	true,
);
export const VRBlockCardGoogleSheetsRemixOff: RemixExample = createRemixExample(
	'VRBlockCardGoogleSheetsRemixOff',
	'block',
	false,
);
export const VREmbedCardGoogleSheetsRemix: RemixExample = createRemixExample(
	'VREmbedCardGoogleSheetsRemix',
	'embed',
	true,
);
export const VREmbedCardGoogleSheetsRemixOff: RemixExample = createRemixExample(
	'VREmbedCardGoogleSheetsRemixOff',
	'embed',
	false,
);

export const VRInlineCardGoogleSheetsRemixWithoutRovoChat: RemixExample = createRemixExample(
	'VRInlineCardGoogleSheetsRemixWithoutRovoChat',
	'inline',
	true,
	false,
);
export const VRBlockCardGoogleSheetsRemixWithoutRovoChat: RemixExample = createRemixExample(
	'VRBlockCardGoogleSheetsRemixWithoutRovoChat',
	'block',
	true,
	false,
);
export const VREmbedCardGoogleSheetsRemixWithoutRovoChat: RemixExample = createRemixExample(
	'VREmbedCardGoogleSheetsRemixWithoutRovoChat',
	'embed',
	true,
	false,
);
