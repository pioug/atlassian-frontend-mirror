import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
import { Box } from '@atlaskit/primitives/compiled/box';
import { PreAuthValuePropositionModal } from '@atlaskit/smart-card/pre-auth-value-proposition-modal';
import { token } from '@atlaskit/tokens';

import { preAuthValuePropositionModalService } from '../../src/state/services/pre-auth-value-proposition-modal';
import useVrExperimentGateConfig from '../utils/use-vr-experiment-gate-config';
const URL = 'https://drive.google.com/file/d/example';
const styles = cssMap({
	container: {
		minHeight: '560px',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element | null {
	const revision = useVrExperimentGateConfig({
		experiments: [
			{ key: 'platform_sl_3p_preauth_value_modal', value: { variant: 'modal_text_only' } },
		],
	});
	React.useEffect(() => {
		preAuthValuePropositionModalService.reset();
	}, []);
	if (!revision) return null;
	return (
		<Box testId="component-preview" xcss={styles.container}>
			<p aria-hidden="true">Provider connection prompt</p>
			<IntlProvider locale="en">
				<SmartCardProvider client={new UnAuthClient()}>
					<PreAuthValuePropositionModal url={URL} onFinished={() => undefined} />
				</SmartCardProvider>
			</IntlProvider>
		</Box>
	);
}
