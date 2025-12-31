import { snapshot } from '@af/visual-regression';
import { MediaBiggerThanColumnWidth } from './media-table.fixture';

// EDM-1081
snapshot(MediaBiggerThanColumnWidth, {
	featureFlags: {
		platform_editor_dec_a11y_fixes: true,
	},
	description: 'should render correct aspect ratio with image width bigger than table column width',
});
