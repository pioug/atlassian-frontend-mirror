import { snapshot } from '@af/visual-regression';
import SimpleStatus from '../../../examples/00-simple-status';
import {
	NeutralStatus,
	PurpleStatus,
	BlueStatus,
	RedStatus,
	YellowStatus,
	GreenStatus,
} from '../../../examples/01-status-picker';

const featureFlags = {
	platform_editor_css_migrate_stage_1: [true, false],
};

snapshot(SimpleStatus, { featureFlags });
snapshot(NeutralStatus, { featureFlags });
snapshot(PurpleStatus, { featureFlags });
snapshot(BlueStatus, { featureFlags });
snapshot(RedStatus, { featureFlags });
snapshot(YellowStatus, { featureFlags });
snapshot(GreenStatus, { featureFlags });
