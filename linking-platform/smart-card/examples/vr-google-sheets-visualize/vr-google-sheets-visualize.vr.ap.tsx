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
import useVrExperimentGateConfig from '../utils/use-vr-experiment-gate-config';
import VRTestWrapper from '../utils/vr-test-wrapper';
// Statically import the lazy embed footer so the snapshot captures the loaded state.
import '../../src/view/EmbedCard/components/rovo-actions-footer';

const VISUALIZE_KILL_SWITCH = 'platform_sl_3p_auth_visualize_killswitch';
const VISUALIZE_EXPERIMENT = 'platform_sl_3p_auth_visualize_exp';
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

type Appearance = 'inline' | 'block' | 'embed';

type VisualizeExample = {
	(): JSX.Element;
	displayName: string;
};

const createVisualizeExample = (
	name: string,
	appearance: Appearance,
	isVisualizeEnabled: boolean,
): VisualizeExample => {
	const Example = (): JSX.Element => {
		const revision = useVrExperimentGateConfig({
			experiments: [{ key: VISUALIZE_EXPERIMENT, value: { isEnabled: isVisualizeEnabled } }],
			gates: [
				{ key: VISUALIZE_KILL_SWITCH, value: isVisualizeEnabled },
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
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
			>
				<Card
					actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
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

export const VRInlineCardGoogleSheetsVisualize: VisualizeExample = createVisualizeExample(
	'VRInlineCardGoogleSheetsVisualize',
	'inline',
	true,
);
export const VRInlineCardGoogleSheetsVisualizeOff: VisualizeExample = createVisualizeExample(
	'VRInlineCardGoogleSheetsVisualizeOff',
	'inline',
	false,
);
export const VRBlockCardGoogleSheetsVisualize: VisualizeExample = createVisualizeExample(
	'VRBlockCardGoogleSheetsVisualize',
	'block',
	true,
);
export const VRBlockCardGoogleSheetsVisualizeOff: VisualizeExample = createVisualizeExample(
	'VRBlockCardGoogleSheetsVisualizeOff',
	'block',
	false,
);
export const VREmbedCardGoogleSheetsVisualize: VisualizeExample = createVisualizeExample(
	'VREmbedCardGoogleSheetsVisualize',
	'embed',
	true,
);
export const VREmbedCardGoogleSheetsVisualizeOff: VisualizeExample = createVisualizeExample(
	'VREmbedCardGoogleSheetsVisualizeOff',
	'embed',
	false,
);
