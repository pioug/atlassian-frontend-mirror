import { snapshot } from '@af/visual-regression';

import SimpleBoldStatus from '../../../examples/00-simple-bold-status.vr.ap';
import SimpleStatus from '../../../examples/00-simple-status.vr.ap';
import {
	NeutralStatus,
	PurpleStatus,
	BlueStatus,
	RedStatus,
	YellowStatus,
	GreenStatus,
} from '../../../examples/01-status-picker.vr.ap';
import HexStatus from '../../../examples/03-hex-status.vr.ap';

snapshot(SimpleStatus, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
});
snapshot(NeutralStatus);
snapshot(RedStatus);

snapshot(SimpleBoldStatus, {
	featureFlags: {
		'platform-component-visual-refresh': false,
	},
});
snapshot(PurpleStatus);
snapshot(BlueStatus);
snapshot(YellowStatus);
snapshot(GreenStatus);

snapshot(HexStatus, {
	description: 'Hex accent status chips',
	featureFlags: {
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
});
