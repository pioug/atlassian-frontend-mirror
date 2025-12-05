import React, { useCallback, useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import FeatureGates, { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const experimentConfig: Record<string, { cohort: string }> = {
	platform_sl_3p_unauth_paste_as_block_card: {
		cohort: 'card_by_default_and_new_design',
	},
};

const boxStyles = cssMap({
	root: {
		margin: '0 auto',
	},
});

const DEFAULT_MAX_WIDTH = '700px';

const ExampleContainer = ({
	children,
	maxWidth = DEFAULT_MAX_WIDTH,
	title,
}: {
	children: React.ReactNode;
	maxWidth?: string;
	title: string;
}): React.JSX.Element => {
	const [initialized, setInitialized] = useState(FeatureGates.initializeCompleted());

	const initFGs = useCallback(async () => {
		if (initialized) {
			return;
		}
		const formValues = {
			environment: FeatureGateEnvironment.Development,
			localMode: true,
			targetApp: '',
		};
		await FeatureGates.initializeFromValues(formValues, {});
		setInitialized(true);
		Object.entries(experimentConfig).forEach(([name, config]) => {
			FeatureGates.overrideConfig(name, config);
		});
	}, [initialized]);

	useEffect(() => {
		void initFGs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!initialized) {
		return <div>Loading...</div>;
	}

	return (
		<IntlProvider locale="en">
			<Box paddingBlock="space.400" style={{ maxWidth }} xcss={boxStyles.root}>
				<Stack space="space.200">
					<h1>{title}</h1>
					{children}
				</Stack>
			</Box>
		</IntlProvider>
	);
};

export default ExampleContainer;
