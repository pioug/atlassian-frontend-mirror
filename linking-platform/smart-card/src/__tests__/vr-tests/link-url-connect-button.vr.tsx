import { snapshot } from '@af/visual-regression';

import LinkUrlConnectButtonDefault from '../../../examples/vr-link-url/vr-link-url-connect-button-default.vr.ap';

snapshot(LinkUrlConnectButtonDefault, {
	description: 'LinkUrl default state',
	featureFlags: {},
});
