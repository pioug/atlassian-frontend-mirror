import { useCallback, useEffect, useMemo, useState } from 'react';

import FeatureGates, { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';

const experimentConfig: Record<string, Parameters<(typeof FeatureGates)['overrideConfig']>[1]> = {
	platform_sl_3p_unauth_paste_as_block_card: {
		cohort: 'card_by_default_and_new_design',
	},
	platform_sl_3p_auth_rovo_action: {
		isEnabled: true,
	},
};

const useFeatureGateOverrideConfig = () => {
	const [ready, setReady] = useState(FeatureGates.initializeCompleted());

	const initFGs = useCallback(async () => {
		if (ready) {
			return;
		}

		const formValues = {
			environment: FeatureGateEnvironment.Development,
			localMode: true,
			targetApp: '',
		};
		await FeatureGates.initializeFromValues(formValues, {});

		setReady(true);

		Object.entries(experimentConfig).forEach(([name, config]) => {
			FeatureGates.overrideConfig(name, config);
			console.log(`Override ${name}: ${JSON.stringify(config)}`);
		});
	}, [ready]);

	useEffect(() => {
		void initFGs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return useMemo(() => ({ ready }), [ready]);
};

export default useFeatureGateOverrideConfig;
