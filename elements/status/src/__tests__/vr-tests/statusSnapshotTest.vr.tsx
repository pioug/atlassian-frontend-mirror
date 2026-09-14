import { snapshot } from '@af/visual-regression';
import SimpleStatus from '../../../examples/00-simple-status.vr.ap';
import SimpleBoldStatus from '../../../examples/00-simple-bold-status.vr.ap';
import {
	NeutralStatus,
	PurpleStatus,
	BlueStatus,
	RedStatus,
	YellowStatus,
	GreenStatus,
} from '../../../examples/01-status-picker.vr.ap';

snapshot(SimpleStatus, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'platform-lozenge-custom-letterspacing': true,
	},
});
snapshot(SimpleBoldStatus, {
	featureFlags: {
		'platform-component-visual-refresh': false,
		'platform-lozenge-custom-letterspacing': true,
	},
});
snapshot(NeutralStatus);
snapshot(PurpleStatus);
snapshot(BlueStatus);
snapshot(RedStatus);
snapshot(YellowStatus);
snapshot(GreenStatus);
