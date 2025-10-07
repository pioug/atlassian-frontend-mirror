import { snapshot } from '@af/visual-regression';

import LinkUrlConnectButtonDefault from '../../../examples/vr-link-url/vr-link-url-connect-button-default';
import LinkUrlConnectButtonDirectUnauthorized from '../../../examples/vr-link-url/vr-link-url-connect-button-direct-unauthorized';
import LinkUrlConnectButtonResolved from '../../../examples/vr-link-url/vr-link-url-connect-button-resolved';

snapshot(LinkUrlConnectButtonDefault, {
	description: 'LinkUrl default state without connect button functionality',
	featureFlags: {},
});

snapshot(LinkUrlConnectButtonDirectUnauthorized, {
	description: 'LinkUrl unauthorized state with connect button (direct render - always visible)',
	featureFlags: {},
});

snapshot(LinkUrlConnectButtonResolved, {
	description: 'LinkUrl resolved state with feature flag enabled (should show no connect button)',
	featureFlags: {
		platform_editor_resolve_hyperlinks_killswitch: [true, false],
	},
	waitForReactLazy: true,
	waitForNetworkIdle: true,
});
