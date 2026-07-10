/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import FeatureGates, {
	FeatureGateEnvironment,
} from '@atlaskit/feature-gate-js-client/feature-gates';
import type { JsonLd } from '@atlaskit/json-ld-types';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/provider';
import { GoogleDoc, GoogleDocUrl, iconGoogleDrive } from '@atlaskit/link-test-helpers';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import {
	setupEditorExperiments,
	type EditorExperimentOverrides,
} from '@atlaskit/tmp-editor-statsig/setup';

import { Card } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';

// Statically import the lazy footer so the snapshot captures the loaded state.
import '../../src/view/EmbedCard/components/rovo-actions-footer';

const EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY = 'platform_sl_3p_auth_rovo_embed_footer_exp';
const EMBED_ROVO_ACTIONS_FOOTER_KILL_SWITCH = 'platform_sl_3p_auth_rovo_embed_footer_kill_switch';

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

type RovoActionsFooterGateConfig = {
	isExperimentEnabled: boolean;
	isKillSwitchEnabled: boolean;
};

const useRovoActionsFooterGateConfig = ({
	isExperimentEnabled,
	isKillSwitchEnabled,
}: RovoActionsFooterGateConfig): number => {
	const [revision, setRevision] = useState(0);

	useEffect(() => {
		let cancelled = false;

		const setup = async () => {
			await FeatureGates.initializeFromValues(
				{
					environment: FeatureGateEnvironment.Development,
					localMode: true,
					targetApp: '',
				},
				{},
			);

			FeatureGates.clearAllOverrides();
			FeatureGates.overrideConfig(EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY, {
				isEnabled: isExperimentEnabled,
			});
			FeatureGates.overrideGate(EMBED_ROVO_ACTIONS_FOOTER_KILL_SWITCH, isKillSwitchEnabled);
			setupEditorExperiments(
				'test',
				{
					[EMBED_ROVO_ACTIONS_FOOTER_EXPERIMENT_KEY]: isExperimentEnabled,
				} as EditorExperimentOverrides,
				undefined,
				{ disableTestOverrides: true },
			);

			setBooleanFeatureFlagResolver((flagKey) => {
				if (flagKey === EMBED_ROVO_ACTIONS_FOOTER_KILL_SWITCH) {
					return isKillSwitchEnabled;
				}

				// `fg()` delegates to this resolver, so read the local FeatureGates overrides directly.
				// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
				return FeatureGates.checkGate(flagKey);
			});

			if (!cancelled) {
				setRevision((revision) => revision + 1);
			}
		};

		void setup();

		return () => {
			cancelled = true;
		};
	}, [isExperimentEnabled, isKillSwitchEnabled]);

	return revision;
};

type RovoActionsFooterComponent = {
	(): JSX.Element;
	displayName: string;
};

const createVREmbedCardResolvedRovoActionsFooter = (
	name: string,
	config: RovoActionsFooterGateConfig,
): RovoActionsFooterComponent => {
	const VREmbedCardResolvedRovoActionsFooter = (): JSX.Element => {
		const gateRevision = useRovoActionsFooterGateConfig(config);

		if (!gateRevision) {
			return <VRTestWrapper />;
		}

		return (
			<VRTestWrapper>
				<div key={gateRevision} css={embedWrapperStyles}>
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
	};

	VREmbedCardResolvedRovoActionsFooter.displayName = name;

	return VREmbedCardResolvedRovoActionsFooter;
};

export const VREmbedCardResolvedRovoActionsFooterEnabled: RovoActionsFooterComponent =
	createVREmbedCardResolvedRovoActionsFooter('VREmbedCardResolvedRovoActionsFooterEnabled', {
		isExperimentEnabled: true,
		isKillSwitchEnabled: true,
	});

export const VREmbedCardResolvedRovoActionsFooterExperimentOff: RovoActionsFooterComponent =
	createVREmbedCardResolvedRovoActionsFooter('VREmbedCardResolvedRovoActionsFooterExperimentOff', {
		isExperimentEnabled: false,
		isKillSwitchEnabled: true,
	});

export const VREmbedCardResolvedRovoActionsFooterKillSwitchOff: RovoActionsFooterComponent =
	createVREmbedCardResolvedRovoActionsFooter('VREmbedCardResolvedRovoActionsFooterKillSwitchOff', {
		isExperimentEnabled: true,
		isKillSwitchEnabled: false,
	});

export const VREmbedCardResolvedRovoActionsFooterDisabled: RovoActionsFooterComponent =
	createVREmbedCardResolvedRovoActionsFooter('VREmbedCardResolvedRovoActionsFooterDisabled', {
		isExperimentEnabled: false,
		isKillSwitchEnabled: false,
	});

const VREmbedCardResolvedRovoActionsFooter: RovoActionsFooterComponent = (): JSX.Element => {
	return <VREmbedCardResolvedRovoActionsFooterEnabled />;
};

VREmbedCardResolvedRovoActionsFooter.displayName = 'VREmbedCardResolvedRovoActionsFooter';

export default VREmbedCardResolvedRovoActionsFooter;
