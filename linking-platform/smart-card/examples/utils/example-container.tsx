import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';

import useFeatureGateOverrideConfig from './use-feature-gate-override-config';

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
	withExperiments = true,
}: {
	children: React.ReactNode;
	maxWidth?: string;
	title?: string;
	withExperiments?: boolean;
}): React.JSX.Element => {
	const gateRevision = useFeatureGateOverrideConfig(withExperiments);

	if (!gateRevision) {
		return <div>Loading...</div>;
	}

	return (
		<IntlProvider locale="en">
			<Box key={gateRevision} paddingBlock="space.400" style={{ maxWidth }} xcss={boxStyles.root}>
				<Stack space="space.200">
					{title && <h1>{title}</h1>}
					{children}
				</Stack>
			</Box>
		</IntlProvider>
	);
};

export default ExampleContainer;
