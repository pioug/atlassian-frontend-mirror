import { snapshot } from '@af/visual-regression';
import SimpleStatus from '../../../examples/00-simple-status.vr.ap';
import SimpleBoldStatus from '../../../examples/00-simple-bold-status.vr.ap';
import HexStatus from '../../../examples/03-hex-status.vr.ap';
import {
	NeutralStatus,
	PurpleStatus,
	BlueStatus,
	RedStatus,
	YellowStatus,
	GreenStatus,
} from '../../../examples/01-status-picker.vr.ap';

const statusColorsEnabled = {
	platform_editor_gracefully_render_status_color: true,
	platform_editor_update_status_colors: true,
};

snapshot(SimpleStatus, {
	featureFlags: {
		...statusColorsEnabled,
		'platform-component-visual-refresh': true,
		'platform-lozenge-custom-letterspacing': true,
	},
});
snapshot(NeutralStatus, { featureFlags: statusColorsEnabled });
snapshot(RedStatus, { featureFlags: statusColorsEnabled });

snapshot(SimpleBoldStatus, {
	featureFlags: {
		'platform-component-visual-refresh': false,
		'platform-lozenge-custom-letterspacing': true,
	},
});
snapshot(PurpleStatus);
snapshot(BlueStatus);
snapshot(YellowStatus);
snapshot(GreenStatus);

snapshot(HexStatus, {
	description: 'Hex accent status chips',
	featureFlags: {
		platform_editor_gracefully_render_status_color: true,
		'platform-dst-lozenge-tag-badge-visual-uplifts': true,
	},
});
