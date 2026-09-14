import React, { useEffect } from 'react';

import { IntlProvider } from 'react-intl';

import { iconGoogleDrive } from '@atlaskit/link-test-helpers';

import useActionFlags from '../../src/state/hooks/use-action-flags';
import VRTestWrapper from '../utils/vr-test-wrapper';

const MockComponent = () => {
	const { showConnectFlag } = useActionFlags();

	useEffect(() => {
		// Defer to a macrotask so showFlag's flushSync runs outside React's lifecycle phase.
		// This ensures the slide-in animation fires correctly for the first flag.
		const timer = setTimeout(() => {
			showConnectFlag({
				id: 'vr-connect-success-flag',
				provider: { text: 'Google', icon: iconGoogleDrive },
			});
		}, 0);
		return () => clearTimeout(timer);
	}, [showConnectFlag]);

	return null;
};

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<IntlProvider locale="en">
			<MockComponent />
		</IntlProvider>
	</VRTestWrapper>
);
